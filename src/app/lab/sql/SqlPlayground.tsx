"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PGlite } from "@electric-sql/pglite";
import {
  LAB_ERROR_TIPS,
  LAB_MISSIONS,
  LAB_SEED_SQL,
  type LabMission,
} from "@/lib/sql/lab";

type RunResult = {
  kind: "table";
  columns: string[];
  rows: unknown[][];
} | {
  kind: "message";
  text: string;
};

const MAX_ROWS = 100;

function friendlyError(message: string): string {
  const clean = message.split("\n")[0].trim();
  for (const { match, tip } of LAB_ERROR_TIPS) {
    if (match.test(clean)) return tip;
  }
  return clean;
}

function toResult(raw: { rows?: Record<string, unknown>[]; affectedRows?: number }): RunResult {
  if (raw.rows && raw.rows.length > 0) {
    const columns = Object.keys(raw.rows[0]);
    const rows = raw.rows.map((row) => columns.map((col) => row[col]));
    return { kind: "table", columns, rows: rows.slice(0, MAX_ROWS) };
  }
  if (raw.rows && raw.rows.length === 0 && raw.affectedRows === undefined) {
    return { kind: "message", text: "0 rows returned" };
  }
  if (raw.affectedRows !== undefined) {
    return {
      kind: "message",
      text: `${raw.affectedRows} ${raw.affectedRows === 1 ? "row" : "rows"} affected`,
    };
  }
  return { kind: "message", text: "Done." };
}

function displayCell(value: unknown): string {
  if (value === null) return "NULL";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export default function SqlPlayground() {
  const dbRef = useRef<PGlite | null>(null);
  const [ready, setReady] = useState(false);
  const [booting, setBooting] = useState(true);
  const [sql, setSql] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<RunResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openMission, setOpenMission] = useState<string | null>(null);
  const [shownSolutions, setShownSolutions] = useState<Set<string>>(new Set());

  async function getDb(): Promise<PGlite> {
    if (!dbRef.current) {
      const db = new PGlite();
      await db.exec(LAB_SEED_SQL);
      dbRef.current = db;
    }
    return dbRef.current;
  }

  useEffect(() => {
    getDb()
      .then(() => setReady(true))
      .catch((err) => {
        console.error("[lab] failed to boot PGlite:", err);
        setError("The lab couldn't start in this browser. Try a newer browser or refresh.");
      })
      .finally(() => setBooting(false));
    return () => {
      void dbRef.current?.close().catch(() => {});
      dbRef.current = null;
    };
  }, []);

  const run = useCallback(async () => {
    const query = sql.trim();
    if (!query || running) return;
    setRunning(true);
    setError(null);
    setResults(null);
    try {
      const db = await getDb();
      const output = await db.exec(query);
      setResults(output.map(toResult));
    } catch (err) {
      setError(friendlyError((err as Error).message));
    } finally {
      setRunning(false);
    }
  }, [sql, running]);

  async function resetData() {
    setResults(null);
    setError(null);
    try {
      await dbRef.current?.close();
    } catch {
      /* ignore */
    }
    dbRef.current = null;
    setBooting(true);
    await getDb();
    setBooting(false);
  }

  function toggleSolution(mission: LabMission) {
    setOpenMission((current) => (current === mission.id ? null : mission.id));
    setShownSolutions((current) => {
      const next = new Set(current);
      next.add(mission.id);
      return next;
    });
  }

  const busy = booting || running;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-ink px-4 py-3">
        <p className="font-mono text-[11px] text-slate-300">
          <span className="text-blush">LAB / SQL-01</span> · postgres · wasm
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void resetData()}
            disabled={booting}
            className="rounded-lg border border-white/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            reset data
          </button>
          <span
            className={`h-2 w-2 rounded-full ${ready ? "bg-emerald" : "bg-slate-500"}`}
            aria-hidden
          />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_260px]">
        {/* Editor + output */}
        <div className="border-b border-zinc-200 lg:border-b-0 lg:border-r">
          <div className="p-3 sm:p-4">
            <label htmlFor="sql-input" className="sr-only">
              SQL query
            </label>
            <textarea
              id="sql-input"
              value={sql}
              onChange={(event) => setSql(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  void run();
                }
              }}
              spellCheck={false}
              placeholder="Type SQL here — e.g.  SELECT * FROM students;"
              className="min-h-40 w-full resize-y rounded-xl border border-zinc-300 bg-paper p-4 font-mono text-sm leading-relaxed text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[10px] text-slate-400">
                Ctrl+Enter to run · results cap at {MAX_ROWS} rows
              </p>
              <button
                type="button"
                onClick={() => void run()}
                disabled={busy || !sql.trim()}
                className="flex h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
              >
                {booting ? "Booting…" : running ? "Running…" : "Run query"}
              </button>
            </div>
          </div>

          <div className="min-h-48 border-t border-zinc-200 bg-paper px-3 py-3 sm:px-4">
            {error ? (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="font-mono text-[10px] font-bold">ERROR / </span>
                {error}
              </p>
            ) : results ? (
              <div className="space-y-4">
                {results.map((result, index) =>
                  result.kind === "table" ? (
                    <div key={index} className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-zinc-200 bg-ink text-white">
                            {result.columns.map((column) => (
                              <th key={column} className="px-3 py-2 font-mono text-[11px] font-bold">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.rows.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="border-b border-zinc-100 last:border-0 odd:bg-paper"
                            >
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 font-mono text-xs text-ink">
                                  {displayCell(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p key={index} className="font-mono text-xs text-emerald-800">
                      ✓ {result.text}
                    </p>
                  )
                )}
              </div>
            ) : (
              <p className="py-6 text-center font-mono text-xs text-slate-400">
                {booting ? "starting the database…" : "run a query to see results here"}
              </p>
            )}
          </div>
        </div>

        {/* Schema + missions */}
        <div className="space-y-4 p-3 sm:p-4">
          <section>
            <p className="font-mono text-[10px] font-bold text-slate-400">SCHEMA /</p>
            <ul className="mt-2 space-y-1 font-mono text-[11px] text-mist">
              <li><span className="font-bold text-brand">students</span> (id, name, class_name, city)</li>
              <li><span className="font-bold text-brand">marks</span> (student_id, subject, marks)</li>
              <li><span className="font-bold text-brand">subjects</span> (id, name, code)</li>
            </ul>
          </section>

          <section>
            <p className="font-mono text-[10px] font-bold text-slate-400">MISSIONS /</p>
            <ul className="mt-2 space-y-1.5">
              {LAB_MISSIONS.map((mission, index) => (
                <li key={mission.id} className="rounded-xl border border-zinc-200 bg-white">
                  <button
                    type="button"
                    onClick={() => toggleSolution(mission)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium text-ink transition-colors hover:text-brand"
                  >
                    <span className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</span>
                      {mission.title}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {shownSolutions.has(mission.id) ? "hide" : "hint"}
                    </span>
                  </button>
                  {openMission === mission.id && (
                    <div className="border-t border-zinc-100 px-3 py-2">
                      <p className="text-xs leading-relaxed text-mist">{mission.hint}</p>
                      <p className="mt-1.5 rounded-lg bg-paper px-2.5 py-1.5 font-mono text-[11px] text-brand-strong">
                        {mission.solution}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}