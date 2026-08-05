import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { planAmountInr, toMembershipPlan } from "@/lib/enrollment/plans";
import type { MembershipPlan } from "@/lib/supabase/types";
import {
  type EnrollmentRecord,
  getEnrollmentFromSiteConfig,
  isMissingEnrollmentTable,
  listPendingEnrollmentsFromSiteConfig,
  markEnrollmentAccountCreated,
  saveEnrollmentToSiteConfig,
} from "@/lib/enrollment/store";
import {
  listCoachAlerts,
  markCoachAlertsRead,
} from "@/lib/coach-notify";
import { SESSIONS_TO_PICK, SESSION_SLOTS, DEFAULT_SESSION_IDS } from "@/lib/sessions";

const sessionIdSchema = z.string().refine(
  (id) => SESSION_SLOTS.some((s) => s.id === id),
  "Invalid session slot",
);

const enrollmentInput = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).max(120),
  planSlug: z.string(),
  phone: z.string().max(20).optional(),
  sessionIds: z.array(sessionIdSchema).max(SESSIONS_TO_PICK).optional().default([]),
});

async function verifyCoach(coachId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Server not configured");

  const { data, error } = await admin
    .from("profiles")
    .select("role")
    .eq("id", coachId)
    .maybeSingle();

  if (error || !data || (data.role !== "coach" && data.role !== "admin")) {
    throw new Error("Coach access required");
  }
  return admin;
}

async function readEnrollmentIntent(admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>, email: string) {
  const { data, error } = await admin
    .from("enrollment_intents")
    .select("id, status, plan, amount_inr, full_name, phone, created_at")
    .eq("email", email)
    .in("status", ["pending_payment", "account_created"])
    .maybeSingle();

  if (isMissingEnrollmentTable(error)) return { source: "site_config" as const, row: null };
  if (error) throw new Error(error.message);
  if (!data) return { source: "table" as const, row: null };
  return { source: "table" as const, row: data };
}

async function saveEnrollmentIntent(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  row: {
    email: string;
    full_name: string;
    phone: string | null;
    plan: MembershipPlan;
    amount_inr: number;
    session_ids: string[];
  },
) {
  const now = new Date().toISOString();
  const record: EnrollmentRecord = {
    ...row,
    status: "pending_payment",
    payment_method: "manual",
    created_at: now,
    updated_at: now,
  };

  // Always persist full record (incl. session picks) in site_config
  await saveEnrollmentToSiteConfig(admin, record);

  const probe = await admin.from("enrollment_intents").select("id").limit(1);
  if (isMissingEnrollmentTable(probe.error)) {
    return { storage: "site_config" as const, id: record.email };
  }

  const { data: existing, error: existingError } = await admin
    .from("enrollment_intents")
    .select("id, status")
    .eq("email", row.email)
    .in("status", ["pending_payment", "account_created"])
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  const payload = {
    email: row.email,
    full_name: row.full_name,
    phone: row.phone,
    plan: row.plan,
    amount_inr: row.amount_inr,
    status: "pending_payment" as const,
    payment_method: "manual" as const,
  };

  if (existing) {
    const { error } = await admin
      .from("enrollment_intents")
      .update({ ...payload, updated_at: now })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return { storage: "table" as const, id: existing.id };
  }

  const { data: created, error } = await admin
    .from("enrollment_intents")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { storage: "table" as const, id: created.id };
}

/** Public - visitor submits enrollment from /join */
export const createEnrollment = createServerFn({ method: "POST" })
  .inputValidator(enrollmentInput)
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    try {
      const plan = toMembershipPlan(data.planSlug);
      const email = data.email.trim().toLowerCase();
      const existing = await readEnrollmentIntent(admin, email);

      if (existing.source === "table" && existing.row?.status === "account_created") {
        return {
          ok: true as const,
          enrollmentId: existing.row.id,
          storage: "table" as const,
          message: "Account already linked to this enrollment",
        };
      }

      if (existing.source === "site_config") {
        const configRow = await getEnrollmentFromSiteConfig(admin, email);
        if (configRow?.status === "account_created") {
          return {
            ok: true as const,
            enrollmentId: email,
            storage: "site_config" as const,
            message: "Account already linked to this enrollment",
          };
        }
      }

      const amount = planAmountInr(plan);
      const sessionIds =
        data.sessionIds?.length ? [...new Set(data.sessionIds)] : [...DEFAULT_SESSION_IDS];

      const saved = await saveEnrollmentIntent(admin, {
        email,
        full_name: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        plan,
        amount_inr: amount,
        session_ids: sessionIds,
      });

      return {
        ok: true as const,
        enrollmentId: saved.id,
        storage: saved.storage,
        usedFallback: saved.storage === "site_config",
      };
    } catch (err) {
      return {
        ok: false as const,
        message: err instanceof Error ? err.message : "Could not submit enrollment",
      };
    }
  });

