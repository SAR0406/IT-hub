import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResourceList } from "@/components/ResourceList";
import { ResourceListSkeleton } from "@/components/Skeletons";
import { ChevronRightIcon } from "@/components/icons";
import { getResourcesByUnit } from "@/lib/resources";
import { getUnit } from "@/lib/syllabus";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/chapters/[unit]">): Promise<Metadata> {
  const { unit: unitSlug } = await params;
  const unit = getUnit(unitSlug);
  return { title: unit ? unit.name : "Unit not found" };
}

export default async function UnitPage({ params }: PageProps<"/chapters/[unit]">) {
  const { unit: unitSlug } = await params;
  const unit = getUnit(unitSlug);

  if (!unit) notFound();

  const resources = await getResourcesByUnit(unit.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit.name },
        ]}
      />

      <div className="mb-8">
        <span className="mb-3 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          Part {unit.part}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          {unit.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">{unit.description}</p>
      </div>

      {unit.topics.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-bold text-zinc-900">Topics</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {unit.topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/chapters/${unit.slug}/${topic.slug}`}
                  className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-accent"
                >
                  {topic.name}
                  <ChevronRightIcon width={14} height={14} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-zinc-900">
          Resources{" "}
          <span className="text-base font-medium text-zinc-400">
            ({resources.length})
          </span>
        </h2>
        <Suspense fallback={<ResourceListSkeleton />}>
          <ResourceList resources={resources} />
        </Suspense>
      </section>
    </div>
  );
}