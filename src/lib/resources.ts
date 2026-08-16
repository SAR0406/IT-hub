import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/syllabus";
import type { Resource, ResourceWithLabels } from "@/lib/types";

const SEARCH_LIMIT = 50;

type ResourceRow = Omit<Resource, "created_at"> & { created_at: string | null };

function toLabels(row: ResourceRow): ResourceWithLabels {
  const unit = UNITS.find((u) => u.slug === row.unit_slug);
  const topic = unit?.topics.find((t) => t.slug === row.topic_slug);
  return {
    ...row,
    created_at: row.created_at ?? "",
    unit_name: unit?.name ?? row.unit_slug,
    topic_name: topic?.name ?? null,
  };
}

export async function getResourceCountsByUnit(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("unit_slug");

  if (error || !data) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.unit_slug] = (counts[row.unit_slug] ?? 0) + 1;
  }
  return counts;
}

export async function getResourcesByUnit(unitSlug: string): Promise<ResourceWithLabels[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("unit_slug", unitSlug)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to load resources");
  return (data ?? []).map(toLabels);
}

export async function getResourcesByTopic(
  unitSlug: string,
  topicSlug: string
): Promise<ResourceWithLabels[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("unit_slug", unitSlug)
    .eq("topic_slug", topicSlug)
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to load resources");
  return (data ?? []).map(toLabels);
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return { ...data, created_at: data.created_at ?? "" } as Resource;
}

/**
 * Global search across resource title, file name, resource type,
 * unit name and topic name. Queries the database — never loads
 * the full table to the client.
 */
export async function searchResources(query: string): Promise<ResourceWithLabels[]> {
  const supabase = await createClient();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const lower = trimmed.toLowerCase();

  // Map the query to syllabus slugs so searches like "computer organization"
  // (with a space) match the slug "computer-organization".
  const matchedUnitSlugs = UNITS.filter((u) => u.name.toLowerCase().includes(lower)).map(
    (u) => u.slug
  );
  const matchedTopicSlugs = UNITS.flatMap((u) => u.topics)
    .filter((t) => t.name.toLowerCase().includes(lower))
    .map((t) => t.slug);

  const orClauses = [
    `title.ilike.%${trimmed}%`,
    `file_name.ilike.%${trimmed}%`,
    `resource_type.ilike.%${trimmed}%`,
    `unit_slug.ilike.%${trimmed}%`,
    `topic_slug.ilike.%${trimmed}%`,
    ...matchedUnitSlugs.map((slug) => `unit_slug.eq.${slug}`),
    ...matchedTopicSlugs.map((slug) => `topic_slug.eq.${slug}`),
  ].join(",");

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .or(orClauses)
    .order("created_at", { ascending: false })
    .limit(SEARCH_LIMIT);

  if (error) throw new Error("Search failed");
  return (data ?? []).map(toLabels);
}

export async function getAllResources(): Promise<ResourceWithLabels[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to load resources");
  return (data ?? []).map(toLabels);
}