export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-zinc-200" />
        <div className="h-32 rounded-2xl border border-zinc-200 bg-white" />
        <div className="h-64 rounded-2xl border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
