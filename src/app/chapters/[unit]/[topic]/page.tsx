import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResourceList } from "@/components/ResourceList";
import { requireUser } from "@/lib/auth";
import { getResourcesByTopic } from "@/lib/resources";
import { getTopic, getUnit } from "@/lib/syllabus";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/chapters/[unit]/[topic]">): Promise<Metadata> {
  const { unit: unitSlug, topic: topicSlug } = await params;
  const unit = getUnit(unitSlug);
  const topic = getTopic(unitSlug, topicSlug);
  return { title: topic ? `${topic.name} — ${unit?.name ?? ""}` : "Topic not found" };
}

export default async function TopicPage({
  params,
}: PageProps<"/chapters/[unit]/[topic]">) {
  const { unit: unitSlug, topic: topicSlug } = await params;
  await requireUser();
  const unit = getUnit(unitSlug);
  const topic = getTopic(unitSlug, topicSlug);

  if (!unit || !topic) notFound();

  const resources = await getResourcesByTopic(unit.slug, topic.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit.name, href: `/chapters/${unit.slug}` },
          { label: topic.name },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">
          ~/it-hub-11/units/{unit.slug}/{topic.slug}
        </p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {unit.name}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {topic.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">{topic.description}</p>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Resources
          </h2>
          <span className="font-mono text-xs text-slate-400">({resources.length})</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <ResourceList resources={resources} />
      </section>
    </div>
  );
}