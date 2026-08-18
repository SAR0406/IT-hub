import Link from "next/link";

export type ChapterLadderStatus = "done" | "next" | "upcoming" | "unavailable";

export type ChapterLadderStep = {
  key: string;
  number: number;
  label: string;
  description: string;
  status: ChapterLadderStatus;
  /** Small mono chip under the description, e.g. "Best: 8/10". */
  meta: string | null;
  /** Primary action for the step; null when the step is unavailable. */
  cta: { href: string; label: string } | null;
  /** Shown on the status pill when unavailable. */
  unavailableReason: string | null;
};

function statusPill(step: ChapterLadderStep) {
  switch (step.status) {
    case "done":
      return <span className="rounded-full bg-mint/40 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">Done ✓</span>;
    case "next":
      return <span className="rounded-full bg-brand px-2.5 py-1 font-mono text-[11px] font-bold text-white">Next up</span>;
    case "unavailable":
      return (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-400">
          {step.unavailableReason}
        </span>
      );
    default:
      return <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-mist">Upcoming</span>;
  }
}

function marker(step: ChapterLadderStep) {
  if (step.status === "done") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald text-[12px] font-bold text-white" aria-hidden>
        ✓
      </span>
    );
  }
  const active = step.status === "next";
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
        active
          ? "bg-brand text-white"
          : step.status === "unavailable"
            ? "border-2 border-dashed border-slate-300 text-slate-400"
            : "bg-slate-100 text-mist"
      }`}
      aria-hidden
    >
      {step.number}
    </span>
  );
}

export function ChapterLadder({ steps }: { steps: ChapterLadderStep[] }) {
  const allDone = steps.length > 0 && steps.every((step) => step.status === "done");
  const hasAnyDone = steps.some((step) => step.status === "done");

  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-soft sm:p-8"
      aria-label="Chapter ladder"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">
          Chapter ladder
        </h2>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          learn → practice → quiz
        </span>
      </div>

      <div className="relative mt-5">
        <div
          className="absolute left-1/2 top-[15px] hidden h-px w-[calc(100%-2rem)] -translate-x-1/2 border-t-2 border-dashed border-zinc-200 sm:block"
          aria-hidden
        />
        <ol className="relative grid gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.key}
              className="flex flex-col rounded-xl border border-zinc-200 bg-paper p-4"
            >
              <div className="flex items-center gap-3">
                {marker(step)}
                <p className="text-sm font-bold text-ink">{step.label}</p>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                {step.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                {statusPill(step)}
                {step.cta && (
                  <Link
                    href={step.cta.href}
                    className="shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-strong"
                  >
                    {step.cta.label} →
                  </Link>
                )}
              </div>
              {step.meta && (
                <p className="mt-3 border-t border-zinc-200 pt-2 font-mono text-[11px] text-mist">
                  {step.meta}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>

      {allDone && (
        <p className="mt-4 rounded-xl bg-mint/20 px-4 py-3 text-sm text-ink">
          Ladder complete — keep practising and retake the quiz to beat your best score.
        </p>
      )}
      {!allDone && hasAnyDone && (
        <p className="mt-4 text-xs leading-relaxed text-mist">
          Work through the stages in order — nothing is locked, but the ladder shows what
          to do next.
        </p>
      )}
    </section>
  );
}
