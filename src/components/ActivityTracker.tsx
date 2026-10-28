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

    const connection = (navigator as Navigator & { connection?: unknown }).connection as
      | { saveData?: boolean; effectiveType?: string }
      | undefined;
    const saveData = Boolean(connection?.saveData);
    const effectiveType = connection?.effectiveType ?? "";
    const isVerySlow = effectiveType === "slow-2g" || effectiveType === "2g";
    if (saveData || isVerySlow) return;

    const payload = JSON.stringify({ action: "page_view", details: { path: pathname } });
    const send = () =>
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});

    const idle = window.requestIdleCallback;
    if (idle) {
      const id = idle(send, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(send, 600);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return null;
}