# Supabase setup — Lean Kettlebell

Follow these steps once to connect the app to a live database.

## 1. Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choose a name (e.g. `lean-kettlebell`), set a database password, pick **Mumbai (ap-south-1)** if available

## 2. Run the schema

1. Open **SQL Editor** → **New query**
2. Copy the entire contents of [`schema.sql`](./schema.sql)
3. Click **Run**

This creates tables, RLS policies, triggers, and seed data (live sessions, circuits, recordings, config).

If you already ran an older `schema.sql` and see **infinite recursion** errors, run [`fix-rls.sql`](./fix-rls.sql) instead (or use `npm run supabase:fix-rls` with `SUPABASE_DB_URL` in `.env`).

## 3. Auth settings (important for dev)

1. **Authentication** → **Providers** → Email → ensure enabled
2. For local dev, disable email confirmation:
   - **Authentication** → **Providers** → Email → turn off **Confirm email**
   - Or: **Authentication** → **URL configuration** → add `http://localhost:8080/**` to redirect URLs

### Branded auth emails (not “Supabase Auth”)

Default signup emails are sent from `noreply@mail.app.supabase.io` as **Supabase Auth**. To use your brand:

1. **Authentication** → **Email Templates** → **Confirm signup**
   - Subject: `Confirm your LEANMOVEMENT account`
   - Body: use your copy + `{{ .ConfirmationURL }}` for the link (see [Supabase template vars](https://supabase.com/docs/guides/auth/auth-email-templates))

2. **Production — custom sender name** (recommended):
   - **Authentication** → **SMTP Settings** → enable custom SMTP
   - Use [Resend](https://resend.com), SendGrid, or Google Workspace
   - Set **Sender email** e.g. `noreply@yourdomain.com`
   - Set **Sender name** e.g. `LEANMOVEMENT` or `Lean Kettlebell`
   - Removes “powered by Supabase” footer on transactional emails

3. **Dev shortcut:** keep **Confirm email** OFF so signups work instantly without waiting for email.

### Coach schedule → member dashboard sync

Coach and members share one table: **`live_sessions`**.

1. Coach edits links at **Coach → Live Schedule** → saves to `live_sessions`
2. Members read the same table on **Dashboard** and **Live Sessions**
3. Run [`realtime.sql`](./realtime.sql) once so member pages refresh instantly when the coach saves (no manual reload)

Members must have **active** membership (RLS) to see sessions.

## 4. Environment variables

From **Project Settings** → **API**:

```bash
cp .env.example .env
```

Fill in:

| Variable | Where to find it |
|----------|------------------|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (server only — never commit) |

Restart the dev server:

```bash
npm run dev
```

Verify connection:

```bash
npm run supabase:verify
```

## 5. Create your coach account

**Option A — one command (recommended)**

```bash
npm run supabase:create-coach
```

Default credentials (dev only — change after first login):

| Field | Value |
|-------|-------|
| Email | `coach@leanmovement.in` |
| Password | `LeanCoach@2026` |

Custom email/password:

```bash
COACH_EMAIL=you@email.com COACH_PASSWORD='YourSecurePass1!' npm run supabase:create-coach
```

Then log in at `/portal/login` → you’ll be redirected to `/portal/coach`.

**Option B — manual**

1. Visit `/portal/signup` and create an account
2. In Supabase → **Table Editor** → `profiles` → set `role` to **`coach`**
3. In **`memberships`** → set `status` to **`active`**

## 6. Test the flow

```
/portal/signup     → create account (membership = pending)
/portal/dashboard  → paywall shown
/portal/admin      → Activate your account (as coach)
/portal/dashboard  → live sessions, recordings, circuits from DB
```

## 7. Activate beta members (until Razorpay is live)

1. Member signs up at `/portal/signup`
2. Coach goes to `/portal/admin`
3. Click **Activate** on their row

## Tables overview

| Table | Purpose |
|-------|---------|
| `profiles` | User info + role (member/coach) |
| `memberships` | Payment status, plan, renewals |
| `onboarding` | Foundations + WhatsApp progress |
| `live_sessions` | Mon/Wed/Sat schedule + Meet links |
| `recordings` | Session video URLs |
| `circuits` | 5 kettlebell circuits |
| `site_config` | WhatsApp, Calendly, cohort date |

## Updating content (no code deploy)

Edit in Supabase **Table Editor**:

- **live_sessions** → change `join_url` for Google Meet links
- **recordings** → add rows with YouTube embed URLs (`https://www.youtube.com/embed/VIDEO_ID`)
- **circuits** → edit exercises JSON array
- **site_config** → update WhatsApp invite, Calendly URL

## When Razorpay is ready

Add to `.env` (never commit):

```
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...   # optional — from Razorpay → Webhooks
```

Flow: `/join` → `/portal/checkout` → **Pay with Razorpay** → membership auto-activates.

Optional webhook in Razorpay dashboard:
- URL: `https://www.leanmovement.in/api/razorpay/webhook` (or your Vercel domain)
- Events: `payment.captured`
- Secret → `RAZORPAY_WEBHOOK_SECRET` in `.env` / Vercel

Checkout verification still activates membership without the webhook.
Server handlers: `src/lib/razorpay.server.ts`, `src/lib/razorpay-webhook.ts`, `src/server.ts`.
