import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./cors.ts";

export function buildClient(req: Request): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    },
  );
}

export async function requireAuth(
  supabase: SupabaseClient,
): Promise<{ id: string; role: string | null }> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new AuthError("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return { id: user.id, role: profile?.role ?? null };
}

export function requireRole(role: string | null, allowed: string[]): void {
  if (!role || !allowed.includes(role)) {
    throw new AuthError("Forbidden");
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function errorResponse(
  errorOrMessage: unknown,
  defaultStatus = 500,
): Response {
  const message =
    errorOrMessage instanceof Error
      ? errorOrMessage.message
      : typeof errorOrMessage === "string"
        ? errorOrMessage
        : "Internal Server Error";
  const status =
    errorOrMessage instanceof AuthError
      ? message === "Unauthorized"
        ? 401
        : 403
      : defaultStatus;
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function parseId(pathname: string, prefix: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  const idx = parts.indexOf(prefix);
  return idx !== -1 && parts[idx + 1] ? parts[idx + 1] : null;
}
