import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Matches the `candidate_users` table exactly. */
export type CandidateProfile = {
  user_id: string;
  first_name: string;
  last_name: string;
};

export type CreateCandidateProfileInput = {
  user_id: string;
  first_name: string;
  last_name: string;
};

/**
 * A candidate with their invitation_id attached — the combined shape returned
 * by listCandidatesForBusiness. Using a named type (not an anonymous merge)
 * so callers can reference it directly.
 */
export type CandidateWithInvitation = {
  user_id: string;
  first_name: string;
  last_name: string;
  /** The invitation_id from the invitations row that links this candidate to the business. */
  invitation_id: string;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/** Fetch a candidate profile by user_id. Returns NotFoundError when missing. */
export async function getCandidateProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Result<CandidateProfile>> {
  const { data, error } = await supabase
    .from("candidate_users")
    .select("user_id, first_name, last_name")
    .eq("user_id", userId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as CandidateProfile);
}

/** Insert a new candidate profile row and return the created record. */
export async function createCandidateProfile(
  supabase: SupabaseClient,
  input: CreateCandidateProfileInput
): Promise<Result<CandidateProfile>> {
  const { data, error } = await supabase
    .from("candidate_users")
    .insert([input])
    .select("user_id, first_name, last_name")
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as CandidateProfile);
}

/**
 * Consolidates the two-step query pattern in currentApplicants.tsx:
 * 1. Fetches invitations for the given business user (optionally filtered by status).
 * 2. Batch-fetches the matching candidate profiles.
 * 3. Returns a merged array.
 *
 * Returns an empty array — never an error — when there are zero invitations.
 */
export async function listCandidatesForBusiness(
  supabase: SupabaseClient,
  businessUserId: string,
  status?: "pending" | "completed"
): Promise<Result<CandidateWithInvitation[]>> {
  // Step 1: fetch invitations
  let query = supabase
    .from("invitations")
    .select("candidate_user_id, invitation_id")
    .eq("business_user_id", businessUserId);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: invites, error: invitesError } = await query;

  if (invitesError) return err(wrapSupabaseError(invitesError)!);
  if (!invites || invites.length === 0) return ok([]);

  // Build candidateId → invitationId map
  const candidateMap: Record<string, string> = {};
  for (const inv of invites) {
    candidateMap[inv.candidate_user_id] = inv.invitation_id;
  }
  const candidateIds = Object.keys(candidateMap);

  // Step 2: fetch candidate profiles
  const { data: candidates, error: candidatesError } = await supabase
    .from("candidate_users")
    .select("user_id, first_name, last_name")
    .in("user_id", candidateIds);

  if (candidatesError) return err(wrapSupabaseError(candidatesError)!);

  return ok(
    (candidates ?? []).map((c) => ({
      user_id: c.user_id,
      first_name: c.first_name,
      last_name: c.last_name,
      invitation_id: candidateMap[c.user_id] ?? "",
    }))
  );
}
