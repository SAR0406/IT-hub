import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
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

/** One pastel accent per unit — chapters are color-coded at a glance. */
const UNIT_ACCENTS: Record<
  string,
  { icon: typeof BookSketch; chip: string; hover: string }
> = {
  "employability-skills": {
    icon: ChatSketch,
    chip: "bg-blush/40",
    hover: "hover:border-blush/70",
  },
  "computer-organization": {
    icon: MonitorSketch,
    chip: "bg-aqua/40",
    hover: "hover:border-aqua/70",
  },
  "networking-internet": {
    icon: GlobeSketch,
    chip: "bg-mint/40",
    hover: "hover:border-mint/70",
  },
  "office-automation-tools": {
    icon: PaperSketch,
    chip: "bg-sun/40",
    hover: "hover:border-sun/80",
  },
  rdbms: {
    icon: DatabaseSketch,
    chip: "bg-lilac/45",
    hover: "hover:border-lilac/80",
  },
  "fundamentals-of-java": {
    icon: JavaCupSketch,
    chip: "bg-peach/45",
    hover: "hover:border-peach/80",
  },
};

export function UnitCard({ unit, index, resourceCount, topicCount }: UnitCardProps) {
  const accent = UNIT_ACCENTS[unit.slug] ?? {
    icon: BookSketch,
    chip: "bg-blush/40",
    hover: "hover:border-brand/40",
  };
  const { icon: UnitIcon, chip, hover } = accent;

  const hasMaterial = (resourceCount ?? 0) > 0;
  const countLabel = hasMaterial
    ? `${resourceCount} ${resourceCount === 1 ? "resource" : "resources"} live`
    : topicCount !== undefined && topicCount > 0
      ? `${topicCount} ${topicCount === 1 ? "topic" : "topics"}`
      : "material coming soon";

  return (
    <Link
      href={`/chapters/${unit.slug}`}
      className={`group flex flex-col gap-3 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-soft ${hover}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${chip} transition-transform group-hover:-rotate-6`}
        >
          <UnitIcon width={24} height={24} />
        </span>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Part {unit.part}
          </span>
          <span className="font-mono text-[11px] font-semibold text-slate-400">
            UNIT/{String(index).padStart(2, "0")}
          </span>
        </div>
      </div>

      <h2 className="font-display text-lg font-bold tracking-tight text-ink">
        {unit.name}
      </h2>
      <p className="text-sm leading-relaxed text-mist">{unit.description}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="font-mono text-xs text-mist">{countLabel}</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-brand transition-colors group-hover:text-brand-strong">
          Start
          <ChevronRightIcon
            width={14}
            height={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}