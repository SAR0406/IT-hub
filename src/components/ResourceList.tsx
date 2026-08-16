import { EmptyState } from "@/components/EmptyState";
import { ResourceCard } from "@/components/ResourceCard";
import type { ResourceWithLabels } from "@/lib/types";

export function ResourceList({ resources }: { resources: ResourceWithLabels[] }) {
  if (resources.length === 0) {
    return <EmptyState kind="resources" />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}