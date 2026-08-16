import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVITY_ACTION_LABELS,
  FLAG_STATUS_LABELS,
  FLAG_TYPE_LABELS,
  type ActivityAction,
  type FlagType,
} from "@/lib/types";
import { formatDate, formatRelativeDate } from "@/lib/format";
import { initials } from "@/lib/chat";

export const metadata = { title: "Student record" };

const SEVERITY_DOT: Record<string, string> = {
  low: "bg-sky-400",
  medium: "bg-amber-400",
  high: "bg-rose-500",
};

export default async function AdminStudentRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireAdmin();
  const supabase = await createClient();

  const [profileRes, quizzesRes, attemptsRes, activityRes, flagsRes, downloadsRes] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase.from("quizzes").select("id, title").order("created_at", { ascending: false }),
      supabase
        .from("quiz_attempts")
        .select("id, quiz_id, score, total, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activity_logs")
        .select("action, details, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(60),
      supabase
        .from("misbehavior_flags")
        .select("id, type, severity, status, details, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("activity_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", id)
        .eq("action", "resource_download"),
    ]);

  const student = profileRes.data;
  if (!student) notFound();

  const quizTitles = new Map((quizzesRes.data ?? []).map((q) => [q.id, q.title]));
  const attempts = (attemptsRes.data ?? []).map((a) => ({
    ...a,
    title: quizTitles.get(a.quiz_id) ?? "Deleted quiz",
  }));
  const best = new Map<string, { score: number; total: number; count: number }>();
  for (const attempt of attempts) {
    const current = best.get(attempt.quiz_id);
    best.set(attempt.quiz_id, {
      score: Math.max(current?.score ?? -1, attempt.score),
      total: attempt.total,
      count: (current?.count ?? 0) + 1,
    });
  }

  const openFlags = (flagsRes.data ?? []).filter((f) => f.status === "open").length;

  return (
    <div>
      <p className="font-mono text-xs text-brand">
        <Link href="/admin/students" className="hover:underline">
          ~/it-hub-11/admin/students
        </Link>{" "}
        /{student.student_id ?? student.id.slice(0, 8)}
      </p>

      {/* Profile header */}
      <section className="mt-3 flex flex-wrap items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-6">
        <span className="flex h-14 w-14 select-none items-center justify-center rounded-2xl bg-brand font-mono text-lg font-bold text-white">
          {initials(student.full_name)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            {student.full_name}
          </h1>
          <p className="mt-1 font-mono text-sm text-slate-500">
            {student.email}
            {student.class_name ? ` · ${student.class_name}` : ""}
            {student.student_id ? ` · ${student.student_id}` : ""}
            {" · joined "}
            {formatDate(student.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase ${
              student.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {student.is_active ? "Active" : "Paused"}
          </span>
          <Link
            href="/admin/students"
            className="h-9 rounded-lg border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition-colors hover:border-brand/50 hover:text-brand"
          >
            Back to students
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Quiz attempts",
            value: attempts.length,
            note: attempts.length === 1 ? "attempt" : "attempts",
          },
          {
            label: "Quizzes touched",
            value: best.size,
            note: "distinct quizzes",
          },
          {
            label: "Downloads",
            value: downloadsRes.count ?? 0,
            note: "files downloaded",
          },
          {
            label: "Open flags",
            value: openFlags,
            note: openFlags === 1 ? "flag awaiting review" : "flags awaiting review",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-ink p-5 text-white">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums">{stat.value}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Quiz performance */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Quiz performance
          </h2>
          {attempts.length === 0 ? (
            <p className="mt-5 rounded-lg bg-paper px-3 py-2 font-mono text-xs text-slate-400">
              &gt; no quiz attempts yet
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {[...best.entries()].map(([quizId, record]) => {
                const quizAttempts = attempts.filter((a) => a.quiz_id === quizId);
                const latest = quizAttempts[0]!;
                return (
                  <li
                    key={quizId}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-paper px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{latest.title}</p>
                      <p className="font-mono text-[11px] text-slate-400">
                        {record.count} {record.count === 1 ? "attempt" : "attempts"} · last{" "}
                        {formatRelativeDate(latest.created_at)}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-xl font-bold tabular-nums text-brand">
                      {record.score}/{record.total}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Flags */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Flags
          </h2>
          {flagsRes.data === null || (flagsRes.data ?? []).length === 0 ? (
            <p className="mt-5 rounded-lg bg-paper px-3 py-2 font-mono text-xs text-slate-400">
              &gt; no flags — clean record
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {(flagsRes.data ?? []).map((flag) => (
                <li
                  key={flag.id}
                  className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-paper px-4 py-3"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[flag.severity]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">
                      {FLAG_TYPE_LABELS[flag.type as FlagType] ?? flag.type}
                    </p>
                    <p className="font-mono text-[11px] text-slate-400">
                      {formatRelativeDate(flag.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-700">
                    {FLAG_STATUS_LABELS[flag.status as keyof typeof FLAG_STATUS_LABELS] ?? flag.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Activity timeline */}
      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
          Recent activity
        </h2>
        {activityRes.data === null || (activityRes.data ?? []).length === 0 ? (
          <p className="mt-5 rounded-lg bg-paper px-3 py-2 font-mono text-xs text-slate-400">
            &gt; no activity recorded yet
          </p>
        ) : (
          <ul className="mt-4 space-y-1">
            {(activityRes.data ?? []).map((entry, index) => {
              const details = entry.details as Record<string, unknown> | null;
              const label =
                ACTIVITY_ACTION_LABELS[entry.action as ActivityAction] ?? entry.action;
              const detail = details?.path ?? details?.query ?? details?.title ?? null;
              return (
                <li
                  key={`${entry.created_at}-${index}`}
                  className="flex items-baseline gap-3 border-b border-zinc-50 py-2 last:border-0"
                >
                  <span className="w-16 shrink-0 font-mono text-[10px] tabular-nums text-slate-400">
                    {formatRelativeDate(entry.created_at)}
                  </span>
                  <span className="text-sm font-semibold text-ink">{label}</span>
                  {detail && (
                    <span className="truncate font-mono text-xs text-slate-400">
                      {String(detail)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}