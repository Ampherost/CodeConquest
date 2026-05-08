import { createClient } from "@/utils/supabase/server";
import { getAssignmentRow, startTimer } from "@/lib/db/assessments";

export async function getStartTime(assessmentId, quizId) {
  const supabase = await createClient();
  const result = await getAssignmentRow(supabase, assessmentId, quizId);
  if (!result.ok) {
    console.error("Error fetching timer_start:", result.error.message);
    return null;
  }
  return result.data.timer_start;
}

export async function getDuration(assessmentId, quizId) {
  const supabase = await createClient();
  const result = await getAssignmentRow(supabase, assessmentId, quizId);
  if (!result.ok) {
    console.error("Error fetching timer_duration:", result.error.message);
    return null;
  }
  return result.data.timer_duration;
}

export async function updateStartTimertoNow(assessmentId, quizId) {
  const supabase = await createClient();
  const result = await startTimer(supabase, assessmentId, quizId);
  if (!result.ok) {
    console.error("Error updating timer_start:", result.error.message);
    return null;
  }
}
