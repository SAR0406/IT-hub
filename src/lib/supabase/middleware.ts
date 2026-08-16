import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Refreshes the Supabase auth session cookie on every navigation.
 * Without this, sessions only refresh when a page actually queries
 * Supabase, and an expired session cookie goes stale until then.
 * Route guards stay in the server components (requireUser / requireAdmin);
 * proxy deliberately does not duplicate redirect logic.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Missing or empty credentials would make createServerClient throw
  // (new URL(undefined)) and take down every request. Skip the refresh
  // instead — route guards still protect the pages.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // A failed token refresh must never take down the whole site.
  }

  return response;
}