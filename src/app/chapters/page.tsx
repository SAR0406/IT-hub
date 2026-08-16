import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UnitCard } from "@/components/UnitCard";
import { UnitCardSkeleton } from "@/components/Skeletons";
import { ChevronRightIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

async function ChaptersGrid() {
  const counts = await getResourceCountsByUnit();
  const partB = UNITS.filter((u) => u.part === "B");
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {partB.map((unit) => (
        <UnitCard
          key={unit.slug}
          unit={unit}
          index={UNITS.indexOf(unit) + 1}
          resourceCount={counts[unit.slug] ?? 0}
        />
      ))}
    </div>
  );
}

export default async function ChaptersPage() {
  await requireUser();
  const partA = UNITS.filter((u) => u.part === "A");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters" },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">~/it-hub-11/units</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Chapters
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">
          The complete Class 11 Information Technology syllabus, organised by part and unit.
        </p>
      </div>

      <section className="mb-12">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Part A — Employability Skills
          </h2>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        {partA.map((unit) => (
          <div
            key={unit.slug}
            className="mb-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-colors hover:border-brand/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] text-slate-400">
                  {String(UNITS.indexOf(unit) + 1).padStart(2, "0")} / part-a
                </p>
                <h3 className="mt-0.5 font-display text-lg font-bold tracking-tight text-ink">
                  {unit.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{unit.description}</p>
              </div>
              <Link
                href={`/chapters/${unit.slug}`}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:text-brand"
              >
                Open unit <ChevronRightIcon width={14} height={14} />
              </Link>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {unit.topics.map((topic, topicIndex) => (
                <li key={topic.slug}>
                  <Link
                    href={`/chapters/${unit.slug}/${topic.slug}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-paper px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                  >
                    <span className="truncate">
                      <span className="mr-2 font-mono text-xs text-slate-400">
                        {topicIndex + 1}.
                      </span>
                      {topic.name}
                    </span>
                    <ChevronRightIcon
                      width={14}
                      height={14}
                      className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Part B — Subject-Specific Skills
          </h2>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <UnitCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ChaptersGrid />
        </Suspense>
      </section>
    </div>
  );
}