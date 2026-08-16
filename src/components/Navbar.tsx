"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/components/icons";
import { LogoutButton } from "@/components/LogoutButton";
import type { Profile } from "@/lib/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function Navbar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const homeHref = profile?.role === "admin" ? "/admin" : "/chapters";
  const links = profile?.role === "admin" ? [...NAV_LINKS, { href: "/admin", label: "Admin" }] : NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand font-mono text-sm font-bold text-white shadow-soft transition-transform group-hover:-translate-y-0.5">
            11
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight text-ink">
            IT Hub <span className="text-brand">11</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "bg-brand-soft text-brand-strong"
                  : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {profile ? (
            <>
              <Link
                href={homeHref}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pl-1 pr-3 transition-colors hover:border-brand/40"
                title={profile.full_name}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                  {initials(profile.full_name)}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {profile.full_name.split(" ")[0]}
                </span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {profile.role === "admin" ? "Admin" : "Student"}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-lift"
            >
              Get Started
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-slate-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-2 md:hidden">
          {profile && (
            <div className="mb-2 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
              <Link href={homeHref} className="flex min-w-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {initials(profile.full_name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {profile.full_name}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {profile.role === "admin" ? "Administrator" : "Student account"}
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { createClient } = await import("@/lib/supabase/client");
                    const supabase = createClient();
                    await supabase.auth.signOut();
                  } catch {
                    // Auth service unreachable — sign out locally anyway.
                  }
                  setMenuOpen(false);
                  router.push("/login");
                  router.refresh();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 hover:text-red-600"
                aria-label="Sign out"
              >
                <LogoutIcon width={17} height={17} />
              </button>
            </div>
          )}
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={`block rounded-lg px-3 py-3 text-base font-medium ${
                isActive(pathname, link.href)
                  ? "bg-brand-soft text-brand-strong"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!profile && (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex h-11 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white"
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}