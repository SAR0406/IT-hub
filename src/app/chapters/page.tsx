import Link from "next/link";
import { Suspense } from "react";
import { UnitCard } from "@/components/UnitCard";
import { UnitCardSkeleton } from "@/components/Skeletons";
import { ChevronRightIcon } from "@/components/icons";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

async function ChaptersGrid() {
  const counts = await getResourceCountsByUnit();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {UNITS.filter((u) => u.part === "B").map((unit) => (
        <UnitCard key={unit.slug} unit={unit} resourceCount={counts[unit.slug] ?? 0} />
      ))}
    </div>
  );
}

export default function ChaptersPage() {
  const partA = UNITS.filter((u) => u.part === "A");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Chapters</h1>
      <p className="mt-2 max-w-2xl text-zinc-500">
        The complete Class 11 Information Technology syllabus, organised by part and unit.
      </p>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-zinc-400">
          Part A — Employability Skills
        </h2>
        {partA.map((unit) => (
          <div
            key={unit.slug}
            className="rounded-2xl border border-zinc-200 bg-white p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{unit.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{unit.description}</p>
              </div>
              <Link
                href={`/chapters/${unit.slug}`}
                className="flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-accent hover:text-accent"
              >
                Open Unit <ChevronRightIcon width={14} height={14} />
              </Link>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {unit.topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/chapters/${unit.slug}/${topic.slug}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-accent"
                  >
                    {topic.name}
                    <ChevronRightIcon width={14} height={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-zinc-400">
          Part B — Subject-Specific Skills
        </h2>
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