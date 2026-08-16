import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResourceList } from "@/components/ResourceList";
import { ResourceListSkeleton } from "@/components/Skeletons";
import { ChevronRightIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth";
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
  await requireUser();
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

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">~/it-hub-11/units/{unit.slug}</p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Part {unit.part} {unit.part === "A" ? "· Employability" : "· Subject skills"}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {unit.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">{unit.description}</p>
      </div>

      {unit.topics.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              Topics
            </h2>
            <span className="h-px flex-1 bg-zinc-200" />
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {unit.topics.map((topic, index) => (
              <li key={topic.slug}>
                <Link
                  href={`/chapters/${unit.slug}/${topic.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                >
                  <span className="truncate">
                    <span className="mr-2 font-mono text-xs text-slate-400">{index + 1}.</span>
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
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Resources
          </h2>
          <span className="font-mono text-xs text-slate-400">({resources.length})</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <Suspense fallback={<ResourceListSkeleton />}>
          <ResourceList resources={resources} />
        </Suspense>
      </section>
    </div>
  );
}