import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CONTACT } from "@/lib/lean-kettlebell";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { COACH_EMAIL, deliverContactEmailToCoach, sanitizeContactDeliveryError } from "@/lib/email/contact-mail.server";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  whatsapp: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1).max(5000),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

async function saveToSupabase(data: ContactFormInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const admin = getSupabaseAdmin();
  if (!admin) return { ok: false, error: "Server database not configured" };

  const { data: row, error } = await admin
    .from("contact_messages")
    .insert({
      name: data.name,
      email: data.email.toLowerCase(),
      whatsapp: data.whatsapp || null,
      message: data.message,
      source: "contact_page",
      read: false,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (/contact_messages|relation|schema/i.test(error.message)) {
      return {
        ok: false,
        error: "Run supabase/contact-messages.sql in Supabase SQL Editor, then try again.",
      };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true, id: row?.id };
}

/**
 * Contact form → coach@leanmovement.in
 * 1) Persist to Supabase when configured (coach dashboard inbox)
 * 2) Email via Resend / Web3Forms / FormSubmit
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const saved = await saveToSupabase(data);
    const delivery = await deliverContactEmailToCoach(data);

    if (delivery.ok || saved.ok) {
      return {
        ok: true as const,
        emailed: delivery.ok,
        stored: saved.ok,
        provider: delivery.provider,
        to: COACH_EMAIL,
        deliveryError: delivery.ok ? undefined : delivery.error,
      };
    }

    return {
      ok: false as const,
      message: sanitizeContactDeliveryError(
        delivery.error ||
          saved.error ||
          `Could not send. Email ${COACH_EMAIL} directly.`,
      ),
    };
  });

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

async function verifyCoach(coachId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Server not configured");
  const { data } = await admin.from("profiles").select("role").eq("id", coachId).maybeSingle();
  if (!data || (data.role !== "coach" && data.role !== "admin")) {
    throw new Error("Coach access required");
  }
  return admin;
}

export const coachListContactMessages = createServerFn({ method: "GET" })
  .inputValidator(z.object({ coachId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    const { data: rows, error } = await admin
      .from("contact_messages")
      .select("id, name, email, whatsapp, message, read, created_at")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      return { ok: false as const, message: error.message, messages: [] as ContactMessageRow[] };
    }
    return { ok: true as const, messages: (rows ?? []) as ContactMessageRow[] };
  });

export const coachMarkContactMessagesRead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ coachId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    await admin.from("contact_messages").update({ read: true }).eq("read", false);
    return { ok: true as const };
  });
