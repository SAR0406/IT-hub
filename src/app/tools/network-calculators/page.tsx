import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getUnit } from "@/lib/syllabus";
import { NetworkCalculators } from "./NetworkCalculators";

export const metadata: Metadata = {
  title: "Network Calculators — IT Hub 11",
};

export default async function NetworkCalculatorsPage() {
  await requireUser();
  const unit = getUnit("networking-internet");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Network Calculators" },
        ]}
      />

      <div className="surface-card mb-8 rounded-3xl p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          ~/it-hub-11/tools/network-calculators
        </p>
        {unit && (
          <span className="pill-muted mt-3 inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {unit.name} · Chapter tool
          </span>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Network Calculators
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Calculate transfer time, storage conversions, and monthly usage with
          classroom-ready calculators that run entirely in your browser.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Fast exam-time checks
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Download + bandwidth math
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            100% local calculations
          </span>
        </div>
      </div>

      <NetworkCalculators />
    </div>
  );
}