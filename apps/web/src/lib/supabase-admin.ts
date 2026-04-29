// IMPORTANT: This module must ONLY be imported in server-side code (API routes, edge functions).
// Never import this in client-side bundles — it exposes the service role key.
// In Vite/React apps this is only safe in Vite SSR mode or Vercel/Netlify edge functions.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing Supabase admin environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY.",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
