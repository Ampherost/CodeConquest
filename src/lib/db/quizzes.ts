import type { SupabaseClient } from "@supabase/supabase-js";
import { wrapSupabaseError } from "./errors";
import { ok, err, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Matches the `quizzes` table. */
export type Quiz = {
  quiz_id: number;
  title: string;
  chapter_title: string;
  module_title: string;
};

/** Optional filters for listQuizzes. */
export type QuizFilters = {
  quizId?: number;
};

/** Matches the columns selected from `questions` by callers. */
export type Question = {
  question_id: number;
  quiz_id: number;
  title: string;
  options: string[];
  description: string | null;
  hints: string | null;
  type: string;
};

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/**
 * Fetch a single quiz row by primary key.
 * Returns NotFoundError when no row matches.
 */
export async function getQuizById(
  supabase: SupabaseClient,
  quizId: number
): Promise<Result<Quiz>> {
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("quiz_id", quizId)
    .single();

  if (error) return err(wrapSupabaseError(error)!);
  return ok(data as Quiz);
}

/**
 * List quizzes, optionally filtered by quiz_id.
 * Returns an empty array when no rows match (not an error).
 */
export async function listQuizzes(
  supabase: SupabaseClient,
  filters?: QuizFilters
): Promise<Result<Quiz[]>> {
  let query = supabase.from("quizzes").select("*");

  if (filters?.quizId !== undefined && !isNaN(filters.quizId)) {
    query = query.eq("quiz_id", filters.quizId);
  }

  const { data, error } = await query;

  if (error) return err(wrapSupabaseError(error)!);
  return ok((data ?? []) as Quiz[]);
}

/**
 * Fetch all questions for a given quiz.
 * Returns an empty array when none exist (not an error).
 * Returns NotFoundError only on a hard Supabase error.
 */
export async function getQuizQuestions(
  supabase: SupabaseClient,
  quizId: number
): Promise<Result<Question[]>> {
  const { data, error } = await supabase
    .from("questions")
    .select("question_id, quiz_id, title, options, description, hints, type")
    .eq("quiz_id", quizId);

  if (error) return err(wrapSupabaseError(error)!);
  if (!data || data.length === 0) return ok([]);
  return ok(data as Question[]);
}
