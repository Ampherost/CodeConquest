import { createClient } from "@/utils/supabase/client";
import { listAssignedQuizzes } from "@/lib/db/assessments";

/**
 * @deprecated Use listAssignedQuizzes from @/lib/db/assessments directly.
 * Kept for any callers that haven't been migrated yet.
 */
export async function getAssignedQuizes(assessment_id) {
  const supabase = createClient();
  const result = await listAssignedQuizzes(supabase, assessment_id);
  if (!result.ok) {
    return { quizzes: null, error: result.error };
  }
  return { quizzes: result.data, error: null };
}
