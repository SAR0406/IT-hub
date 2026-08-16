import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { createStudent } from "@/lib/students";
import { validatePassword } from "@/lib/password";

/**
 * POST /api/admin/students — creates a student account (auth user + profile).
 * Requires SUPABASE_SERVICE_ROLE_KEY for the auth side; without it a clear
 * 501 tells the admin what to do.
 */

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

  const { fullName, email, password, className, studentId } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 60) {
    return error("Please enter the student's full name (2–60 characters).", 400);
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return error("Please enter a valid email address.", 400);
  }
  if (typeof password !== "string") {
    return error("Please enter a password.", 400);
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return error(passwordError, 400);
  }
  if (className !== undefined && className !== null && typeof className !== "string") {
    return error("Invalid class name.", 400);
  }
  if (studentId !== undefined && studentId !== null && typeof studentId !== "string") {
    return error("Invalid roll number.", 400);
  }

  const result = await createStudent({
    fullName,
    email,
    password,
    className: typeof className === "string" ? className : null,
    studentId: typeof studentId === "string" ? studentId : null,
  });

  if (!result.ok) return error(result.error, 500);

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "create_student",
    email: email.trim().toLowerCase(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}