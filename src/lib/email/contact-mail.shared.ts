import { CONTACT } from "@/lib/lean-kettlebell";

export type ContactEmailPayload = {
  name: string;
  email: string;
  whatsapp?: string;
  message: string;
};

function isTruthySuccess(value: unknown) {
  return value === true || value === "true";
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

/** Browser-side FormSubmit — works after one-time activation on coach@leanmovement.in */
export async function sendViaFormSubmit(data: ContactEmailPayload) {
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT.formsubmitId)}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp || "-",
      message: data.message,
      _subject: `LEANMOVEMENT contact - ${data.name}`,
      _replyto: data.email,
      _template: "table",
      _captcha: "false",
    }),
  });

  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`FormSubmit ${res.status}`);
  }

  try {
    const json = JSON.parse(bodyText) as { success?: string | boolean; message?: string };
    if (!isTruthySuccess(json.success)) {
      throw new Error(json.message || "FormSubmit rejected the message");
    }
  } catch (err) {
    if (err instanceof SyntaxError) return;
    throw err;
  }
}
