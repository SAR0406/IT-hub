export type WebSearchResult = {
  title: string;
  url: string;
  content: string;
};

/** True when a search provider is configured (currently Tavily's free tier). */
export function webSearchEnabled(): boolean {
  return Boolean(process.env.TAVILY_API_KEY);
}

/**
 * Free-tier web search via Tavily (1,000 searches/month, no card required).
 * The caller is responsible for keeping the result compact — the AI only
 * needs titles, urls and short snippets.
 */
export async function webSearch(query: string, maxResults = 5): Promise<WebSearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("Web search is not configured.");

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: maxResults,
      include_answer: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Web search failed (${response.status}).`);
  }

  const data = (await response.json()) as {
    results?: { title?: string; url?: string; content?: string }[];
  };

  return (data.results ?? [])
    .filter((r) => r.url)
    .map((r) => ({
      title: r.title ?? r.url!,
      url: r.url!,
      content: (r.content ?? "").slice(0, 300),
    }));
}