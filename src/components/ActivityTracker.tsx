"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Silent page-view tracker. Rendered only for signed-in users (the layout
 * decides). One POST per navigation; failures are ignored — tracking must
 * never interfere with browsing.
 */
export function ActivityTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (pathname.startsWith("/api/")) return;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "page_view", details: { path: pathname } }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}