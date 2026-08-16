import { requireUser } from "@/lib/auth";
import SqlPlaygroundLoader from "./SqlPlaygroundLoader";

export const metadata = {
  title: "SQL Lab — IT Hub 11",
};

export default async function SqlLabPage() {
  const ctx = await requireUser();
  if (!ctx) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs font-medium text-brand">~/it-hub-11/lab/sql</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        SQL Lab
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
        A live database playground that runs entirely in your browser — no setup,
        no risk. Try the missions, experiment freely, and see results instantly.
        Nothing you run here touches the real site.
      </p>
      <div className="mt-6">
        <SqlPlaygroundLoader />
      </div>
    </div>
  );
}