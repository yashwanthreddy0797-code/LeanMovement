import { CONTACT } from "@/lib/lean-kettlebell";
import { sendViaFormSubmit } from "@/lib/email/contact-mail.shared";

export type ContactEmailPayload = {
  name: string;
  email: string;
  whatsapp?: string;
  message: string;
};

const COACH_EMAIL = CONTACT.email;

function buildEmailText(data: ContactEmailPayload) {
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

function buildEmailHtml(data: ContactEmailPayload) {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    data.whatsapp ? ["WhatsApp", data.whatsapp] : null,
  ].filter(Boolean) as [string, string][];

  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;font-weight:600;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e5e5;">${value}</td></tr>`,
    )
    .join("");

  return `
    <p>New message from <strong>leanmovement.in/contact</strong></p>
    <table style="border-collapse:collapse;width:100%;max-width:560px;">${table}</table>
    <p style="margin-top:16px;white-space:pre-wrap;">${data.message.replace(/</g, "&lt;")}</p>
  `.trim();
}

export type ContactEmailDelivery = {
  ok: boolean;
  provider?: "resend" | "web3forms" | "formsubmit";
  error?: string;
};

/** Strip HTML / provider noise before showing errors to visitors. */
export function sanitizeContactDeliveryError(error?: string) {
  if (!error) {
    return `Could not send right now. Email ${COACH_EMAIL} or WhatsApp ${CONTACT.phone}.`;
  }
  if (error.includes("<!DOCTYPE") || error.includes("<html")) {
    return `Could not send right now. Email ${COACH_EMAIL} or WhatsApp ${CONTACT.phone}.`;
  }
  if (/web3forms|resend/i.test(error)) {
    return `Could not send right now. Email ${COACH_EMAIL} or WhatsApp ${CONTACT.phone}.`;
  }
  return error.length > 160 ? `${error.slice(0, 160)}…` : error;
}

export function getWeb3FormsAccessKey() {
  return (
    process.env.WEB3FORMS_ACCESS_KEY?.trim() ||
    process.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() ||
    ""
  );
}

export function hasContactEmailProvider() {
  return Boolean(process.env.RESEND_API_KEY?.trim() || getWeb3FormsAccessKey());
}

async function sendViaResend(data: ContactEmailPayload, apiKey: string) {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL not configured");
  }

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
      subject: `Contact - ${data.name}`,
      text: buildEmailText(data),
      html: buildEmailHtml(data),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${body.slice(0, 120)}`);
  }
}

export async function sendViaWeb3Forms(data: ContactEmailPayload, accessKey: string) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `LEANMOVEMENT contact - ${data.name}`,
      from_name: data.name,
      email: data.email,
      replyto: data.email,
      name: data.name,
      whatsapp: data.whatsapp || "-",
      message: data.message,
      botcheck: "",
    }),
  });

  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Web3Forms ${res.status}`);
  }

  const json = JSON.parse(bodyText) as { success?: boolean; message?: string };
  if (!json.success) {
    throw new Error(json.message || "Web3Forms rejected the message");
  }
}

/**
 * Deliver a contact form message to coach@leanmovement.in.
 * Requires RESEND_API_KEY or WEB3FORMS_ACCESS_KEY in Vercel env.
 */
export async function deliverContactEmailToCoach(
  data: ContactEmailPayload,
): Promise<ContactEmailDelivery> {
  const attempts: Array<{
    provider: ContactEmailDelivery["provider"];
    run: () => Promise<void>;
  }> = [];

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    attempts.push({ provider: "resend", run: () => sendViaResend(data, resendKey) });
  }

  const web3formsKey = getWeb3FormsAccessKey();
  if (web3formsKey) {
    attempts.push({ provider: "web3forms", run: () => sendViaWeb3Forms(data, web3formsKey) });
  }

  // FormSubmit — activated for leanmovement.in
  attempts.push({ provider: "formsubmit", run: () => sendViaFormSubmit(data) });

  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      await attempt.run();
      return { ok: true, provider: attempt.provider };
    } catch (err) {
      const message = err instanceof Error ? err.message : "email failed";
      errors.push(message);
      console.error(`[contact-mail] ${attempt.provider} failed`, message);
    }
  }

  return {
    ok: false,
    error: errors.at(-1) ?? "Could not deliver email",
  };
}

export { COACH_EMAIL, buildEmailText };
