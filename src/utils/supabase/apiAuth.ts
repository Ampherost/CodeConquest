import { createClient } from "@/utils/supabase/server";

/**
 * Authenticate the current user and optionally check their role.
 * Returns { supabase, user, role } on success, or { error, status } on failure.
 */
export async function authenticateRequest(requiredRole?: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized.", status: 401, supabase: null, user: null, role: null };
  }

  const { data: userData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || !userData?.role) {
    return { error: "User role not found.", status: 403, supabase: null, user: null, role: null };
  }

  if (requiredRole && userData.role !== requiredRole) {
    return {
      error: `Access denied. Required role: ${requiredRole}.`,
      status: 403,
      supabase: null,
      user: null,
      role: null,
    };
  }

  return { supabase, user, role: userData.role, error: null, status: null };
}