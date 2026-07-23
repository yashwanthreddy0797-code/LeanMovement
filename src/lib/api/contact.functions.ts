import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CONTACT } from "@/lib/lean-kettlebell";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  whatsapp: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1).max(5000),
});

export type ContactFormInput = z.infer<typeof contactSchema>;

const COACH_EMAIL = CONTACT.email; // coach@leanmovement.in

function buildEmailText(data: ContactFormInput) {
  return [
    `New message from leanmovement.in/contact`,
    ``,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.whatsapp ? `WhatsApp: ${data.whatsapp}` : null,
    ``,
    data.message,
  ]
    .filter(Boolean)
    .join("\n");
}

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
    // Table may not exist yet
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

async function sendViaResend(data: ContactFormInput, apiKey: string) {
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "LEANMOVEMENT <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [COACH_EMAIL],
      reply_to: data.email,
      subject: `Contact — ${data.name}`,
      text: buildEmailText(data),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 200)}`);
  }
}

async function sendViaFormSubmit(data: ContactFormInput) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(COACH_EMAIL)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp || "—",
      message: data.message,
      _subject: `LEANMOVEMENT contact — ${data.name}`,
      _replyto: data.email,
      _template: "table",
      _captcha: "false",
    }),
  });

  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`FormSubmit ${res.status}: ${bodyText.slice(0, 200)}`);
  }

  try {
    const json = JSON.parse(bodyText) as { success?: string | boolean; message?: string };
    if (json.success === false) {
      throw new Error(json.message || "FormSubmit rejected");
    }
  } catch (err) {
    if (err instanceof SyntaxError) return; // non-JSON success body
    throw err;
  }
}

/**
 * Contact form → coach@leanmovement.in
 * 1) Always persist to Supabase (source of truth)
 * 2) Email via Resend (if configured) or FormSubmit
 * Success if DB save OR email succeeds.
 */
export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const saved = await saveToSupabase(data);
    let emailed = false;
    let emailError: string | undefined;

    const resendKey = process.env.RESEND_API_KEY?.trim();
    try {
      if (resendKey) {
        await sendViaResend(data, resendKey);
        emailed = true;
      } else {
        await sendViaFormSubmit(data);
        emailed = true;
      }
    } catch (err) {
      emailError = err instanceof Error ? err.message : "email failed";
      console.error("[contact] email delivery failed", emailError);

      // If Resend failed, still try FormSubmit once
      if (resendKey) {
        try {
          await sendViaFormSubmit(data);
          emailed = true;
          emailError = undefined;
        } catch (err2) {
          emailError = err2 instanceof Error ? err2.message : "email failed";
          console.error("[contact] FormSubmit fallback failed", emailError);
        }
      }
    }

    if (saved.ok || emailed) {
      return {
        ok: true as const,
        emailed,
        stored: saved.ok,
        to: COACH_EMAIL,
      };
    }

    return {
      ok: false as const,
      message:
        saved.error ||
        `Could not send. Email ${COACH_EMAIL} directly, or run supabase/contact-messages.sql.`,
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
