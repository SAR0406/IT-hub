"use client";

import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { ResourceCard } from "@/components/ResourceCard";
import { SearchBar } from "@/components/SearchBar";
import { ResourceCardSkeleton } from "@/components/SearchSkeletons";
import type { ResourceWithLabels } from "@/lib/types";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

type SearchResult = {
  query: string;
  resources: ResourceWithLabels[];
  error: boolean;
};

export default function SearchClient() {
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
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-mono text-xs text-brand">~/it-hub-11/search</p>
      <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Search
      </h1>
      <p className="mt-3 text-base text-slate-500">
        Find notes, worksheets, practicals and question papers across every unit.
      </p>

      <div className="mt-8">
        <SearchBar value={query} onChange={setQuery} autoFocus />
      </div>

      <div className="mt-8" aria-live="polite">
        {!hasQuery && (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center font-mono text-sm text-slate-500">
            &gt; type at least two characters — try "mysql", "java" or "key"
          </p>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Searching">
            {Array.from({ length: 4 }).map((_, i) => (
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
            <p className="mb-4 font-mono text-xs text-slate-500">
              &gt; {result.resources.length} result
              {result.resources.length === 1 ? "" : "s"} for{" "}
              <span className="font-semibold text-ink">“{result.query}”</span>
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}