"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client used by client components (the admin login form). It only
// ever sees the public anon key, never a server secret.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
