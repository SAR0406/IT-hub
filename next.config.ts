import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old "lab" section was restructured into /tools — keep old URLs alive
  // so bookmarks and the AI assistant don't break.
  redirects: async () => [
    { source: "/lab", destination: "/tools", permanent: true },
    { source: "/lab/sql", destination: "/tools/sql-playground", permanent: true },
    { source: "/lab/tools", destination: "/tools/network-calculators", permanent: true },
  ],
};

export default nextConfig;
