<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# IT Hub 11 — Agent Quick Reference

Single-package Next.js 16 (App Router) + TypeScript + Tailwind v4 + Supabase app, deployed on Vercel. Not a monorepo. `README.md` covers setup/schema/env in detail; `SCOPE.md` is the feature-status doc. Trust code and config over either when they disagree.

## Verify before finishing

```bash
npm run lint        # ESLint (flat config, eslint-config-next)
npm run typecheck   # tsc --noEmit
npm run build       # `next build` also typechecks (not disabled in next.config.ts)
```

CI is `.github/workflows/ci.yml` (`lint → typecheck → build` on push/PR, Node 20.9). No test suite or git hooks — this chain is the gate. `npm ci` requires `engines >=20.9`.

## Environment gotchas

- Use `npm` (`package-lock.json` is npm, not pnpm/yarn) — `npm ci` then `npm run dev`. Requires Node 18.17+ / 20.9+ for Next 16.
- No `.env.local` is committed. Without `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `src/lib/supabase/server.ts` throws and signed-in server pages crash (`getSessionProfile` degrades to null). The other keys degrade gracefully: `SUPABASE_SERVICE_ROLE_KEY` (student CRUD returns 501), `NVIDIA_API_KEY` (Ask AI room off), `TAVILY_API_KEY` (no web search).

## Architecture you'd otherwise get wrong

- **Session refresh runs in `src/proxy.ts`** — Next 16 renamed middleware to proxy (README still says `src/middleware.ts`). It only refreshes cookies; route guards (`requireUser`/`requireAdmin` in `src/lib/auth.ts`) live in each server component/API route. Don't add redirect logic to the proxy.
- **Unit/topic slugs come from `src/lib/syllabus.ts`**, the hardcoded source of truth. Slugs are baked into DB rows and Storage paths (`<unit>/<timestamp>-<name>`) — never rename them.
- **RLS-first**: every query runs as the signed-in user. The only service-role client is built inline in `src/lib/students.ts` for Supabase Auth admin ops (create/delete/reset). Keep it that way.
- **Files stream through `/api/files/[id]/open|download`** (session check + activity logging), never via public bucket URLs.
- **Every tool page must be registered in `src/lib/tools.ts`**. `/lab/*` permanently redirects to `/tools/*` in `next.config.ts` — don't reintroduce `/lab` routes.
- Path alias `@/*` → `src/*`. The SQL Playground runs PGlite fully client-side (IndexedDB `idb://it-hub-sql-v1` with in-memory fallback) and never touches the live database.

## Database / migrations — read before touching schema

- Migrations are plain SQL in `supabase/migrations/`, applied **manually in filename order through the Supabase SQL Editor**. No Supabase CLI, no `config.toml`, no migration runner, no codegen script.
- Until `20260817_create_missing_tables.sql`, committed migrations only created `resources`, `profiles`, `activity_logs`, `misbehavior_flags` + bucket/functions. New file adds `announcements`, `quizzes`, `quiz_attempts`, `chat_messages`, `app_settings`, `ai_usage` + `insert_ai_message()` so `fresh DB + migrations` now boots. If you add a table, commit a dated `YYYYMMDD_*.sql` migration for it.
- `src/lib/supabase/database.types.ts` is generated (Supabase CLI / MCP typegen) and typed into `src/lib/supabase/{server,client,middleware}.ts` plus the inline service-role client in `students.ts`. Regenerate or hand-edit after schema changes. New `src/lib/env.ts` centralizes env validation (use it instead of ad-hoc `process.env` checks).

## Conventions and stale-doc traps

- `SCOPE.md` rule: one feature at a time, marked V2+ in `SCOPE.md` before a line of code is written. Check status there first — many ideas are CUT deliberately (gamification, notifications, light/dark switch).
- Demo resources seed: `node --env-file=.env.local scripts/seed-demo.mjs` (needs `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env.local`). Students come from a SQL migration, not a script.
- Stale in README: the `supabase/seed/` command (directory doesn't exist) and the Playwright e2e suite (points at a Windows temp path that isn't in this repo). Don't chase either.

## Key entrypoints

| Area | File |
|------|------|
| Session refresh (proxy) | `src/proxy.ts` → `src/lib/supabase/middleware.ts::updateSession` |
| Route guards | `src/lib/auth.ts` (`requireUser`, `requireAdmin`, `getSessionProfile`) |
| Supabase clients | `src/lib/supabase/{server,client,middleware}.ts` + inline in `students.ts` |
| Activity + rules | `src/lib/activity.ts` |
| Syllabus (slugs) | `src/lib/syllabus.ts` |
| Tool registry | `src/lib/tools.ts` |
| Resource queries | `src/lib/resources.ts` |
| Admin student CRUD | `src/lib/students.ts` (service role) |
| File streaming | `src/lib/fileStream.ts` + `src/app/api/files/[id]/open|download/route.ts` |
| AI gateway / tools | `src/lib/ai/{gateway,websearch,tools}.ts` |