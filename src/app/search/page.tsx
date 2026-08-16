"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { SearchBar } from "@/components/SearchBar";
import { ResourceCardSkeleton } from "@/components/SearchSkeletons";
import { DownloadIcon } from "@/components/icons";
import { formatBytes, formatDate } from "@/lib/format";
import type { ResourceWithLabels } from "@/lib/types";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

type SearchResult = {
  query: string;
  resources: ResourceWithLabels[];
  error: boolean;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();
  const hasQuery = trimmed.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!hasQuery) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search failed");
        const data = (await response.json()) as ResourceWithLabels[];
        setResult({ query: trimmed, resources: data, error: false });
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setResult({ query: trimmed, resources: [], error: true });
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, hasQuery]);

  const loading = hasQuery && (result === null || result.query !== trimmed);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Search</h1>
      <p className="mt-2 text-zinc-500">
        Find notes, worksheets, practicals and question papers across every unit.
      </p>

      <div className="mt-8">
        <SearchBar value={query} onChange={setQuery} autoFocus />
      </div>

      <div className="mt-8" aria-live="polite">
        {!hasQuery && (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center text-sm text-zinc-500">
            Type at least two characters to search — try “MySQL”, “java” or “key”.
          </p>
        )}

        {loading && (
          <div className="space-y-3" role="status" aria-label="Searching">
            {Array.from({ length: 3 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && result?.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="font-semibold text-red-700">Something went wrong.</p>
            <p className="mt-1 text-sm text-red-600">
              Could not search right now. Please try again.
            </p>
          </div>
        )}

        {!loading && result && !result.error && result.resources.length === 0 && (
          <EmptyState kind="search" />
        )}

        {!loading && result && !result.error && result.resources.length > 0 && (
          <div>
            <p className="mb-4 text-sm text-zinc-500">
              {result.resources.length} result{result.resources.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-zinc-800">“{result.query}”</span>
            </p>
            <ul className="space-y-3">
              {result.resources.map((resource) => (
                <li
                  key={resource.id}
                  className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/chapters/${resource.unit_slug}`}
                      className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
                    >
                      {resource.unit_name}
                      {resource.topic_name ? ` · ${resource.topic_name}` : ""}
                    </Link>
                    <h2 className="mt-1 truncate text-base font-semibold text-zinc-900">
                      {resource.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {resource.resource_type} · {formatDate(resource.created_at)} ·{" "}
                      {formatBytes(resource.file_size)}
                    </p>
                  </div>
                  <Link
                    href={`/api/files/${resource.id}/download`}
                    className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
                  >
                    <DownloadIcon width={15} height={15} />
                    Download
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}