/**
 * Create (or unlock) a member account for /join checkout.
 * Uses the service role so email confirmation never blocks Razorpay -
 * members pay on the join page, then enter the portal.
 */
export const provisionMemberForCheckout = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().min(2).max(120),
    }),
  )
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const email = data.email.trim().toLowerCase();
    const fullName = data.fullName.trim();

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "member" },
    });

    if (!createError && created.user) {
      return { ok: true as const, userId: created.user.id, created: true as const };
    }

    const alreadyExists = Boolean(
      createError && /already|registered|exists/i.test(createError.message),
    );
    if (!alreadyExists) {
      return {
        ok: false as const,
        message: createError?.message ?? "Could not create account",
      };
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return {
        ok: false as const,
        message: "Account exists - sign in with your password to complete payment",
        needsSignIn: true as const,
      };
    }

    // Confirm email so an unfinished signup can still pay immediately.
    const { error: confirmError } = await admin.auth.admin.updateUserById(profile.id, {
      email_confirm: true,
      user_metadata: { full_name: fullName, role: "member" },
    });
    if (confirmError) {
      return { ok: false as const, message: confirmError.message };
    }

    return { ok: true as const, userId: profile.id, created: false as const };
  });

/** After signup - apply chosen plan from enrollment */
export const linkEnrollmentAfterSignup = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const email = data.email.trim().toLowerCase();

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) return { ok: false as const, message: "Profile not found" };

    let plan: MembershipPlan = "monthly";
    let amountInr = planAmountInr("monthly");

    const tableIntent = await readEnrollmentIntent(admin, email);
    const configIntent = await getEnrollmentFromSiteConfig(admin, email);

    if (tableIntent.row) {
      plan = tableIntent.row.plan as MembershipPlan;
      amountInr = tableIntent.row.amount_inr ?? planAmountInr(plan);
    } else if (configIntent) {
      plan = configIntent.plan;
      amountInr = configIntent.amount_inr;
    }

    const { error } = await admin
      .from("memberships")
      .update({ plan, amount_inr: amountInr })
      .eq("user_id", profile.id);

    if (error) return { ok: false as const, message: error.message };

    if (tableIntent.source === "table" && tableIntent.row) {
      await admin
        .from("enrollment_intents")
        .update({ status: "account_created", updated_at: new Date().toISOString() })
        .eq("email", email)
        .eq("status", "pending_payment");
    }

    await markEnrollmentAccountCreated(admin, email);

    return { ok: true as const, plan };
  });

/** Coach - enrollments waiting for account or payment confirmation */
export const coachListPendingEnrollments = createServerFn({ method: "GET" })
  .inputValidator(z.object({ coachId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);

    const configRows = await listPendingEnrollmentsFromSiteConfig(admin);
    const configByEmail = new Map(configRows.map((r) => [r.email, r]));

    const { data: rows, error } = await admin
      .from("enrollment_intents")
      .select("*")
      .eq("status", "pending_payment")
      .order("created_at", { ascending: false });

    if (!isMissingEnrollmentTable(error) && !error && rows) {
      return {
        ok: true as const,
        enrollments: rows.map((r) => {
          const cfg = configByEmail.get(r.email);
          return {
            ...r,
            session_ids: cfg?.session_ids ?? [],
          };
        }),
      };
    }

    const enrollments = configRows.map((r) => ({
      id: r.email,
      email: r.email,
      full_name: r.full_name,
      phone: r.phone,
      plan: r.plan,
      amount_inr: r.amount_inr,
      status: r.status,
      payment_method: r.payment_method,
      payment_confirmed_at: null,
      created_at: r.created_at,
      session_ids: r.session_ids ?? [],
    }));

    return { ok: true as const, enrollments };
  });

/** Coach - mark offline payment received */
export const coachConfirmEnrollmentPayment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      enrollmentId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);

    const { error } = await admin
      .from("enrollment_intents")
      .update({
        payment_confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.enrollmentId)
      .eq("status", "pending_payment");

    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const coachGetRegistrationAlerts = createServerFn({ method: "GET" })
  .inputValidator(z.object({ coachId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    const alerts = await listCoachAlerts(admin);
    return { ok: true as const, alerts };
  });

export const coachMarkRegistrationAlertsRead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ coachId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    await markCoachAlertsRead(admin);
    return { ok: true as const };
  });

export type EnrollmentIntentRow = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  plan: MembershipPlan;
  amount_inr: number;
  status: "pending_payment" | "account_created" | "cancelled";
  payment_method: "manual" | "razorpay";
  payment_confirmed_at: string | null;
  created_at: string;
  session_ids?: string[];
};

export { saveMemberSessionPicks } from "@/lib/api/weekly-sessions.functions";
