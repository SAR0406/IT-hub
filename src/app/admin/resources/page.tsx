import { AdminResourceTable } from "@/components/AdminResourceTable";
import { FileUploadForm } from "@/components/FileUploadForm";
import { getAllResources } from "@/lib/resources";

export const metadata = { title: "Resources" };

export default async function AdminResourcesPage() {
  const resources = await getAllResources();

  return (
    <div>
      <p className="font-mono text-xs text-brand">~/it-hub-11/admin/resources</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
        Resources
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Upload new material or remove outdated files. New uploads appear for students instantly.
      </p>

      <section className="mt-8">
        <FileUploadForm />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            All resources
          </h2>
          <span className="font-mono text-xs text-slate-400">({resources.length})</span>
          <span className="h-px flex-1 bg-zinc-200" />
        </div>
        <AdminResourceTable initial={resources} />
      </section>
    </div>
  );
}