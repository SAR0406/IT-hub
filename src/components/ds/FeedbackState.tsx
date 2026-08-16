type FeedbackKind = "success" | "error" | "warning" | "info";

type Props = {
  kind: FeedbackKind;
  title: string;
  children: React.ReactNode;
};

const STYLES: Record<
  FeedbackKind,
  { bar: string; iconBg: string; iconColor: string; glyph: string; label: string }
> = {
  success: {
    bar: "bg-pm-success",
    iconBg: "bg-pm-success/10",
    iconColor: "text-pm-success",
    glyph: "✓",
    label: "Correct",
  },
  error: {
    bar: "bg-pm-error",
    iconBg: "bg-pm-error/10",
    iconColor: "text-pm-error",
    glyph: "✕",
    label: "Error",
  },
  warning: {
    bar: "bg-pm-warning",
    iconBg: "bg-pm-warning/10",
    iconColor: "text-pm-warning",
    glyph: "!",
    label: "Almost",
  },
  info: {
    bar: "bg-pm-info",
    iconBg: "bg-pm-info/10",
    iconColor: "text-pm-info",
    glyph: "i",
    label: "Note",
  },
};

/**
 * Pattern 5 — Feedback states. Left accent bar + tinted icon chip.
 * Success animates in with a slide (§8); errors show after submission only
 * (no cheating cues mid-quiz, per §7).
 */
export function FeedbackState({ kind, title, children }: Props) {
  const style = STYLES[kind];

  return (
    <div
      className={`flex gap-3.5 rounded-lg border border-pm-hover bg-pm-surface-elevated px-4 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${
        kind === "success" ? "ds-success-feedback" : ""
      }`}
      role={kind === "error" ? "alert" : "status"}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.iconBg} ${style.iconColor}`}
        aria-hidden
      >
        {style.glyph}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-pm-ink">
          <span className="ds-microlabel mr-2 text-[11px] font-mono text-pm-mute">
            {style.label}
          </span>
          {title}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-pm-text2">{children}</div>
      </div>
      <span className={`ml-auto w-1 shrink-0 rounded-full ${style.bar}`} aria-hidden />
    </div>
  );
}

/** Row of skeleton placeholders (§8) — shown while chapter content loads. */
export function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      <div className="ds-skeleton h-5 w-2/5 rounded-md" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="ds-skeleton h-4 rounded-md"
          style={{ width: `${92 - i * 9}%` }}
        />
      ))}
    </div>
  );
}