import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { getTopic, getUnit } from "@/lib/syllabus";
import { EwasteCalculator } from "./EwasteCalculator";

export async function generateMetadata(): Promise<Metadata> {
  const unit = getUnit("employability-skills");
  const topic = getTopic("employability-skills", "green-skills");
  return { title: `E-Waste Calculator — ${topic?.name ?? ""} — ${unit?.name ?? ""}` };
}

export default async function EwasteCalculatorPage() {
  await requireUser();
  const unit = getUnit("employability-skills");
  if (!unit) notFound();
  const topic = getTopic("employability-skills", "green-skills");
  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Chapters", href: "/chapters" },
          { label: unit.name, href: `/chapters/${unit.slug}` },
          { label: topic.name, href: `/chapters/${unit.slug}/${topic.slug}` },
          { label: "E-Waste Calculator" },
        ]}
      />

      <div className="mb-10">
        <p className="font-mono text-xs text-brand">
          ~/it-hub-11/units/employability-skills/green-skills/ewaste-calculator
        </p>
        <span className="mt-3 inline-flex rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Employability Skills → Green Skills
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          E-Waste Calculator
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-500">
          Estimate the environmental impact of your electronic waste. Enter quantities to see
          CO₂ footprint and recycling potential.
        </p>
      </div>

      <EwasteCalculator />
    </div>
  );
}
