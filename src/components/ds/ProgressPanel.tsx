type BreakdownItem = {
  label: string;
  percent: number;
  detail?: string;
};

type Props = {
  overall: number;
  items: BreakdownItem[];
};

/**
 * Pattern 4 — Progress visualization. Overall bar + per-unit breakdown.
 * Deliberately not gamified: no streaks, no confetti — just the numbers.
 */
export function ProgressPanel({ overall, items }: Props) {
  return (
    <div className="rounded-xl border border-pm-hover bg-pm-surface-elevated p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-pm-ink">Your Progress</h3>
        <span className="font-mono text-sm font-semibold text-pm-teal">
          {overall}%
        </span>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-md bg-pm-line"
        role="progressbar"
        aria-valuenow={overall}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Overall progress ${overall}%`}
      >
        <div
          className="ds-progress-fill h-full rounded-md bg-gradient-to-r from-pm-teal to-pm-teal2"
          style={{ width: `${overall}%` }}
        />
      </div>

      <ul className="mt-6 space-y-2">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-lg border-l-3 border-transparent bg-pm-surface px-3 py-3 transition-colors duration-200 hover:border-l-pm-teal"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-pm-ink">{item.label}</p>
              {item.detail && (
                <p className="text-xs text-pm-mute">{item.detail}</p>
              )}
            </div>
            <span className="shrink-0 font-mono text-sm font-semibold text-pm-teal">
              {item.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}