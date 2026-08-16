import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { updateStudent, deleteStudent } from "@/lib/students";

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request: Request, context: RouteContext<"/api/admin/students/[id]">) {
  const ctx = await requireAdmin();
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("Invalid request body.", 400);
  }

  const { fullName, className, studentId, isActive, resetPassword } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (fullName !== undefined && (typeof fullName !== "string" || fullName.trim().length < 2)) {
    return error("Please enter a valid full name.", 400);
  }
  if (className !== undefined && className !== null && typeof className !== "string") {
    return error("Invalid class name.", 400);
  }
  if (studentId !== undefined && studentId !== null && typeof studentId !== "string") {
    return error("Invalid roll number.", 400);
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return error("Invalid status.", 400);
  }
  if (resetPassword !== undefined && (typeof resetPassword !== "string" || resetPassword.length < 8)) {
    return error("The new password must be at least 8 characters.", 400);
  }

  const result = await updateStudent(id, {
    fullName: typeof fullName === "string" ? fullName : undefined,
    className: typeof className === "string" ? className : className === null ? null : undefined,
    studentId: typeof studentId === "string" ? studentId : studentId === null ? null : undefined,
    isActive: typeof isActive === "boolean" ? isActive : undefined,
    resetPassword: typeof resetPassword === "string" ? resetPassword : undefined,
  });

  if (!result.ok) return error(result.error, 500);

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "update_student",
    id,
    changed: Object.keys(body ?? {}).join(","),
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, context: RouteContext<"/api/admin/students/[id]">) {
  const ctx = await requireAdmin();
  const { id } = await context.params;

  const result = await deleteStudent(id);
  if (!result.ok) return error(result.error, 500);

  await logActivity(ctx.supabase, ctx.user.id, "admin_action", {
    action: "delete_student",
    id,
  });

  return NextResponse.json({ ok: true });
}