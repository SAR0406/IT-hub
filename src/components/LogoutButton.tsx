"use client";

import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex h-10 items-center gap-2 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition-colors hover:border-red-300 hover:text-red-600"
    >
      <LogoutIcon width={16} height={16} />
      Sign out
    </button>
  );
}