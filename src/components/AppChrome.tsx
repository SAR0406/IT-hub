"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ActivityTracker } from "@/components/ActivityTracker";
import type { Profile } from "@/lib/types";

/**
 * Site chrome wrapper. The /concepts routes are standalone art-direction
 * studies (three homepage candidates), so they render without the site
 * navbar, footer or activity tracker.
 */
export function AppChrome({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();

  if (pathname.startsWith("/concepts")) return null;

  return (
    <>
      <Navbar profile={profile} />
      <Footer />
      {profile && <ActivityTracker />}
    </>
  );
}