import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ResourceList } from "@/components/ResourceList";
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

      <div className="mb-8">
        <span className="mb-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
          {unit.name}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
          {topic.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">{topic.description}</p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-zinc-900">
          Resources{" "}
          <span className="text-base font-medium text-zinc-400">
            ({resources.length})
          </span>
        </h2>
        <ResourceList resources={resources} />
      </section>
    </div>
  );
}