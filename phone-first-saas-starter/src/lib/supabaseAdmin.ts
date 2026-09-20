import "server-only";
import { createClient } from "@supabase/supabase-js";
export function createSupabaseAdmin() { const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!url || !key) throw new Error("Add SUPABASE_SERVICE_ROLE_KEY server-side if admin storage access is needed"); return createClient(url, key, { auth: { persistSession: false } }); }
