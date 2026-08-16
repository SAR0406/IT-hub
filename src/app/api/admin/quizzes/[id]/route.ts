import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { validateQuestions } from "@/lib/quizzes";
import { UNITS } from "@/lib/syllabus";
import type { Json } from "@/lib/supabase/database.types";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireAdmin();
  const { id } = await params;

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

  const updates: {
    title?: string;
    description?: string | null;
    unit_slug?: string;
    questions?: Json;
    published?: boolean;
  } = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
      return error("Please give the quiz a title (3–120 characters).", 400);
    }
    updates.title = title.trim();
  }
  if (unitSlug !== undefined) {
    if (typeof unitSlug !== "string" || !UNITS.some((u) => u.slug === unitSlug)) {
      return error("Please choose a valid unit.", 400);
    }
    updates.unit_slug = unitSlug;
  }
  if (description !== undefined) {
    if (description !== null && typeof description !== "string") {
      return error("Invalid description.", 400);
    }
    updates.description = typeof description === "string" && description.trim() ? description.trim() : null;
  }
  if (questions !== undefined) {
    const validation = validateQuestions(questions);
    if (!validation.ok) return error(validation.error, 400);
    updates.questions = validation.questions;
  }
  if (published !== undefined) {
    if (typeof published !== "boolean") return error("Invalid publish setting.", 400);
    updates.published = published;
  }

  const { data: updated, error: updateError } = await ctx.supabase
    .from("quizzes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("Quiz update failed:", updateError.message);
    return error("The quiz could not be saved. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "update_quiz",
    title: updated.title,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireAdmin();
  const { id } = await params;

  const { data: deleted, error: deleteError } = await ctx.supabase
    .from("quizzes")
    .delete()
    .eq("id", id)
    .select("title")
    .single();

  if (deleteError) {
    return error("The quiz could not be removed. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "delete_quiz",
    title: deleted.title,
  });

  return NextResponse.json({ ok: true });
}