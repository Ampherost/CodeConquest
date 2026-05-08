import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Matches the `invitation_codes` table. */
export type InvitationCode = {
  invite_code: string;
  business_user_id: string;
  full_name: string;
  email: string;
  position: string;
  notes: string | null;
  status: string;
};

export type CreateInvitationCodeInput = {
  invite_code: string;
  business_user_id: string;
  full_name?: string;
  email?: string;
  position?: string;
  notes?: string;
  status?: string;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Insert a new invitation_codes row.
 * Returns ConflictError (Supabase code 23505) when the invite_code already exists.
 */
export async function createInvitationCode(
  supabase: SupabaseClient,
  input: CreateInvitationCodeInput
): Promise<Result<void>> {
  const { error } = await supabase.from("invitation_codes").insert([input]);

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/**
 * Fetch a single invitation_codes row by its code string.
 * Returns NotFoundError when no row matches.
 */
export async function getInvitationCodeByCode(
  supabase: SupabaseClient,
  code: string
): Promise<Result<InvitationCode>> {
  const { data, error } = await supabase
    .from("invitation_codes")
    .select("*")
    .eq("invite_code", code)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as InvitationCode);
}

/**
 * Update the status field of an invitation_codes row by invite_code.
 * Returns void on success.
 */
export async function updateInvitationCodeStatus(
  supabase: SupabaseClient,
  code: string,
  status: string
): Promise<Result<void>> {
  const { error } = await supabase
    .from("invitation_codes")
    .update({ status })
    .eq("invite_code", code);

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/**
 * List invitation_codes with status "pending" for a given business user.
 * Returns an empty array when none match.
 * Used by the pending applicants UI (browser client, respects RLS).
 */
export async function listPendingInvitationCodesForBusiness(
  supabase: SupabaseClient,
  businessUserId: string
): Promise<Result<Pick<InvitationCode, "invite_code" | "full_name" | "email" | "position" | "notes">[]>> {
  const { data, error } = await supabase
    .from("invitation_codes")
    .select("invite_code, full_name, email, position, notes")
    .eq("business_user_id", businessUserId)
    .eq("status", "pending");

  if (error) return err(wrapSupabaseError(error)!);
  return ok(
    (data ?? []) as Pick<
      InvitationCode,
      "invite_code" | "full_name" | "email" | "position" | "notes"
    >[]
  );
}
