import Link from "next/link";
import { Suspense } from "react";
import { UnitCard } from "@/components/UnitCard";
import { UnitCardSkeleton } from "@/components/Skeletons";
import { SearchIcon } from "@/components/icons";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

async function QuickAccess() {
  const counts = await getResourceCountsByUnit();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {UNITS.map((unit) => (
        <UnitCard key={unit.slug} unit={unit} resourceCount={counts[unit.slug] ?? 0} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              CBSE · Class 11 · Code 402
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">
              Class 11 <span className="text-accent">Information Technology</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-500">
              All your IT study material in one place.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/chapters"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-base font-semibold text-accent-foreground transition-colors hover:bg-indigo-700 sm:w-auto"
              >
                Explore Chapters
              </Link>
              <Link
                href="/search"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 text-base font-semibold text-zinc-800 transition-colors hover:border-accent hover:text-accent sm:w-auto"
              >
                <SearchIcon width={18} height={18} />
                Search Notes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900">Quick access</h2>
        <p className="mb-6 text-sm text-zinc-500">
          Jump straight to any unit of the syllabus.
        </p>
        <Suspense
          fallback={
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <UnitCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <QuickAccess />
        </Suspense>
      </section>
    </>
  );
}