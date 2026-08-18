# IT Hub 11

One reliable place for Class 11 CBSE Information Technology (Code 402) students to find,
open and download their study material — notes, worksheets, question papers and practicals —
organised exactly like the official syllabus. On top of the archive sit quizzes (admin-built
MCQs with scoring and review), a real-time class chat (rooms per unit, teacher moderation)
and a browser-based SQL Playground tool for the RDBMS unit.

Students sign up instantly with their email. Every meaningful action is tracked — downloads,
searches, sign-ins, quiz attempts — and the admin panel reviews automatically-raised
misbehavior flags (banned words in search/chat, download bursts, repeated failed logins,
admin-area probes) and manages students, material, quizzes and announcements.

## Tech stack

- **Next.js 16** (App Router, Server Components) + **TypeScript**
- **Tailwind CSS v4** — design system: Space Grotesk display + Inter body + Geist Mono,
  "study terminal" identity (dark ink hero, blinking block caret, mono file-path eyebrows)
- **Supabase** — PostgreSQL (resources, profiles, activity logs, flags), Storage (private
  bucket, files stream through the server), Auth (students + admin)
- Deploys on **Vercel**

## Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon (or publishable) key from Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Service role key (Project Settings → API → `service_role`). Needed for creating / deleting / resetting student accounts, because Supabase Auth only allows service-role clients to do that. Without it the Students page explains what to add and returns a clear 501 — everything else keeps working. |
| `NVIDIA_API_KEY` | **Server-only.** Optional — required for the Ask AI chat room. Get a free key from https://build.nvidia.com; the app calls the NIM OpenAI-compatible endpoint (`NVIDIA_BASE_URL` overrides the default `https://integrate.api.nvidia.com/v1`). Without it the Ask AI room shows a "not set up yet" message. |
| `TAVILY_API_KEY` | **Server-only.** Optional — adds a live-web search tool to the AI assistant. Free tier at https://tavily.com (1,000 searches/month, no card). Without it the AI answers from the archive only. |

These `NEXT_PUBLIC_*` values are public by design (browser-safe). `SUPABASE_SERVICE_ROLE_KEY`,
`NVIDIA_API_KEY` and `TAVILY_API_KEY` are server-only — never expose them, never commit them. `.env.local` is gitignored.

## Supabase setup

1. Create a project at https://supabase.com (use a **dedicated** project — no
   other app shares this database).
2. Run the SQL in `supabase/migrations/` (SQL Editor), in filename order:

   1. `20260816_create_resources.sql` — resources table + initial policies
   2. `20260816_create_student_auth.sql` — profiles, activity log, flags, `is_admin`, RLS
   3. `20260816_add_activity_rule_functions.sql` — misbehavior rule helpers + grants
   4. `20260816_add_flag_cooldown_helper.sql` — 5-minute cooldown helper + grant
   5. `20260816_create_admin_account.sql` — `admin@ithub11.in` auth user (bcrypt hash)
   6. `20260816_fix_log_joins.sql` — FKs on logs/flags point at `profiles(id)`
   7. `20260816_harden_rls_and_grants.sql` — initplan RLS, merged insert policy, FK index, PUBLIC revoke
   8. `20260816_create_resources_bucket.sql` — private `resources` bucket (25 MB limit)
   9. `20260816_seed_demo_students.sql` — optional demo students/activity/flags
   10. `20260816_fix_storage_insert_policy.sql` — storage insert allows unit-folder paths

   The storage policies in step 2 reference the bucket; the bucket-creation
   migration makes that a no-op risk by using `on conflict do nothing`, but if
   you prefer, create the bucket first (private, 25 MB) in the dashboard.
3. Copy the project URL, anon key and service role key into `.env.local`
   (`.env.example` lists all four keys).
4. Optional demo material: `node --env-file=.env.local scripts/seed-demo.mjs`
   uploads one placeholder file per unit and registers it.

### Database schema

- `resources` — uploaded material (title, file path, unit/topic slug, type, size).
  `SELECT` requires a signed-in user; writes are admin-only.
- `profiles` — one row per account (role `student`/`admin`, class, roll number, `is_active`).
  Students read only their own row; admins read all.
- `activity_logs` — immutable audit trail: `page_view`, `search`, `resource_open`,
  `resource_download`, `login_success`, `login_failed`, `resource_upload`,
  `resource_delete`, `admin_action`, `quiz_start`, `quiz_submit`,
  `unauthorized_admin_attempt`. Guests may only insert `login_failed` rows (for brute-force
  detection). Admins read all.
- `misbehavior_flags` — raised automatically: `banned_search`, `rapid_downloads`,
  `failed_login`, `unauthorized_admin`, `chat_inappropriate`, with severity and
  `open`/`reviewed`/`dismissed` status. Admins read and review; students can only raise
  their own.
- `announcements` — teacher notices, shown at the top of the student dashboard.
- `quizzes` / `quiz_attempts` — admin-built MCQ quizzes (questions stored as JSONB, answers
  revealed only to the server) with per-student attempt history and best scores.
- `chat_messages` — real-time class chat (rooms: `general` + one per unit). RLS: signed-in
  users read/insert; only admins delete. Added to the `supabase_realtime` publication, so
  new messages stream to the browser over WebSockets. The send API rate-limits (1 per 5s),
  blocks the banned-word list and raises a `chat_inappropriate` flag on violations.

The SQL Playground (`/tools/sql-playground`) never touches the database: it runs a full Postgres inside the
student's browser via **PGlite** (WebAssembly). Every tool (SQL playground, network calculators,
e-waste calculator, security checklists) is registered in `src/lib/tools.ts` with the chapter it
belongs to and surfaced on `/tools`.

