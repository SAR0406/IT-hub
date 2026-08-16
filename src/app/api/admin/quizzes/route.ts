import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { validateQuestions } from "@/lib/quizzes";
import { UNITS } from "@/lib/syllabus";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const ctx = await requireAdmin();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const { title, description, unitSlug, questions, published } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
    return error("Please give the quiz a title (3–120 characters).", 400);
  }
  if (typeof unitSlug !== "string" || !UNITS.some((u) => u.slug === unitSlug)) {
    return error("Please choose a valid unit.", 400);
  }
  if (description !== undefined && description !== null && typeof description !== "string") {
    return error("Invalid description.", 400);
  }

  const validation = validateQuestions(questions);
  if (!validation.ok) return error(validation.error, 400);

  const { data: created, error: insertError } = await ctx.supabase
    .from("quizzes")
    .insert({
      title: title.trim(),
      description: typeof description === "string" && description.trim() ? description.trim() : null,
      unit_slug: unitSlug,
      questions: validation.questions,
      published: published === true,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Quiz insert failed:", insertError.message);
    return error("The quiz could not be saved. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "create_quiz",
    title: created.title,
    unit: unitSlug,
  });

  return NextResponse.json(created, { status: 201 });
}