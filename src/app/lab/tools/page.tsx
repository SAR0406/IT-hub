import { requireUser } from "@/lib/auth";
import { CalculatorsClient } from "./CalculatorsClient";

export const metadata = {
  title: "Tools — IT Hub 11",
};

export default async function ToolsPage() {
  const ctx = await requireUser();
  if (!ctx) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs text-brand">~/it-hub-11/lab/tools</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Bandwidth & Storage Tools
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
        Quick calculators for the IT classroom — figure out how long a download
        takes, convert between storage units, or estimate monthly data usage.
        All math runs in your browser; nothing is sent anywhere.
      </p>
      <div className="mt-8">
        <CalculatorsClient />
      </div>
    </div>
  );
}