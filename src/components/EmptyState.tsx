import { FileIcon, SearchIcon } from "@/components/icons";

type EmptyStateProps = {
  kind?: "resources" | "search" | "generic";
  title?: string;
  message?: string;
};

export function EmptyState({
  kind = "resources",
  title,
  message,
}: EmptyStateProps) {
  const defaultCopy: Record<"resources" | "search" | "generic", { title: string; message: string }> = {
    resources: {
      title: "No resources uploaded yet.",
      message: "Your teacher has not added material for this topic.",
    },
    search: {
      title: "No results found.",
      message: "Try a different keyword, like the chapter or unit name.",
    },
    generic: {
      title: "Nothing here yet.",
      message: "Check back later.",
    },
  };

  const copy = {
    title: title ?? defaultCopy[kind].title,
    message: message ?? defaultCopy[kind].message,
  };

  const Icon = kind === "search" ? SearchIcon : FileIcon;

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
        <Icon width={22} height={22} />
      </span>
      <h2 className="text-base font-semibold text-ink">{copy.title}</h2>
      <p className="max-w-sm text-sm text-slate-500">{copy.message}</p>
    </div>
  );
}