import { StudentsPanel } from "./StudentsPanel";
import { createClient } from "@/lib/supabase/server";
import { listStudents } from "@/lib/students";

export const metadata = { title: "Students" };

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const students = await listStudents(supabase);

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/students</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
        Students
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Create accounts, pause sign-ins, reset passwords or remove students. New accounts
        are ready to sign in immediately.
      </p>

      <StudentsPanel initial={students} />
    </div>
  );
}