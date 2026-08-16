import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import type { Unit } from "@/lib/syllabus";

type UnitCardProps = {
  unit: Unit;
  resourceCount: number;
};

export function UnitCard({ unit, resourceCount }: UnitCardProps) {
  return (
    <Link
      href={`/chapters/${unit.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight text-zinc-900">{unit.name}</h2>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
          Part {unit.part}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-500">{unit.description}</p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-sm font-medium text-zinc-600">
          {resourceCount} {resourceCount === 1 ? "resource" : "resources"}
        </span>
        <span className="flex items-center gap-1 text-sm font-semibold text-accent">
          Open Unit
          <ChevronRightIcon
            width={16}
            height={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}