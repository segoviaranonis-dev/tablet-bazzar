import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const apiKey = serviceKey || supabaseAnonKey;
  if (!supabaseUrl || !apiKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (o ANON_KEY) no configuradas",
    );
  }
  client = createClient(supabaseUrl, apiKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
