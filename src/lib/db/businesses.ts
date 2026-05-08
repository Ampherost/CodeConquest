import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Matches the `business_users` table exactly. */
export type BusinessProfile = {
  user_id: string;
  business_name: string;
  business_email: string;
};

export type CreateBusinessProfileInput = {
  user_id: string;
  business_name: string;
  business_email: string;
};

export type UpdateBusinessProfileInput = Partial<
  Pick<BusinessProfile, "business_name" | "business_email">
>;

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/** Fetch a business profile by user_id. Returns NotFoundError when missing. */
export async function getBusinessProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Result<BusinessProfile>> {
  const { data, error } = await supabase
    .from("business_users")
    .select("user_id, business_name, business_email")
    .eq("user_id", userId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as BusinessProfile);
}

/** Insert a new business profile row and return the created record. */
export async function createBusinessProfile(
  supabase: SupabaseClient,
  input: CreateBusinessProfileInput
): Promise<Result<BusinessProfile>> {
  const { data, error } = await supabase
    .from("business_users")
    .insert([input])
    .select("user_id, business_name, business_email")
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as BusinessProfile);
}

/** Apply a partial update to an existing business profile row. */
export async function updateBusinessProfile(
  supabase: SupabaseClient,
  userId: string,
  patch: UpdateBusinessProfileInput
): Promise<Result<BusinessProfile>> {
  const { data, error } = await supabase
    .from("business_users")
    .update(patch)
    .eq("user_id", userId)
    .select("user_id, business_name, business_email")
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as BusinessProfile);
}
