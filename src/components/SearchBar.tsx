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
    <div className="relative">
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <SearchIcon
        width={18}
        height={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
      />
      <input
        id="search-input"
        type="search"
        role="searchbox"
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-zinc-300 bg-white pl-11 pr-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-accent focus:outline-none"
      />
    </div>
  );
}