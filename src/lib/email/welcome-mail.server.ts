import { CONTACT } from "@/lib/lean-kettlebell";
import { getServerConfig } from "@/lib/config.server";

export type WelcomeEmailInput = {
  email: string;
  fullName: string;
  amountInr: number;
};

function portalUrl(path: string) {
  const base = getServerConfig().appUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildWelcomeText({ fullName, amountInr }: WelcomeEmailInput) {
  const firstName = fullName.split(" ")[0] || fullName;
  const intakeUrl = portalUrl("/portal/intake");
  const onboardingUrl = portalUrl("/portal/book-onboarding");
  const dashboardUrl = portalUrl("/portal/dashboard");

  return [
    `Hi ${firstName},`,
    ``,
    `Welcome to Lean Movement — your payment of ₹${amountInr.toLocaleString("en-IN")} is confirmed.`,
    ``,
    `Complete these steps before your first live session:`,
    ``,
    `1. Your profile (3 min)`,
    intakeUrl,
    ``,
    `2. Book your onboarding call with Coach Mohith (30 min Zoom)`,
    onboardingUrl,
    ``,
    `3. Your member dashboard (schedule + Zoom links)`,
    dashboardUrl,
    ``,
    `Live sessions: Tuesday, Thursday & Saturday · 6:00–7:00 AM IST.`,
    ``,
    `Questions? Reply to this email or WhatsApp ${CONTACT.phone}.`,
    ``,
    `— Mohith`,
    `Lean Movement`,
  ].join("\n");
}

function buildWelcomeHtml({ fullName, amountInr }: WelcomeEmailInput) {
  const firstName = fullName.split(" ")[0] || fullName;
  const intakeUrl = portalUrl("/portal/intake");
  const onboardingUrl = portalUrl("/portal/book-onboarding");
  const dashboardUrl = portalUrl("/portal/dashboard");

  return `
    <div style="font-family:Inter,system-ui,sans-serif;color:#111;max-width:560px;line-height:1.6;">
      <p>Hi ${firstName},</p>
      <p>Welcome to <strong>Lean Movement</strong> — your payment of <strong>₹${amountInr.toLocaleString("en-IN")}</strong> is confirmed.</p>
      <p>Complete these steps before your first live session:</p>
      <ol style="padding-left:20px;">
        <li style="margin-bottom:12px;"><strong>Your profile</strong> (~3 min)<br/><a href="${intakeUrl}">${intakeUrl}</a></li>
        <li style="margin-bottom:12px;"><strong>Book your onboarding call</strong> (30 min Zoom with Coach Mohith)<br/><a href="${onboardingUrl}">${onboardingUrl}</a></li>
        <li style="margin-bottom:12px;"><strong>Member dashboard</strong> (schedule + Zoom links)<br/><a href="${dashboardUrl}">${dashboardUrl}</a></li>
      </ol>
      <p>Live sessions: <strong>Tuesday, Thursday & Saturday · 6:00–7:00 AM IST</strong>.</p>
      <p>Questions? Reply to this email or <a href="${CONTACT.whatsapp}">WhatsApp ${CONTACT.phone}</a>.</p>
      <p style="margin-top:24px;">— Mohith<br/>Lean Movement</p>
    </div>
  `.trim();
}

export function isWelcomeEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim());
}

/**
 * Sends a welcome + next-steps email to the member after first payment.
 * Requires RESEND_API_KEY + RESEND_FROM_EMAIL on the server (same as contact form).
 */
export async function sendWelcomeEmailAfterPayment(
  input: WelcomeEmailInput,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return { ok: false, error: "RESEND not configured" };
  }

  const subject = "Welcome to Lean Movement — next steps inside";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        reply_to: CONTACT.email,
        subject,
        text: buildWelcomeText(input),
        html: buildWelcomeHtml(input),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Resend ${res.status}: ${body.slice(0, 120)}`);
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "welcome email failed";
    console.error("[welcome-mail] send failed", message);
    return { ok: false, error: message };
  }
}
