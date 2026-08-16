import type { ReactNode } from "react";

type Props = {
  chapterNumber: string;
  title: string;
  description: string;
  progress: number; // 0..100
  footer: ReactNode;
  updatedLabel: string;
};

/**
 * Pattern 1 — The Chapter Card. Papery effect: soft double shadow +
 * micro-border, gentle lift on hover. Not pure neumorphism (which fails
 * contrast); the border keeps definition on the warm surface.
 */
export function ChapterCard({
  chapterNumber,
  title,
  description,
  progress,
  footer,
  updatedLabel,
}: Props) {
  return (
    <div className="group rounded-xl border border-pm-hover bg-pm-surface-elevated p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08)] transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.12)]">
      <div className="flex items-center justify-between">
        <span className="ds-microlabel font-pm-mono text-pm-mute">
          {chapterNumber}
        </span>
        <span className="rounded-md bg-pm-teal/10 px-2 py-0.5 text-xs font-semibold text-pm-teal">
          {progress}%
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-pm-ink">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-pm-text2">{description}</p>

      <div className="mt-5 h-2 overflow-hidden rounded-md bg-pm-line">
        <div
          className="ds-progress-fill h-full rounded-md bg-gradient-to-r from-pm-teal to-pm-teal2"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} — ${progress}% complete`}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        {footer}
        <span className="text-xs text-pm-mute">{updatedLabel}</span>
      </div>
    </div>
  );
}