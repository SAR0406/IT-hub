import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getUnit } from "@/lib/syllabus";
import SqlPlaygroundLoader from "./SqlPlaygroundLoader";

export const metadata: Metadata = {
  title: "SQL Playground — IT Hub 11",
};

export default async function SqlPlaygroundPage() {
  await requireUser();
  const unit = getUnit("rdbms");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "SQL Playground" },
        ]}
      />

      <div className="surface-card mb-8 rounded-3xl p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          ~/it-hub-11/tools/sql-playground
        </p>
        {unit && (
          <span className="pill-muted mt-3 inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {unit.name} · Chapter tool
          </span>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          SQL Playground
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          A live RDBMS environment in your browser with zero setup. Run queries,
          test ideas, and learn by immediate feedback.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Runs locally in browser
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            No impact on live data
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Mission-first practice
          </span>
        </div>
      </div>

      <SqlPlaygroundLoader />
    </div>
  );
}