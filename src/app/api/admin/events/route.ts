import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function sanitizeOptionalText(value: unknown, maxLength: number): string | null | "invalid" {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "invalid";
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLength) return "invalid";
  return trimmed;
}

function sanitizePhotoUrl(value: unknown): string | null | "invalid" {
  const sanitized = sanitizeOptionalText(value, 1000);
  if (sanitized === null || sanitized === "invalid") return sanitized;

  try {
    const url = new URL(sanitized);
    if (!["http:", "https:"].includes(url.protocol)) return "invalid";
    return sanitized;
  } catch {
    return "invalid";
  }
}

export async function POST(request: Request) {
  const ctx = await requireAdmin();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const emoji = typeof payload.emoji === "string" ? payload.emoji.trim() : "";
  const description = sanitizeOptionalText(payload.description, 500);
  const photoUrl = sanitizePhotoUrl(payload.photo_url);
  const eventDate = sanitizeOptionalText(payload.event_date, 20);
  const displayOrder = Number.isInteger(payload.display_order) ? Number(payload.display_order) : 0;
  const isPublished = typeof payload.is_published === "boolean" ? payload.is_published : true;

  if (title.length < 3 || title.length > 120) {
    return error("Please provide an event title (3–120 characters).", 400);
  }
  if (emoji.length < 1 || emoji.length > 8) {
    return error("Please provide an emoji (1–8 characters).", 400);
  }
  if (description === "invalid") {
    return error("Description must be 500 characters or fewer.", 400);
  }
  if (photoUrl === "invalid") {
    return error("Photo URL must be a valid http/https link.", 400);
  }
  if (eventDate === "invalid") {
    return error("Event date is invalid.", 400);
  }
  if (eventDate && Number.isNaN(Date.parse(eventDate))) {
    return error("Event date is invalid.", 400);
  }
  if (displayOrder < -9999 || displayOrder > 9999) {
    return error("Display order must be between -9999 and 9999.", 400);
  }

  const { data: created, error: insertError } = await ctx.supabase
    .from("school_events")
    .insert({
      title,
      emoji,
      description,
      photo_url: photoUrl,
      event_date: eventDate,
      display_order: displayOrder,
      is_published: isPublished,
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("School event insert failed:", insertError.message);
    return error("The event could not be saved. Please try again.", 500);
  }

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "create_school_event",
    title: created.title,
  });

  return NextResponse.json(created, { status: 201 });
}
