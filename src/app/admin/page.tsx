import { redirect } from "next/navigation";
import { AdminResourceTable } from "@/components/AdminResourceTable";
import { FileUploadForm } from "@/components/FileUploadForm";
import { LogoutButton } from "@/components/LogoutButton";
import { getAllResources } from "@/lib/resources";
import { getAdminUser } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const resources = await getAllResources();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Signed in as {user.email ?? "admin"}. Upload new material or remove outdated files.
          </p>
        </div>
        <LogoutButton />
      </div>

      <section className="mb-10">
        <FileUploadForm />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-zinc-900">
          All resources{" "}
          <span className="text-base font-medium text-zinc-400">({resources.length})</span>
        </h2>
        <AdminResourceTable initial={resources} />
      </section>
    </div>
  );
}