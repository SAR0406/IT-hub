import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { requireUser } from "@/lib/auth";
import { formatRelativeDate } from "@/lib/format";
import { getResourceCountsByUnit } from "@/lib/resources";
import {
  analyzeUnitPerformance,
  STRONG_ACCURACY_THRESHOLD,
  WEAK_ACCURACY_THRESHOLD,
} from "@/lib/quizzes";
import { UNITS } from "@/lib/syllabus";

export const metadata: Metadata = {
  title: "Dashboard",
};

type DetailsRow = Record<string, unknown> | null;

const ACTION_LABELS: Record<string, string> = {
  resource_open: "Opened",
  resource_download: "Downloaded",
  search: "Searched for",
  login: "Signed in",
  logout: "Signed out",
  quiz_start: "Started quiz",
  quiz_submit: "Submitted quiz",
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", soon: false },
  { href: "/chapters", label: "Chapters", soon: false },
  { href: "/quizzes", label: "Quizzes", soon: false },
  { href: "/tools", label: "Tools", soon: false },
  { href: "/search", label: "Search", soon: false },
  { href: "/chat", label: "Chat", soon: false },
  { href: "/bookless", label: "Offline Packs", soon: false },
];

export default async function DashboardPage() {
  const ctx = await requireUser();
  if (ctx.profile.role === "admin") redirect("/admin");

  const [activityRes, counts, announcementsRes, attemptsRes, quizzesRes] = await Promise.all([
    ctx.supabase
      .from("activity_logs")
      .select("action, details, created_at")
      .eq("user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(8),
    getResourceCountsByUnit(),
    ctx.supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
    ctx.supabase
      .from("quiz_attempts")
      .select("quiz_id, score, total")
      .eq("user_id", ctx.user.id),
    ctx.supabase.from("quizzes").select("id, unit_slug").eq("published", true),
  ]);

  const { data: activity } = activityRes;
  const { data: announcements } = announcementsRes;
  const { data: attempts } = attemptsRes;
  const { data: quizzes } = quizzesRes;

  const rows = (activity ?? []) as unknown as {
    action: string;
    details: DetailsRow;
    created_at: string;
  }[];

  const explored = new Set<string>();
  for (const row of rows) {
    if (row.action === "resource_open" || row.action === "resource_download") {
      const unit = row.details?.unit;
      if (typeof unit === "string" && unit) explored.add(unit);
    }
  }

  const exploredCount = explored.size;
  const progress = Math.round((exploredCount / UNITS.length) * 100);

  const unitRank = new Map(UNITS.map((unit, index) => [unit.slug, index]));
  const unitName = new Map(UNITS.map((unit) => [unit.slug, unit.name]));
  const performance = analyzeUnitPerformance(attempts ?? [], quizzes ?? []).sort(
    (a, b) =>
      (unitRank.get(a.unitSlug) ?? Number.MAX_SAFE_INTEGER) -
      (unitRank.get(b.unitSlug) ?? Number.MAX_SAFE_INTEGER)
  );
  const weakAreas = performance.filter((unit) => unit.verdict === "weak");
  const onTrack = performance.filter(
    (unit) =>
      unit.verdict === "strong" ||
      (unit.verdict === "building" && unit.accuracy >= WEAK_ACCURACY_THRESHOLD)
  );
  const insufficient = performance.filter((unit) => unit.verdict === "insufficient");

  const mission = [
    {
      label: "Open a chapter and read the material",
      done: rows.some((r) => r.action === "resource_open"),
    },
    {
      label: "Download a worksheet or practical",
      done: rows.some((r) => r.action === "resource_download"),
    },
    {
      label: "Try the search — find a topic in seconds",
      done: rows.some((r) => r.action === "search"),
    },
    {
      label: "Take a quiz and beat your score",
      done: rows.some((r) => r.action === "quiz_submit"),
    },
    { label: "Check your dashboard", done: true },
  ];
  const missionDone = mission.filter((m) => m.done).length;

  const firstName = ctx.profile.full_name.split(/\s+/)[0] ?? "Student";
  const recentActivityCount = rows.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Mobile nav strip */}
      <nav
        className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden"
        aria-label="Dashboard navigation"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-disabled={item.soon}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              item.soon
                ? "pill-muted text-slate-400"
                : item.label === "Dashboard"
                  ? "btn-primary text-white"
                  : "surface-card text-ink"
            }`}
          >
            {item.label}
            {item.soon && " · soon"}
          </Link>
        ))}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="surface-card sticky top-24 rounded-2xl p-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-strong text-sm font-bold text-white">
                {ctx.profile.full_name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0]!.toUpperCase())
                  .join("")}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">
                  {ctx.profile.full_name}
                </span>
                <span className="block text-xs text-mist">Student account</span>
              </span>
            </div>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Dashboard navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-disabled={item.soon}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    item.soon
                      ? "cursor-not-allowed text-slate-400"
                      : item.label === "Dashboard"
                        ? "bg-white text-brand-strong shadow-soft"
                        : "text-mist hover:bg-white hover:text-ink"
                  }`}
                >
                  {item.label}
                  {item.soon && " — soon"}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 space-y-6">
          <div className="surface-card rounded-3xl p-6 sm:p-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
              your workspace
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Hi {firstName} — Your Progress
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Keep momentum with one focused mission list, per-unit visibility, and quiz-based
              accuracy signals.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
                {progress}% syllabus progress
              </span>
              <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
                {missionDone}/{mission.length} mission tasks done
              </span>
              <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
                {recentActivityCount} recent activities
              </span>
            </div>
          </div>

          {/* Announcements */}
          {(announcements ?? []).length > 0 && (
            <section aria-label="Announcements" className="space-y-3">
              {(announcements ?? []).map((announcement) => (
                <div
                  key={announcement.id}
                  className="surface-card rounded-2xl border-l-4 border-brand p-5"
                >
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
                    {announcement.title}
                    <span className="font-mono text-[11px] font-normal text-slate-400">
                      {formatRelativeDate(announcement.created_at)}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-mist">
                    {announcement.body}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Overall progress */}
          <section className="surface-card rounded-2xl p-6 sm:p-8" aria-label="Overall progress">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                Syllabus progress
              </h2>
              <span className="font-mono text-sm font-semibold text-teal">{progress}%</span>
            </div>
            <div
              className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-100/90"
              role="progressbar"
              aria-label="Syllabus progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal to-emerald transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-mist">
              {exploredCount} of {UNITS.length} units explored — progress follows the
              chapters and worksheets you open.
            </p>
          </section>

          {/* Quiz analysis — weak areas */}
          <section
            className="surface-card rounded-2xl p-6 sm:p-8"
            aria-label="Where to focus"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                Where to focus
              </h2>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                analysis / quiz data
              </span>
            </div>

            {performance.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-zinc-300 px-5 py-8 text-center">
                <p className="text-sm text-mist">
                  No quiz data yet — take a quiz and your answers get analysed unit by unit.
                </p>
                <Link
                  href="/quizzes"
                  className="btn-primary mt-4 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-all"
                >
                  Take a quiz
                </Link>
              </div>
            ) : (
              <>
                {weakAreas.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {weakAreas.map((unit) => {
                      const unitSlug = unit.unitSlug;
                      const percent = Math.round((unit.accuracy ?? 0) * 100);
                      return (
                        <li key={unitSlug} className="surface-elevated rounded-xl p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-ink">
                              {unitName.get(unitSlug) ?? unitSlug}
                            </p>
                            <span className="font-mono text-sm font-bold text-red-600">
                              {percent}%
                            </span>
                          </div>
                          <div
                            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"
                            role="img"
                            aria-label={`${percent}% accuracy`}
                          >
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-red-400 to-amber-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="font-mono text-[11px] text-mist">
                              {unit.correct}/{unit.total} correct — below{" "}
                              {Math.round(WEAK_ACCURACY_THRESHOLD * 100)}%
                            </p>
                            <Link
                              href={`/chapters/${unitSlug}`}
                              className="shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
                            >
                              Review material →
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-xl bg-mint/20 px-4 py-3 text-sm text-ink">
                    Nothing flagged — your quiz accuracy is above{" "}
                    {Math.round(WEAK_ACCURACY_THRESHOLD * 100)}% everywhere you&rsquo;ve
                    practised.
                  </p>
                )}

                {onTrack.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      on track
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {onTrack.map((unit) => {
                        const percent = Math.round((unit.accuracy ?? 0) * 100);
                        const isStrong = (unit.accuracy ?? 0) >= STRONG_ACCURACY_THRESHOLD;
                        return (
                          <span
                            key={unit.unitSlug}
                            className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold text-ink ${
                              isStrong ? "bg-mint/40" : "bg-slate-100"
                            }`}
                          >
                            {unitName.get(unit.unitSlug) ?? unit.unitSlug} · {percent}%
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {insufficient.length > 0 && (
                  <p className="mt-4 text-xs leading-relaxed text-mist">
                    {insufficient.length === 1
                      ? `Answer a few more questions in ${unitName.get(insufficient[0]!.unitSlug) ?? insufficient[0]!.unitSlug} for a verdict.`
                      : `Answer a few more questions in ${insufficient
                          .slice(0, 3)
                          .map((unit) => unitName.get(unit.unitSlug) ?? unit.unitSlug)
                          .join(", ")} for a verdict.`}
                  </p>
                )}
              </>
            )}
          </section>

          {/* Per-unit breakdown */}
          <section aria-label="Progress by unit">
            <h2 className="mb-3 font-display text-lg font-bold tracking-tight text-ink">
              By chapter
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {UNITS.map((unit) => {
                const done = explored.has(unit.slug);
                const count = counts[unit.slug] ?? 0;
                return (
                  <Link
                    key={unit.slug}
                    href={`/chapters/${unit.slug}`}
                    className="surface-card rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs font-semibold text-mist">
                        {String(UNITS.indexOf(unit) + 1).padStart(2, "0")} /{" "}
                        {unit.part === "A" ? "part-a" : "part-b"}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                          done ? "bg-mint/30 text-ink" : "bg-slate-100 text-mist"
                        }`}
                      >
                        {done ? "Explored" : "Not started"}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-bold tracking-tight text-ink">
                      {unit.name}
                    </h3>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-teal to-emerald ${
                          done ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                    <p className="mt-2 font-mono text-xs text-mist">
                      {count > 0 ? `${count} ${count === 1 ? "resource" : "resources"}` : "No material yet"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Mission + activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="surface-card rounded-2xl p-6" aria-label="Today's mission">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                  Today&rsquo;s Mission
                </h2>
                <span className="font-mono text-xs font-semibold text-teal">
                  {missionDone}/{mission.length}
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                {mission.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
                        item.done
                          ? "border-emerald bg-emerald text-white"
                          : "border-slate-300 text-transparent"
                      }`}
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm ${item.done ? "text-mist" : "font-medium text-ink"}`}
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="surface-card rounded-2xl p-6" aria-label="Recent activity">
              <h2 className="font-display text-lg font-bold tracking-tight text-ink">
                Recent activity
              </h2>
              {rows.length === 0 ? (
                <p className="mt-4 text-sm text-mist">
                  Nothing yet — open a chapter or search for a topic to get started.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {rows.map((row, i) => {
                    const label = ACTION_LABELS[row.action] ?? row.action;
                    const title =
                      typeof row.details?.title === "string" ? row.details.title : null;
                    return (
                      <li key={`${row.created_at}-${i}`} className="flex items-baseline gap-3">
                        <span className="h-2 w-2 shrink-0 translate-y-[-2px] rounded-full bg-teal" aria-hidden />
                        <span className="min-w-0 flex-1 truncate text-sm text-ink">
                          <span className="font-semibold">{label}</span>
                          {title && <span className="text-mist"> — {title}</span>}
                        </span>
                        <span className="shrink-0 font-mono text-[11px] text-mist">
                          {formatRelativeDate(row.created_at)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}