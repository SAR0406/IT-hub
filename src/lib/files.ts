const BUCKET = "resources";

function storageBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${url}/storage/v1/object/public/${BUCKET}/`;
}

/** Returns a public URL for the stored file (bucket is public). */
export function publicFileUrl(filePath: string, downloadName?: string): string {
  const base = `${storageBaseUrl()}${filePath}`;
  return downloadName ? `${base}?download=${encodeURIComponent(downloadName)}` : base;
}

/**
 * Minimal, readable HTML page shown when a resource's file is missing
 * or has been deleted from storage. Students never see raw Supabase errors.
 */
export function missingFileHtml(): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;font-family:system-ui,sans-serif;background:#fafafa;color:#18181b;display:flex;align-items:center;justify-content:center;min-height:100vh">
  <div style="text-align:center;padding:2rem">
    <p style="font-size:0.85rem;font-weight:700;letter-spacing:0.1em;color:#4f46e5;text-transform:uppercase">File unavailable</p>
    <h1 style="font-size:1.5rem;margin:0.5rem 0">This file is no longer available</h1>
    <p style="color:#52525b;max-width:30rem;margin:0.75rem auto 0">It may have been moved or removed by your teacher. Check the unit page for newer material.</p>
  </div>
</body>
</html>`;
  return new Response(html, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
}