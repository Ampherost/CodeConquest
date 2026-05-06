import { createClient } from "@/utils/supabase/server";
import { getUserById } from "@/lib/db/users";

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

  const userResult = await getUserById(supabase, user.id);

  if (!userResult.ok) {
    return { error: "User role not found.", status: 403, supabase: null, user: null, role: null };
  }

  const { role } = userResult.data;

  if (requiredRole && role !== requiredRole) {
    return {
      error: `Access denied. Required role: ${requiredRole}.`,
      status: 403,
      supabase: null,
      user: null,
      role: null,
    };
  }

  return { supabase, user, role, error: null, status: null };
}