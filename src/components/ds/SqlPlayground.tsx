"use client";

import { useState } from "react";

type SqlRow = Record<string, string>;

type Props = {
  initialQuery?: string;
  columns?: string[];
  rows?: SqlRow[];
};

/**
 * Pattern 3 — SQL Playground. Dark editor + results table, mimicking a real
 * DB tool (VSCode/terminal convention). The Run button is simulated for the
 * design review; the real implementation will execute against the demo
 * database.
 */
export function SqlPlayground({
  initialQuery = "SELECT name, marks FROM students WHERE marks > 80;",
  columns = ["name", "marks"],
  rows = [
    { name: "AARAV SHARMA", marks: "94" },
    { name: "PRIYA PATEL", marks: "87" },
    { name: "ROHAN MEHTA", marks: "91" },
  ],
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [ranAt, setRanAt] = useState<number | null>(null);

  const run = () => {
    setRanAt(Date.now());
  };

  return (
    <div className="rounded-lg border border-pm-line bg-pm-surface-dark p-4">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded bg-pm-teal px-2.5 py-1 font-pm-mono text-xs font-semibold text-white">
          SQL
        </span>
        <button
          type="button"
          onClick={run}
          className="rounded-md bg-gradient-to-br from-pm-teal to-pm-teal2 px-4 py-2 text-sm font-medium text-white shadow-[0_4px_12px_rgba(8,145,178,0.25)] transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(8,145,178,0.35)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(8,145,178,0.2)]"
        >
          Run Query
        </button>
      </div>

      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        spellCheck={false}
        aria-label="SQL query"
        className="mt-3 min-h-36 w-full resize-y rounded-md border border-pm-line bg-pm-ink px-3.5 py-3 font-pm-mono text-sm leading-relaxed text-pm-line transition-[border-color,box-shadow] duration-200 focus:border-pm-teal focus:shadow-[0_0_0_3px_rgba(8,145,178,0.15)] focus:outline-none"
      />

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <p className="ds-microlabel font-pm-mono text-xs text-pm-mute">
            Results
          </p>
          {ranAt !== null && (
            <p className="text-xs text-pm-mute">ran just now — sample output</p>
          )}
        </div>
        <div className="mt-2 overflow-x-auto rounded-md border border-pm-line">
          <table className="w-full border-collapse font-pm-mono text-sm">
            <thead>
              <tr className="bg-pm-line/60">
                {columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-3 py-2.5 text-left font-semibold text-pm-text2"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-pm-line/50 transition-colors duration-150 hover:bg-pm-ink/40"
                >
                  {columns.map((column) => (
                    <td key={column} className="px-3 py-2.5 text-pm-surface-elevated">
                      {row[column] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}