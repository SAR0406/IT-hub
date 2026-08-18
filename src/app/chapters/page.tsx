import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader, HeaderPill } from "@/components/PageHeader";
import { UnitCard } from "@/components/UnitCard";
import { UnitCardSkeleton } from "@/components/Skeletons";
import { requireUser } from "@/lib/auth";
import { getResourceCountsByUnit } from "@/lib/resources";
import { UNITS } from "@/lib/syllabus";

async function UnitGrid() {
  const counts = await getResourceCountsByUnit();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {UNITS.map((unit, index) => (
        <UnitCard
          key={unit.slug}
          unit={unit}
          index={index + 1}
          resourceCount={counts[unit.slug] ?? 0}
          topicCount={unit.topics.length}
        />
      ))}
    </div>
  );
}

export default async function ChaptersPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters" },
        ]}
      />

      <PageHeader
        path="~/it-hub-11/units"
        title="Chapters"
        description="The complete Class 11 Information Technology syllabus — six units, two parts, every resource your teacher has published."
        meta={
          <>
            <HeaderPill>Part A · Employability</HeaderPill>
            <HeaderPill>Part B · Subject skills</HeaderPill>
            <HeaderPill>Unit / 01–06</HeaderPill>
          </>
        }
      />

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <UnitCardSkeleton key={index} />
            ))}
          </div>
        }
      >
        <UnitGrid />
      </Suspense>
    </div>
  );
}