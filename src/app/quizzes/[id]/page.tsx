import Link from "next/link";
import { QuizPlayer } from "./QuizPlayer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { requireUser } from "@/lib/auth";
import { parseQuestions } from "@/lib/quizzes";
import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/syllabus";

export const metadata = { title: "Quiz" };

export default async function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireUser();
  const { id } = await params;
  const supabase = await createClient();

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!quiz || (!quiz.published && ctx.profile.role !== "admin")) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          Quiz unavailable
        </h1>
        <p className="mt-3 text-sm text-mist">
          This quiz doesn&rsquo;t exist or hasn&rsquo;t been published yet.
        </p>
        <Link
          href="/quizzes"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-strong"
        >
          Back to quizzes
        </Link>
      </div>
    );
  }

  const questions = parseQuestions(quiz.questions);
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select("score, total")
    .eq("quiz_id", id)
    .eq("user_id", ctx.user.id);

  let best: { score: number; total: number } | null = null;
  for (const attempt of attempts ?? []) {
    if (!best || attempt.score / attempt.total > best.score / best.total) {
      best = { score: attempt.score, total: attempt.total };
    }
  }

  const unit = UNITS.find((u) => u.slug === quiz.unit_slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Quizzes", href: "/quizzes" },
          { label: quiz.title },
        ]}
      />

      <QuizPlayer
        quiz={{ id: quiz.id, title: quiz.title, description: quiz.description }}
        unitName={unit?.name ?? quiz.unit_slug}
        questions={questions}
        best={best}
        timeLimitMinutes={quiz.time_limit_minutes}
      />
    </div>
  );
}