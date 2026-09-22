import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler is stable in Next 16 + React 19.2 — auto-memoizes, no manual useMemo needed.
  reactCompiler: true,
  // The old "lab" section was restructured into /tools — keep old URLs alive
  // so bookmarks and the AI assistant don't break.
  redirects: async () => [
    { source: "/lab", destination: "/tools", permanent: true },
    { source: "/lab/sql", destination: "/tools/sql-playground", permanent: true },
    { source: "/lab/tools", destination: "/tools/network-calculators", permanent: true },
  ],
  // Security headers per Next.js production checklist
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
};

export default nextConfig;
