import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { VercelRequest } from "@vercel/node";

let supabase: SupabaseClient | null = null;

export async function requireUser(req: VercelRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: {
        status: 500,
        message: "SUPABASE_NOT_CONFIGURED",
        detail: {
          hasSupabaseUrl: Boolean(supabaseUrl),
          hasSupabaseAnonKey: Boolean(supabaseAnonKey),
        },
      },
    };
  }

  if (!supabase) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "SUPABASE_CLIENT_INIT_FAILED",
          detail: error?.message ?? String(error),
        },
      };
    }
  }

  const authHeader = (req.headers.authorization as string) || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token) {
    return {
      error: {
        status: 401,
        message: "UNAUTHORIZED_ACCESS: Credentials Required.",
      },
    };
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return {
      error: {
        status: 401,
        message: "UNAUTHORIZED_ACCESS: Invalid or Expired Token.",
      },
    };
  }

  return { user: { id: data.user.id } };
}

