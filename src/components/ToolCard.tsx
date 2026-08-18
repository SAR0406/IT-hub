import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import {
  BookSketch,
  CheckSketch,
  CodeSketch,
  PaperSketch,
} from "@/components/sketches";
import type { Tool, ToolKind } from "@/lib/tools";

type ToolCardProps = {
  tool: Tool;
  /** Optional chapter name shown as the card's mono footer. */
  unitName?: string;
};

const KIND_STYLES: Record<ToolKind, { icon: typeof CodeSketch; chip: string }> = {
  interactive: { icon: CodeSketch, chip: "bg-mint/30" },
  calculator: { icon: PaperSketch, chip: "bg-sun/30" },
  guide: { icon: BookSketch, chip: "bg-aqua/30" },
  practice: { icon: CheckSketch, chip: "bg-blush/30" },
};

export function ToolCard({ tool, unitName }: ToolCardProps) {
  const { icon: ToolIcon, chip } = KIND_STYLES[tool.kind] ?? KIND_STYLES.guide;

  return (
<Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full ${chip} transition-transform group-hover:-rotate-6`}
        >
          <ToolIcon width={20} height={20} />
        </span>
        <span className="pill-muted rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-mist">
          {tool.tag}
        </span>
      </div>

      <h3 className="font-display text-base font-bold tracking-tight text-ink">
        {tool.name}
      </h3>
      <p className="text-sm leading-relaxed text-mist">{tool.description}</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        {unitName ? (
          <span className="truncate font-mono text-[11px] text-slate-400">{unitName}</span>
        ) : (
          <span />
        )}
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition-colors group-hover:text-brand-strong">
          Open
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