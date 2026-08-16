"use client";

import { SearchIcon } from "@/components/icons";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  label?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search notes, worksheets, question papers…",
  autoFocus = false,
  label = "Search",
}: SearchBarProps) {
  return (
    <div className="group relative">
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <SearchIcon
        width={18}
        height={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand"
      />
      <input
        id="search-input"
        type="search"
        role="searchbox"
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-13 w-full rounded-xl border border-zinc-300 bg-white py-3.5 pl-11 pr-4 text-base text-ink shadow-sm placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
      />
      <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:block">
        enter ↵
      </kbd>
    </div>
  );
}