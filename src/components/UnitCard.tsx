import Link from "next/link";
import {
  BookSketch,
  ChatSketch,
  DatabaseSketch,
  GlobeSketch,
  JavaCupSketch,
  MonitorSketch,
  PaperSketch,
} from "@/components/sketches";
import type { Unit } from "@/lib/syllabus";

type UnitCardProps = {
  unit: Unit;
  index: number;
  resourceCount?: number;
  topicCount?: number;
};

const UNIT_ICONS: Record<string, { icon: typeof BookSketch; chip: string }> = {
  "employability-skills": { icon: ChatSketch, chip: "bg-blush/30" },
  "computer-organization": { icon: MonitorSketch, chip: "bg-aqua/30" },
  "networking-internet": { icon: GlobeSketch, chip: "bg-mint/30" },
  "office-automation-tools": { icon: PaperSketch, chip: "bg-sun/30" },
  rdbms: { icon: DatabaseSketch, chip: "bg-mint/30" },
  "fundamentals-of-java": { icon: JavaCupSketch, chip: "bg-sun/30" },
};

export function UnitCard({ unit, index, resourceCount, topicCount }: UnitCardProps) {
  const { icon: UnitIcon, chip } = UNIT_ICONS[unit.slug] ?? {
    icon: BookSketch,
    chip: "bg-blush/30",
  };

  const hasMaterial = (resourceCount ?? 0) > 0;
  const countLabel = hasMaterial
    ? `${String(index).padStart(2, "0")} · ${resourceCount} ${resourceCount === 1 ? "resource" : "resources"} live`
    : topicCount !== undefined && topicCount > 0
      ? `${String(index).padStart(2, "0")} · ${topicCount} ${topicCount === 1 ? "topic" : "topics"}`
      : `${String(index).padStart(2, "0")} · material coming soon`;

  return (
    <Link
      href={`/chapters/${unit.slug}`}
      className="group flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${chip} transition-transform group-hover:-rotate-6`}
        >
          <UnitIcon width={24} height={24} />
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-mist">
          {unit.part === "A" ? "Employability" : "Subject skills"}
        </span>
      </div>
      <h2 className="font-display text-lg font-bold tracking-tight text-ink">
        {unit.name}
      </h2>
      <p className="text-sm leading-relaxed text-mist">{unit.description}</p>
      <div className="mt-auto">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-label={`${unit.name} material`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={hasMaterial ? 100 : 0}
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r from-teal to-emerald transition-all ${
              hasMaterial ? "w-full" : "w-0"
            }`}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-xs text-mist">{countLabel}</span>
          <span className="rounded-lg bg-brand px-3.5 py-1.5 text-sm font-semibold text-white transition-colors group-hover:bg-brand-strong">
            Start
          </span>
        </div>
      </div>
    </Link>
  );
}