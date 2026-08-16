import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import type { Unit } from "@/lib/syllabus";

type UnitCardProps = {
  unit: Unit;
  index: number;
  resourceCount?: number;
  topicCount?: number;
};

export function UnitCard({ unit, index, resourceCount, topicCount }: UnitCardProps) {
  const countLabel =
    resourceCount !== undefined
      ? `${resourceCount} ${resourceCount === 1 ? "resource" : "resources"}`
      : topicCount !== undefined
        ? `${topicCount} ${topicCount === 1 ? "topic" : "topics"}`
        : "No material yet";

  return (
    <Link
      href={`/chapters/${unit.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-indigo-100/60"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-semibold text-slate-400">
          {String(index).padStart(2, "0")} / {unit.part === "A" ? "part-a" : "part-b"}
        </span>
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {unit.part === "A" ? "Employability" : "Subject skills"}
        </span>
      </div>
      <h2 className="font-display text-lg font-bold tracking-tight text-ink">
        {unit.name}
      </h2>
      <p className="text-sm leading-relaxed text-slate-500">{unit.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
        <span className="font-mono text-xs text-slate-500">{countLabel}</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-brand">
          Open unit
          <ChevronRightIcon
            width={15}
            height={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}