import { QuizManager } from "./QuizManager";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export const metadata = { title: "Quizzes" };

export default async function AdminQuizzesPage() {
  const supabase = await createClient();

  const [{ data: quizzes }, { data: attemptRows }] = await Promise.all([
    supabase.from("quizzes").select("*").order("created_at", { ascending: false }),
    supabase.from("quiz_attempts").select("quiz_id"),
  ]);

  const attemptCounts: Record<string, number> = {};
  for (const row of attemptRows ?? []) {
    attemptCounts[row.quiz_id] = (attemptCounts[row.quiz_id] ?? 0) + 1;
  }

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/quizzes</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
        Quizzes
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Build multiple-choice quizzes per unit, then publish them. Students practise,
        get instant scores and can retake as often as they like.
      </p>

      <div className="mt-6">
        <QuizManager initial={(quizzes ?? []) as Tables<"quizzes">[]} attemptCounts={attemptCounts} />
      </div>
    </div>
  );
}