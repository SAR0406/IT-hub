import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ToolCard } from "@/components/ToolCard";
import { requireUser } from "@/lib/auth";
import { getToolsGroupedByUnit } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools — IT Hub 11",
};

export default async function ToolsPage() {
  await requireUser();
  const groups = getToolsGroupedByUnit();
  const toolCount = groups.reduce((sum, group) => sum + group.tools.length, 0);
  const unitCount = groups.length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools" },
        ]}
      />

      <div className="surface-card mb-10 rounded-3xl p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          ~/it-hub-11/tools
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Tools
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          {toolCount} calculators, playgrounds and guides mapped directly to
          the syllabus so you can jump from concept to practical work fast.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            {toolCount} tools
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            {unitCount} chapters covered
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Browser-only execution
          </span>
        </div>
      </div>

      <div className="space-y-12">
        {groups.map(({ unit, tools }) => (
          <section key={unit.slug} aria-labelledby={`tools-${unit.slug}`}>
            <div className="mb-4 flex items-center gap-3">
              <h2
                id={`tools-${unit.slug}`}
                className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-500"
              >
                {unit.name}
              </h2>
              <span className="pill-muted rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-500">
                {tools.length}
              </span>
              <span className="h-px flex-1 bg-zinc-300" />
              <Link
                href={`/chapters/${unit.slug}`}
                className="shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
              >
                Open chapter →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}