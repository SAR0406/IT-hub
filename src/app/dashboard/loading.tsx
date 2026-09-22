export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 rounded bg-zinc-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-32 rounded-2xl border border-zinc-200 bg-white" />
          <div className="h-32 rounded-2xl border border-zinc-200 bg-white" />
          <div className="h-32 rounded-2xl border border-zinc-200 bg-white" />
        </div>
        <div className="h-48 rounded-2xl border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
