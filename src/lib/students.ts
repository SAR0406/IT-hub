import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import type { Profile } from "@/lib/types";

/**
 * Admin operations on student accounts.
 *
 * Auth users can only be created/updated/deleted with the service role key
 * (Supabase Auth does not let a logged-in admin do it with the anon key).
 * It must live in SUPABASE_SERVICE_ROLE_KEY (server-side only). Without it
 * the APIs return a clear 501 instead of failing cryptically.
 */

export function serviceRoleAvailable(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function serviceRoleClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type StudentInput = {
  fullName: string;
  email: string;
  password: string;
  className?: string | null;
  studentId?: string | null;
};

export type StudentResult = { ok: true } | { ok: false; error: string };

/**
 * Creates the auth user (service role) plus the profile row. Admin-created
 * students are active immediately; self-registrations stay inactive until
 * the teacher approves them from the students panel.
 */
async function createAuthAccount(input: StudentInput, isActive: boolean): Promise<StudentResult> {
  if (!serviceRoleAvailable()) {
    return {
      ok: false,
      error:
        "The admin key (SUPABASE_SERVICE_ROLE_KEY) is not configured, so accounts cannot be created yet. Add it to .env.local — see the README.",
    };
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  const admin = serviceRoleClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: fullName },
  });
  if (createError) {
    if (createError.message.toLowerCase().includes("already")) {
      return { ok: false, error: "An account with this email already exists." };
    }
    return { ok: false, error: createError.message };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    email,
    role: "student",
    class_name: input.className?.trim() || null,
    student_id: input.studentId?.trim() || null,
    is_active: isActive,
  });

  if (profileError) {
    // Roll back the auth user so no half-created account is left behind.
    await admin.auth.admin.deleteUser(created.user.id);
    return {
      ok: false,
      error: profileError.message.includes("student_id")
        ? "That roll number is already in use."
        : "The account could not be saved. Please try again.",
    };
  }

  return { ok: true };
}

export async function createStudent(input: StudentInput): Promise<StudentResult> {
  return createAuthAccount(input, true);
}

/** Self-service sign-up: the account exists but stays inactive until the teacher approves it. */
export async function registerStudent(input: StudentInput): Promise<StudentResult> {
  return createAuthAccount(input, false);
}

export async function updateStudent(
  id: string,
  patch: {
    fullName?: string;
    className?: string | null;
    studentId?: string | null;
    isActive?: boolean;
    resetPassword?: string;
  }
): Promise<StudentResult> {
  const supabase = await createClient();
  const updates: {
    full_name?: string;
    class_name?: string | null;
    student_id?: string | null;
    is_active?: boolean;
  } = {};

  if (patch.fullName !== undefined) updates.full_name = patch.fullName.trim();
  if (patch.className !== undefined) updates.class_name = patch.className?.trim() || null;
  if (patch.studentId !== undefined) updates.student_id = patch.studentId?.trim() || null;
  if (patch.isActive !== undefined) updates.is_active = patch.isActive;

  const { error } = await supabase.from("profiles").update(updates).eq("id", id);
  if (error) {
    return {
      ok: false,
      error: error.message.includes("student_id")
        ? "That roll number is already in use."
        : "The account could not be updated. Please try again.",
    };
  }

  if (patch.resetPassword) {
    if (!serviceRoleAvailable()) {
      return {
        ok: false,
        error:
          "The password could not be reset: SUPABASE_SERVICE_ROLE_KEY is not configured.",
      };
    }
    const { error: passwordError } = await serviceRoleClient().auth.admin.updateUserById(
      id,
      { password: patch.resetPassword }
    );
    if (passwordError) {
      return { ok: false, error: "The password could not be changed. Please try again." };
    }
  }

  return { ok: true };
}

export async function deleteStudent(id: string): Promise<StudentResult> {
  if (!serviceRoleAvailable()) {
    return {
      ok: false,
      error:
        "The admin key (SUPABASE_SERVICE_ROLE_KEY) is not configured, so accounts cannot be deleted. Add it to .env.local — see the README.",
    };
  }
  const { error } = await serviceRoleClient().auth.admin.deleteUser(id);
  if (error) {
    return { ok: false, error: "The account could not be removed. Please try again." };
  }
  return { ok: true };
}

export async function listStudents(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to load students");
  return (data ?? []) as Profile[];
}