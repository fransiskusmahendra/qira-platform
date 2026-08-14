import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getSupabaseConfig } from "./config";

export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secretKey) throw new Error("Supabase server secret is not configured");

  return createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