`is_admin()` is a SECURITY DEFINER helper (checks role + `is_active`), so RLS never
recurses. The four rule functions (`count_recent_actions`, `count_recent_failed_logins`,
`flag_failed_logins`, `recent_flag_exists`) are SECURITY DEFINER too, granted to
anon/authenticated — the app calls them under the user's session. All five set a strict
`search_path` and are never granted to PUBLIC (the hardening migration revokes the
default grant; the rule-function migration re-grants anon/authenticated explicitly).

The FK on `activity_logs.user_id` / `misbehavior_flags.user_id` / `.reviewed_by` points at
`profiles(id)` (which cascades from `auth.users`), so admin queries can embed the student
profile in one request: `student:profiles(full_name, email)`.

### Auth + session wiring

- Session refresh + cookie rotation happens in `src/middleware.ts` (`updateSession`), so an
  auth cookie is refreshed on every navigation — not only when a page queries Supabase.
  Route guards live in the server components (`requireUser` / `requireAdmin`), not in
  middleware, so redirect logic is not duplicated.
- Every Supabase client is typed with the generated `Database` type from
  `src/lib/supabase/database.types.ts` (server, browser, middleware, and the
  service-role client used only for admin student CRUD).

### Storage bucket

The private `resources` bucket (25 MB file limit) is created by
`20260816_create_resources_bucket.sql`. Policies:

- `SELECT` — signed-in users (the app streams files through `/api/files/[id]/open|download`,
  which checks the session, logs the action, and returns the bytes with
  `Cache-Control: private, no-store`). Guests are redirected to `/login`.
- `INSERT` / `UPDATE` / `DELETE` — admins only. Files are stored under unit
  folders (`<unit>/<timestamp>-<name>`), so the insert policy checks only
  `is_admin()`, not a per-owner folder.

Folder layout inside the bucket mirrors the syllabus slugs:

```
resources/
    employability-skills/
    computer-organization/
    networking-internet/
    office-automation-tools/
    rdbms/
    fundamentals-of-java/
```

### Accounts

- **Admin** — create via Supabase dashboard: **Authentication → Users → Add user**,
  then add a matching row in `profiles` with `role = 'admin'`. Signs in at `/admin`.
- **Students** — sign up themselves at `/register` (instant activation, auto sign-in).
  Pausing an account (admin panel) blocks sign-in immediately.

Demo accounts (from `20260816_seed_demo_students.sql`, password `student@123`):
`aarav.sharma@ithub11.in`, `priya.patel@ithub11.in`, `rohan.mehta@ithub11.in`,
`sara.khan@ithub11.in`.

## Misbehavior rules

All rules run server-side inside `src/lib/activity.ts`, silently (students are never told
they are being watched), with a 5-minute cooldown per student + rule:

- **banned_search** — search query contains a word from the banned list
- **rapid_downloads** — 8+ downloads within 60 seconds
- **failed_login** — 3+ failed sign-ins within 10 minutes (per email)
- **unauthorized_admin** — a student reached an admin-only page/API

## Local development

```bash
npm run dev
```

Seed the site with demo resources (clearly marked, tiny text files) and demo student
accounts:

```bash
node --env-file=.env.local scripts/seed-demo.mjs   # demo resources (V1)
node --env-file=.env.local supabase/seed/          # not used — students seeded via SQL migration
```

Delete demo resources from `/admin/resources` once real material is uploaded.

## Testing

```bash
npm run lint     # ESLint
npx tsc --noEmit # TypeScript
npm run build    # Production build
```

End-to-end suite (Playwright/Python, against `npm run start`): see
`C:\Users\abnup\AppData\Local\Temp\opencode\e2e_v2.py` — covers guest redirects, student
sign-in/search/download, flag raising, and the admin panel flows.

## Production deployment

1. Push the repo to GitHub.
2. Import it in Vercel (Framework preset: Next.js).
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`) in Vercel project settings.
4. Deploy. The database, bucket and accounts already live in Supabase.

## Project structure

```
src/
  app/                    # Routes: /, /chapters/..., /search, /about, /login, /admin/*, /api/*
  components/             # Navbar, UnitCard, ResourceCard, AdminNav, ActivityTracker, …
  lib/
    syllabus.ts           # Hardcoded CBSE syllabus hierarchy (the source of truth)
    resources.ts          # Resource queries (search included)
    auth.ts               # getSessionProfile, requireUser, requireAdmin guards
    activity.ts           # logActivity + misbehavior rules + admin log queries
    students.ts           # Admin CRUD for student accounts (service role)
    flags.ts              # Flag queries + status updates
    stats.ts              # Admin dashboard queries
    fileStream.ts         # Session-checked file streaming from the private bucket
    supabase/             # Server & browser Supabase clients
    supabase/database.types.ts  # Generated types (Supabase CLI / MCP typegen) — Database generic wired into all clients
    supabase/middleware.ts      # Session cookie refresh (used by src/middleware.ts)
supabase/migrations/      # SQL: tables, bucket, RLS policies, rules, demo seed
scripts/seed-demo.mjs     # V1 demo resource seed
```

## Roadmap

Tracked in detail in `SCOPE.md` (every feature marked SHIPPED / V1 / V2 / V3 / CUT).

- **V2** — Bookless mode (download unit bundles for offline/low-internet use), teacher-verified
  badges, timed quizzes, bandwidth calculators, scenario quizzes.
- **V3** — AI tutor grounded in uploaded notes, full-text PDF search, Java playground.