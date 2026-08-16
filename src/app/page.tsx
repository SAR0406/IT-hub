import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { UnitCard } from "@/components/UnitCard";
import { UNITS } from "@/lib/syllabus";

const STATS = [
  { value: "10", label: "units — the full syllabus" },
  { value: "6", label: "resource types, one format" },
  { value: "25 MB", label: "per file, guaranteed" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — the signature: syllabus as a terminal. */}
      <section className="grid-bg relative overflow-hidden bg-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="rise-in rise-in-1 font-mono text-[13px] text-indigo-300">
              ~/it-hub-11 — cbse · class 11 · information technology (402)
            </p>
            <h1 className="rise-in rise-in-2 mt-6 font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.3rem]">
              One hub for your whole IT syllabus<span className="caret" aria-hidden />
            </h1>
            <p className="rise-in rise-in-3 mt-5 max-w-md text-base leading-relaxed text-slate-400">
              Notes, worksheets, practicals and question papers — organized by unit,
              searchable in seconds, updated by your teacher.
            </p>
            <div className="rise-in rise-in-4 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chapters"
                className="flex h-12 items-center justify-center rounded-xl bg-brand px-6 text-base font-semibold text-white transition-all hover:bg-brand-strong"
              >
                Browse chapters
              </Link>
              <Link
                href="/search"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 text-base font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/10"
              >
                <SearchIcon width={17} height={17} />
                Search material
              </Link>
            </div>
            <p className="rise-in rise-in-4 mt-6 font-mono text-xs text-slate-500">
              &gt; sign in required to view material — accounts come from your teacher
            </p>
          </div>

          <div className="rise-in rise-in-3 hidden lg:block">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-soft/80 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="ml-2 font-mono text-[11px] text-slate-500">it-hub — bash</span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-7">
                <p className="text-slate-500">
                  <span className="text-emerald-400">$</span> ls units/
                </p>
                {UNITS.map((unit, index) => (
                  <p key={unit.slug} className="flex justify-between gap-4">
                    <span className="text-slate-300">
                      <span className="mr-3 text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {unit.slug}
                    </span>
                    <span className="text-slate-500">
                      {unit.topics.length > 0 ? `${unit.topics.length} topics` : "—"}
                    </span>
                  </p>
                ))}
                <p className="mt-3 text-slate-500">
                  <span className="text-emerald-400">$</span> search "mysql"
                </p>
                <p className="text-indigo-300">2 results — opening chapters/rdbms…</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-zinc-200 bg-white">
        <dl className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-3">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-2xl font-bold text-ink">{stat.value}</dd>
              <dd className="font-mono text-xs text-slate-500">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Syllabus at a glance — public, no DB reads */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-brand">~/it-hub-11/units</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Syllabus at a glance
            </h2>
          </div>
          <Link
            href="/chapters"
            className="text-sm font-semibold text-brand hover:text-brand-strong"
          >
            Open all chapters →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((unit, index) => (
            <UnitCard key={unit.slug} unit={unit} index={index + 1} topicCount={unit.topics.length} />
          ))}
        </div>
      </section>

      {/* Teachers band */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs text-brand">~/it-hub-11/admin</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
              For teachers: one panel to manage it all
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Upload material, create student accounts, and review activity — every
              download, search and sign-in is logged, with flags raised automatically
              for anything that looks off.
            </p>
          </div>
          <Link
            href="/login"
            className="flex h-11 shrink-0 items-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:text-brand"
          >
            Teacher sign in
          </Link>
        </div>
      </section>
    </>
  );
}