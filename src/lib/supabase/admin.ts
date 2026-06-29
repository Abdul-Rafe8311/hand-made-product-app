import "server-only";

import { createClient } from "@supabase/supabase-js";

// Service role client. Bypasses RLS. Only ever used on the server for the
// order flow (recomputing totals, uploading screenshots, calling place_order,
// signing screenshot URLs). The "server-only" import makes the build fail if
// this module is ever pulled into a client bundle.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin config: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
