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

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer />
      {profile && <ActivityTracker />}
    </div>
  );
}