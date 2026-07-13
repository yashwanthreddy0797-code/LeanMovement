import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

async function handleRazorpayWebhookRequest(request: Request): Promise<Response> {
  if (request.method === "GET" || request.method === "HEAD") {
    return Response.json({ ok: true, message: "Razorpay webhook endpoint" });
  }
  if (request.method !== "POST") {
    return Response.json({ ok: false, message: "Method not allowed" }, { status: 405 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const { processRazorpayWebhook } = await import("./lib/razorpay-webhook");
  const result = await processRazorpayWebhook(rawBody, signature);
  return Response.json(result.body, { status: result.status });
}

async function handleMembershipCronRequest(request: Request): Promise<Response> {
  if (request.method !== "POST" && request.method !== "GET") {
    return Response.json({ ok: false, message: "Method not allowed" }, { status: 405 });
  }
  const url = new URL(request.url);
  const secret =
    request.headers.get("x-cron-secret") ||
    url.searchParams.get("secret") ||
    "";
  const expected = process.env.CRON_SECRET;
  if (!expected || secret !== expected) {
    return Response.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { getSupabaseAdmin } = await import("./lib/supabase/server");
  const { runMembershipLifecycleJob } = await import("./lib/membership/renewal");
  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ ok: false, message: "Server not configured" }, { status: 503 });
  }
  const result = await runMembershipLifecycleJob(admin);
  return Response.json({ ok: true, ...result });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/razorpay/webhook") {
        return await handleRazorpayWebhookRequest(request);
      }
      if (url.pathname === "/api/cron/membership") {
        return await handleMembershipCronRequest(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
