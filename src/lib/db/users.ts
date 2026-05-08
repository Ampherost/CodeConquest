import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError, NotFoundError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Matches the `users` table exactly — do not add fields without a schema change. */
export type User = {
  user_id: string;
  email: string;
  role: "business" | "candidate";
};

/** Input required to create a new row in the `users` table. */
export type CreateUserInput = {
  user_id: string;
  email: string;
  role: "business" | "candidate";
};

/** Subset of User fields that may be patched via updateUser. */
export type UpdateUserInput = Partial<Pick<User, "email" | "role">>;

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Fetch a single user row by primary key.
 * Returns NotFoundError when no row matches (Supabase PGRST116).
 */
export async function getUserById(
  supabase: SupabaseClient,
  userId: string
): Promise<Result<User>> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, email, role")
    .eq("user_id", userId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as User);
}

/**
 * Fetch a single user row by email address.
 * Returns NotFoundError when no row matches (Supabase PGRST116).
 */
export async function getUserByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<Result<User>> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, email, role")
    .eq("email", email)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as User);
}

/**
 * Insert a new row into the `users` table and return the created record.
 * Returns DuplicateError when a user with the same email already exists
 * (PostgreSQL unique-constraint violation, code 23505).
 */
export async function createUser(
  supabase: SupabaseClient,
  input: CreateUserInput
): Promise<Result<User>> {
  const { data, error } = await supabase
    .from("users")
    .insert([input])
    .select("user_id, email, role")
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as User);
}

/**
 * Apply a partial update to an existing user row identified by `userId`.
 * Only fields present in `patch` are changed; omitted fields are untouched.
 * Returns NotFoundError when the row does not exist.
 */
export async function updateUser(
  supabase: SupabaseClient,
  userId: string,
  patch: UpdateUserInput
): Promise<Result<User>> {
  const { data, error } = await supabase
    .from("users")
    .update(patch)
    .eq("user_id", userId)
    .select("user_id, email, role")
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as User);
}

/**
 * Return the `users` table row for the currently authenticated session.
 *
 * Combines `auth.getUser()` with a users-table lookup so callers get a single
 * Result<User> instead of two separate async calls.
 *
 * - Returns PermissionError when `auth.getUser()` itself fails (e.g. expired
 *   JWT, HTTP 401/403).
 * - Returns NotFoundError when auth succeeds but there is no active session
 *   (data.user is null) or when the users-table row is missing.
 */
export async function getCurrentUser(
  supabase: SupabaseClient
): Promise<Result<User>> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) return err(wrapSupabaseError(authError)!);
  if (!authData?.user) return err(new NotFoundError("No authenticated user"));

  return getUserById(supabase, authData.user.id);
}
