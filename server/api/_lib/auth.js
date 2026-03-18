import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
export async function requireUser(req) {
    if (!supabase) {
        return { error: { status: 500, message: "SUPABASE_NOT_CONFIGURED" } };
    }
    const authHeader = req.headers.authorization || "";
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
//# sourceMappingURL=auth.js.map