export function ResourceCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-white p-5">
      <div className="mb-2 h-3 w-1/4 rounded bg-zinc-200" />
      <div className="mb-2 h-4 w-2/3 rounded bg-zinc-100" />
      <div className="h-3 w-1/3 rounded bg-zinc-100" />
    </div>
  );
}