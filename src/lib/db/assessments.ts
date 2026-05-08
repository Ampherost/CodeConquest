import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError, NotFoundError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Slim type used when callers only need to know the assessment_id. */
export type Assessment = {
  assessment_id: string;
};

/** Full row from the `assessment_quizzes` table. */
export type AssessmentQuizRow = {
  assessment_id: string;
  quiz_id: number;
  status: string;
  submission: unknown | null;
  timer_start: string | null;
  timer_duration: string | null;
  timer_flag: boolean;
  score: number | null;
  last_activity: string | null;
};

/**
 * Combined shape returned by listAssignedQuizzes — joins the quiz title from
 * the `quizzes` table so callers don't need a second query.
 */
export type AssignedQuiz = {
  quiz_id: number;
  status: string;
  quiz: { quiz_id: number; title: string } | null;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Return the assessment linked to an invitation.
 * Queries the `invitations` table for the assessment_id FK.
 * Returns NotFoundError when the invitation does not exist.
 */
export async function getAssessmentForInvitation(
  supabase: SupabaseClient,
  invitationId: string
): Promise<Result<Assessment>> {
  const { data, error } = await supabase
    .from("invitations")
    .select("assessment_id")
    .eq("invitation_id", invitationId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as Assessment);
}

/**
 * List all quizzes assigned to an assessment, including the quiz title.
 * Performs a two-step query: assessment_quizzes → quizzes.
 * Returns an empty array when no quizzes are assigned.
 */
export async function listAssignedQuizzes(
  supabase: SupabaseClient,
  assessmentId: string
): Promise<Result<AssignedQuiz[]>> {
  // Step 1: assignments
  const { data: assignments, error: assignError } = await supabase
    .from("assessment_quizzes")
    .select("quiz_id, status")
    .eq("assessment_id", assessmentId);

  if (assignError) return err(wrapSupabaseError(assignError)!);
  if (!assignments || assignments.length === 0) return ok([]);

  const quizIds = assignments.map((a) => a.quiz_id);

  // Step 2: quiz titles
  const { data: quizData, error: quizError } = await supabase
    .from("quizzes")
    .select("quiz_id, title")
    .in("quiz_id", quizIds);

  if (quizError) return err(wrapSupabaseError(quizError)!);

  const merged: AssignedQuiz[] = assignments.map((a) => ({
    quiz_id: a.quiz_id,
    status: a.status,
    quiz: (quizData ?? []).find((q) => q.quiz_id === a.quiz_id) ?? null,
  }));

  return ok(merged);
}

/**
 * Insert a new assessment_quizzes row.
 * Uses defaults that match the existing assign API route behaviour.
 */
export async function assignQuizToAssessment(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number,
  status = "pending"
): Promise<Result<void>> {
  const { error } = await supabase.from("assessment_quizzes").insert([
    {
      assessment_id: assessmentId,
      quiz_id: quizId,
      timer_start: null,
      last_activity: null,
      submission: null,
      score: null,
      timer_duration: "00:30:00",
      status,
      timer_flag: false,
    },
  ]);

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/**
 * Delete the assessment_quizzes row matching the given assessment + quiz pair.
 */
export async function removeQuizFromAssessment(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string
): Promise<Result<void>> {
  const { error } = await supabase
    .from("assessment_quizzes")
    .delete()
    .match({ assessment_id: assessmentId, quiz_id: quizId });

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/**
 * Fetch the full assessment_quizzes row for the given assessment + quiz pair.
 * Returns NotFoundError when no row matches.
 */
export async function getAssignmentRow(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string
): Promise<Result<AssessmentQuizRow>> {
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as AssessmentQuizRow);
}

/**
 * Check whether a quiz is assigned to an assessment.
 * Returns ok(true) when a row exists, ok(false) when not (not an error).
 */
export async function isQuizAssigned(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string
): Promise<Result<boolean>> {
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("quiz_id")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .maybeSingle();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data !== null);
}

/**
 * Return only the `status` field for a quiz row.
 * Returns NotFoundError when the row does not exist.
 */
export async function getQuizStatus(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string
): Promise<Result<string>> {
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("status")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data as { status: string }).status);
}

/**
 * Return only the `submission` field for a quiz row.
 * Returns NotFoundError when the row does not exist.
 */
export async function getQuizSubmission(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string
): Promise<Result<unknown>> {
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("submission")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data as { submission: unknown }).submission);
}

/**
 * Persist the quiz submission and mark the row as completed.
 */
export async function saveQuizSubmission(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string,
  submission: unknown,
  lastActivity: string
): Promise<Result<void>> {
  const { error } = await supabase
    .from("assessment_quizzes")
    .update({ submission, status: "completed", last_activity: lastActivity })
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId);

  if (error) return err(wrapSupabaseError(error)!);
  return ok(undefined);
}

/**
 * Start the quiz timer for a given assessment + quiz pair.
 * Only writes if timer_flag is currently false (idempotent guard).
 * Returns NotFoundError when the row does not exist.
 */
export async function startTimer(
  supabase: SupabaseClient,
  assessmentId: string,
  quizId: number | string
): Promise<Result<void>> {
  const rowResult = await getAssignmentRow(supabase, assessmentId, quizId);
  if (!rowResult.ok) return rowResult;

  if (rowResult.data.timer_flag === false) {
    const { error } = await supabase
      .from("assessment_quizzes")
      .update({ timer_start: new Date().toISOString(), timer_flag: true })
      .eq("assessment_id", assessmentId)
      .eq("quiz_id", quizId);

    if (error) return err(wrapSupabaseError(error)!);
  }

  return ok(undefined);
}

// Re-export NotFoundError so callers can import it from this module if needed
export { NotFoundError };
