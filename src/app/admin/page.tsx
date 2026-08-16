import Link from "next/link";
import { getDashboardStats } from "@/lib/stats";
import { FLAG_STATUS_LABELS, FLAG_TYPE_LABELS } from "@/lib/types";
import { formatRelativeDate } from "@/lib/format";
import { getAiSettings } from "@/lib/ai/settings";
import { createClient } from "@/lib/supabase/server";
import { AiSettingsCard } from "@/components/AiSettingsCard";

const SEVERITY_DOT: Record<string, string> = {
  low: "bg-sky-400",
  medium: "bg-amber-400",
  high: "bg-rose-500",
};

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const supabase = await createClient();
  const aiSettings = await getAiSettings(supabase);
  const maxDaily = Math.max(...stats.dailyDownloads.map((d) => d.count), 1);

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="font-mono text-xs text-slate-400">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active students", value: stats.activeStudents, note: "accounts enabled" },
          { label: "Resources", value: stats.resourceCount, note: "files uploaded" },
          { label: "Downloads today", value: stats.downloadsToday, note: "since midnight" },
          { label: "Open flags", value: stats.openFlags, note: "awaiting review" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-ink p-5 text-white shadow-lg shadow-ink/10"
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-4xl font-bold tabular-nums">{stat.value}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* 7-day downloads */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              Downloads — last 7 days
            </h2>
            <span className="font-mono text-[11px] text-slate-400">files</span>
          </div>
          <div className="mt-6 flex h-32 items-end gap-2 sm:gap-3">
            {stats.dailyDownloads.map((day) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-brand transition-all hover:bg-brand-strong"
                    style={{
                      height: `${Math.max((day.count / maxDaily) * 100, 4)}%`,
                      opacity: day.count === 0 ? 0.35 : 1,
                    }}
                    title={`${day.count} downloads`}
                  />
                </div>
                <span className="font-mono text-[10px] text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
          {stats.dailyDownloads.every((d) => d.count === 0) && (
            <p className="mt-6 rounded-lg bg-paper px-3 py-2 font-mono text-xs text-slate-400">
              &gt; no downloads recorded in the last 7 days
            </p>
          )}
        </section>

        {/* Top searches */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Top searches — 30 days
          </h2>
          {stats.topSearches.length === 0 ? (
            <p className="mt-6 rounded-lg bg-paper px-3 py-2 font-mono text-xs text-slate-400">
              &gt; no searches yet
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {stats.topSearches.map((search) => (
                <li
                  key={search.query}
                  className="flex items-baseline justify-between gap-3 font-mono text-sm"
                >
                  <span className="truncate text-ink">“{search.query}”</span>
                  <span className="shrink-0 text-xs tabular-nums text-slate-400">
                    ×{search.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* AI settings + recent flags */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
        <AiSettingsCard initial={aiSettings} />
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Recent flags
          </h2>
          <Link href="/admin/flags" className="text-xs font-semibold text-brand hover:text-brand-strong">
            Review all →
          </Link>
        </div>
        {stats.recentFlags.length === 0 ? (
          <p className="mt-5 rounded-lg bg-paper px-3 py-2 font-mono text-xs text-slate-400">
            &gt; no open flags — all clear
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-100">
            {stats.recentFlags.map((flag) => (
              <li key={flag.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${SEVERITY_DOT[flag.severity]}`} />
                  <span className="text-sm font-semibold text-ink">
                    {FLAG_TYPE_LABELS[flag.type]}
                  </span>
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {flag.student_name ?? "Unknown"} · {flag.student_email ?? "—"}
                </span>
                <span className="ml-auto font-mono text-[11px] text-slate-400">
                  {formatRelativeDate(flag.created_at)}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-700">
                  {FLAG_STATUS_LABELS[flag.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}