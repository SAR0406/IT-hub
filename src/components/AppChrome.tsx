"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ActivityTracker } from "@/components/ActivityTracker";
import type { Profile } from "@/lib/types";

/**
 * Site chrome wrapper. Renders the navbar, the page content, then the
 * footer, so the footer always sits at the bottom of the page.
 * The /concepts routes are standalone art-direction studies (three
 * homepage candidates), so they render without the site chrome.
 *
 * Each area of the site gets its own accent hue (see globals.css .accent-*),
 * so the UI is multi-colored while every component keeps using the brand-*
 * token family.
 */
export function AppChrome({
  profile,
  children,
}: {
  profile: Profile | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/concepts") || pathname.startsWith("/design-system"))
    return <>{children}</>;

  const accent = pathname.startsWith("/chapters")
    ? "accent-scope-teal"
    : pathname.startsWith("/quizzes")
      ? "accent-scope-violet"
      : pathname.startsWith("/search")
        ? "accent-scope-amber"
        : pathname.startsWith("/dashboard")
          ? "accent-scope-emerald"
          : pathname.startsWith("/admin")
            ? "accent-scope-indigo"
            : pathname.startsWith("/tools")
            ? "accent-scope-sky"
            : pathname === "/login" || pathname === "/register"
              ? "accent-scope-blue"
              : "";

  return (
    <div className={`relative flex min-h-dvh flex-col ${accent}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/85 via-white/35 to-transparent"
      />
      <Navbar profile={profile} />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
      {profile && <ActivityTracker />}
    </div>
  );
}