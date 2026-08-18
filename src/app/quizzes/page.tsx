import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuizSketch } from "@/components/sketches";
import { requireUser } from "@/lib/auth";
import { parseQuestions } from "@/lib/quizzes";
import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/syllabus";

export const metadata = { title: "Quizzes" };

export default async function QuizzesPage() {
  const ctx = await requireUser();
  const supabase = await createClient();

  const [{ data: quizzes }, { data: attempts }] = await Promise.all([
    supabase.from("quizzes").select("*").eq("published", true).order("created_at", { ascending: false }),
    supabase
      .from("quiz_attempts")
      .select("quiz_id, score, total")
      .eq("user_id", ctx.user.id),
  ]);

  const bestScores: Record<string, { score: number; total: number }> = {};
  const attemptCounts: Record<string, number> = {};
  for (const attempt of attempts ?? []) {
    attemptCounts[attempt.quiz_id] = (attemptCounts[attempt.quiz_id] ?? 0) + 1;
    const best = bestScores[attempt.quiz_id];
    if (!best || attempt.score / attempt.total > best.score / best.total) {
      bestScores[attempt.quiz_id] = { score: attempt.score, total: attempt.total };
    }
  }

  const byUnit = UNITS.map((unit) => ({
    unit,
    quizzes: (quizzes ?? []).filter((quiz) => quiz.unit_slug === unit.slug),
  })).filter((group) => group.quizzes.length > 0);
  const quizCount = byUnit.reduce((sum, group) => sum + group.quizzes.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Quizzes" },
        ]}
      />

      <div className="surface-card mb-10 rounded-3xl p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand">
          ~/it-hub-11/quizzes
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Quizzes
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Practice unit-wise MCQs, track attempts over time, and improve with
          repeatable quiz loops.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            {quizCount} live quizzes
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Best score is always saved
          </span>
          <span className="pill-muted rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold text-mist">
            Unlimited retakes
          </span>
        </div>
      </div>

      {byUnit.length === 0 ? (
        <div className="surface-card flex flex-col items-center rounded-2xl px-6 py-16 text-center">
          <QuizSketch width={44} height={44} />
          <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
            No quizzes yet
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
            Your teacher hasn&rsquo;t published any quizzes yet. Head to the chapters
            and get ahead with the material that&rsquo;s already there.
          </p>
          <Link
            href="/chapters"
            className="btn-primary mt-6 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all"
          >
            Go to chapters
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {byUnit.map(({ unit, quizzes: unitQuizzes }) => (
            <section key={unit.slug}>
              <div className="mb-4 flex items-center gap-3">
                <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {unit.name}
                </h2>
                <span className="h-px flex-1 bg-zinc-300" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {unitQuizzes.map((quiz) => {
                  const questionCount = parseQuestions(quiz.questions).length;
                  const best = bestScores[quiz.id];
                  const attempts = attemptCounts[quiz.id] ?? 0;
                  return (
                    <Link
                      key={quiz.id}
                      href={`/quizzes/${quiz.id}`}
                      className="group surface-card flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 transition-transform group-hover:-rotate-6">
                          <QuizSketch width={22} height={22} />
                        </span>
                        {best && (
                          <span className="rounded-full bg-mint/45 px-2.5 py-1 font-mono text-[11px] font-bold text-ink">
                            Best: {best.score}/{best.total}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-mist">
                          {quiz.description}
                        </p>
                      )}
                      <p className="mt-auto pt-4 font-mono text-xs text-mist">
                        {questionCount} {questionCount === 1 ? "question" : "questions"} ·{" "}
                        {attempts > 0
                          ? `${attempts} ${attempts === 1 ? "attempt" : "attempts"} so far`
                          : "not attempted yet"}
                      </p>
                      <span className="btn-primary mt-3 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-all">
                        {best ? "Retake quiz" : "Start quiz"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}