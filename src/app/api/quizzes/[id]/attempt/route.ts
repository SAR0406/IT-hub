import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { parseQuestions, scoreQuiz } from "@/lib/quizzes";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireUser();
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const { answers } = (body ?? {}) as Record<string, unknown>;

  const { data: quiz, error: quizError } = await ctx.supabase
    .from("quizzes")
    .select("id, title, questions, published")
    .eq("id", id)
    .maybeSingle();

  if (quizError || !quiz) {
    return error("This quiz no longer exists.", 404);
  }
  if (!quiz.published) {
    return error("This quiz isn’t available yet.", 404);
  }

  const questions = parseQuestions(quiz.questions);
  if (questions.length === 0) {
    return error("This quiz has no questions yet.", 400);
  }

  if (!Array.isArray(answers) || answers.length !== questions.length) {
    return error("Please answer every question before submitting.", 400);
  }
  for (const answer of answers) {
    if (typeof answer !== "number" || !Number.isInteger(answer) || answer < 0 || answer > 3) {
      return error("Your answers are invalid. Please try again.", 400);
    }
  }

  const score = scoreQuiz(questions, answers);

  const { error: insertError } = await ctx.supabase.from("quiz_attempts").insert({
    quiz_id: id,
    user_id: ctx.user.id,
    score,
    total: questions.length,
    answers,
  });

  if (insertError) {
    console.error("Quiz attempt insert failed:", insertError.message);
    return error("Your answers could not be saved. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "quiz_submit", {
    quiz_id: id,
    quiz_title: quiz.title,
    score,
    total: questions.length,
  });

  return NextResponse.json({ score, total: questions.length });
}