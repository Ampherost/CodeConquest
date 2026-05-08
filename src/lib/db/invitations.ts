import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Matches the `invitations` table exactly. */
export type Invitation = {
  invitation_id: string;
  business_user_id: string;
  candidate_user_id: string;
  position: string;
  status: string;
  notes: string | null;
  assessment_id: string;
};

export type CreateInvitationInput = {
  business_user_id: string;
  candidate_user_id: string;
  position: string;
  status: string;
};

/**
 * Shape returned by listInvitationsForCandidate — includes the embedded
 * assessment_quizzes rows via Supabase FK-join.
 */
export type InvitationWithQuizzes = {
  invitation_id: string;
  position: string;
  status: string;
  assessment_id: string;
  assessment_quizzes: Array<{ quiz_id: number; status: string }>;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/** Fetch a single invitation by primary key. Returns NotFoundError when missing. */
export async function getInvitation(
  supabase: SupabaseClient,
  invitationId: string
): Promise<Result<Invitation>> {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("invitation_id", invitationId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as Invitation);
}

/**
 * List invitations for a business user, optionally filtered by status.
 * Returns an empty array when none match.
 */
export async function listInvitationsForBusiness(
  supabase: SupabaseClient,
  businessUserId: string,
  status?: string
): Promise<Result<Invitation[]>> {
  let query = supabase
    .from("invitations")
    .select("*")
    .eq("business_user_id", businessUserId);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data ?? []) as Invitation[]);
}

/**
 * List invitations for a candidate user, including embedded assessment_quizzes
 * rows via Supabase FK-join. Returns an empty array when none match.
 */
export async function listInvitationsForCandidate(
  supabase: SupabaseClient,
  candidateUserId: string
): Promise<Result<InvitationWithQuizzes[]>> {
  const { data, error } = await supabase
    .from("invitations")
    .select(
      "invitation_id, position, status, assessment_id, assessment_quizzes:assessment_id (quiz_id, status)"
    )
    .eq("candidate_user_id", candidateUserId);

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data ?? []) as InvitationWithQuizzes[]);
}

/**
 * Insert a new invitation row.
 * Returns void on success — the created row is not needed by callers.
 */
export async function createInvitation(
  supabase: SupabaseClient,
  input: CreateInvitationInput
): Promise<Result<void>> {
  const { error } = await supabase.from("invitations").insert([input]);

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/** Update the status field of an invitation by primary key. */
export async function updateInvitationStatus(
  supabase: SupabaseClient,
  invitationId: string,
  status: string
): Promise<Result<Invitation>> {
  const { data, error } = await supabase
    .from("invitations")
    .update({ status })
    .eq("invitation_id", invitationId)
    .select("*")
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as Invitation);
}

/**
 * Find invitations matching the given business + candidate + position triple.
 * Used by the invitation-accept flow to detect duplicates.
 * Returns an empty array when none match.
 */
export async function findInvitationsByParticipants(
  supabase: SupabaseClient,
  businessUserId: string,
  candidateUserId: string,
  position: string
): Promise<Result<Invitation[]>> {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("business_user_id", businessUserId)
    .eq("candidate_user_id", candidateUserId)
    .eq("position", position)
    .limit(1);

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data ?? []) as Invitation[]);
}

/**
 * Apply a partial patch to the invitation matched by the business + candidate +
 * position triple. Used by the invitation-accept flow to copy notes.
 */
export async function patchInvitationByParticipants(
  supabase: SupabaseClient,
  businessUserId: string,
  candidateUserId: string,
  position: string,
  patch: Partial<Pick<Invitation, "notes" | "status">>
): Promise<Result<void>> {
  const { error } = await supabase
    .from("invitations")
    .update(patch)
    .eq("business_user_id", businessUserId)
    .eq("candidate_user_id", candidateUserId)
    .eq("position", position);

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/**
 * Return the invitation that links an assessment to a specific candidate.
 * Uses maybeSingle — returns ok(null) when no row matches (not an error).
 * Used for authorization checks in quiz and review pages.
 */
export async function findInvitationByAssessmentAndCandidate(
  supabase: SupabaseClient,
  assessmentId: string,
  candidateUserId: string
): Promise<Result<Invitation | null>> {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("candidate_user_id", candidateUserId)
    .maybeSingle();

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data as Invitation) ?? null);
}

/**
 * Return the invitation that links an assessment to a specific business user.
 * Uses maybeSingle — returns ok(null) when no row matches (not an error).
 * Used by the assign route and review page authorization checks.
 */
export async function findInvitationByAssessmentAndBusiness(
  supabase: SupabaseClient,
  assessmentId: string,
  businessUserId: string
): Promise<Result<Invitation | null>> {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("business_user_id", businessUserId)
    .maybeSingle();

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data as Invitation) ?? null);
}
