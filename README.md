# IT Hub 11

One reliable place for Class 11 CBSE Information Technology (Code 402) students to find,
open and download their study material — notes, worksheets, question papers and practicals —
organised exactly like the official syllabus.

The problem it solves is deliberately simple: students don't have the IT book, so the teacher
needs one place where material is always available. No accounts for students, no dashboards,
no gamification. Just browse → find → open/download.

## Tech stack

- **Next.js 16** (App Router, Server Components) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — PostgreSQL (resources metadata), Storage (files), Auth (admin only)
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

These are public by design (browser-safe). Never commit secrets. `.env.local` is gitignored.

Optional (only needed for the seed script):

| Variable | Description |
| --- | --- |
| `ADMIN_EMAIL` | Admin account email used by `scripts/seed-demo.mjs` |
| `ADMIN_PASSWORD` | Admin account password used by `scripts/seed-demo.mjs` |

## Supabase setup

1. Create a project at https://supabase.com.
2. Run the SQL in `supabase/migrations/20260816_create_resources.sql` (SQL Editor).
3. Create the storage bucket (see below).
4. Create the admin user (see below).
5. Copy the project URL and anon key into `.env.local`.

### Database schema

```sql
create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size bigint,
  unit_slug text not null,
  topic_slug text,
  resource_type text not null,
  description text,
  created_at timestamptz default now()
);
```

Indexes on `title`, `file_name`, `unit_slug`, `topic_slug` and `created_at`.

Row Level Security is enabled. Policies:

- `SELECT` — public (students read without accounts)
- `INSERT` / `UPDATE` / `DELETE` — authenticated only (admin)

### Storage bucket

Create one **public** bucket named `resources` with a 25 MB file size limit, then apply the
storage policies from the migration file:

- `SELECT` — public
- `INSERT` / `UPDATE` / `DELETE` — authenticated only

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

### Admin setup

IT Hub 11 uses Supabase Auth with a single admin account. Students never log in.

1. In the Supabase dashboard: **Authentication → Users → Add user**, choose email/password,
   and create the teacher's account.
2. The admin signs in at `/admin/login` (the login field is the email of that account).

All upload and delete actions verify the session server-side (`/api/resources`), and the
database and storage RLS policies are an additional guard — an unauthenticated request can
never create or remove anything.

## Local development

```bash
npm run dev
```

Seed the site with clearly-marked demo resources (one per unit, tiny text files — no fake PDFs):

```bash
node --env-file=.env.local scripts/seed-demo.mjs
```

Then delete them from `/admin` once real material is uploaded — deleting a resource removes
both the database row and the file in storage.

## Testing

```bash
npm run lint     # ESLint
npx tsc --noEmit # TypeScript
npm run build    # Production build
```

## Production deployment

1. Push the repo to GitHub.
2. Import it in Vercel (Framework preset: Next.js).
3. Add the two `NEXT_PUBLIC_*` environment variables in Vercel project settings.
4. Deploy. The database, bucket and admin user already live in Supabase.

## Project structure

```
src/
  app/                    # Routes: /, /chapters/..., /search, /about, /admin, /api/*
  components/             # Navbar, UnitCard, ResourceCard, FileUploadForm, …
  lib/
    syllabus.ts           # Hardcoded CBSE syllabus hierarchy (the source of truth)
    resources.ts          # All database queries (search included)
    supabase/             # Server & browser Supabase clients
supabase/migrations/      # SQL for table, bucket and RLS policies
scripts/seed-demo.mjs     # Demo seed data
```

## Roadmap

- **V2** — AI tutor grounded in uploaded notes, full-text PDF search, better resource
  categorization, recent uploads, favorites.
- **V3** — SQL playground (PGlite), Java browser practice, interactive tutorials.
- **V4** — Teacher analytics, assignments, student progress, exam mode.

None of these exist in V1 by design. The syllabus slugs and storage layout are the
stable boundaries future features build on.