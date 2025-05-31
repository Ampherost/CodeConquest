import { createClient } from "@/utils/supabase/server";

// Get timer_start from assessment_quizzes
export async function getStartTime(assessmentId, quizId) 
{
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("timer_start")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .single();

  if (error) {
    console.error("Error fetching timer_start:", error.message);
    return null;
  }

  return data.timer_start;
}

export async function getDuration(assessmentId, quizId) 
{
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("timer_duration")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .single();

  if (error) {
    console.error("Error fetching timer_duration:", error.message);
    return null;
  }

  return data.timer_duration; 
}

export async function updateStartTimertoNow(assessmentId, quizId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("*")
    .eq("assessment_id", assessmentId)
    .eq("quiz_id", quizId)
    .single();

  if (error || !data) {
    console.error("No matching assessment_quiz found or error:", error?.message);
    return null;
  }

  if (data.timer_flag === false) {
    const { error: updateError } = await supabase
      .from("assessment_quizzes")
      .update({
        timer_start: new Date().toISOString(),
        timer_flag: true,
      })
      .eq("assessment_id", assessmentId)
      .eq("quiz_id", quizId);

    if (updateError) {
      console.error("Error updating timer_start:", updateError.message);
      return null;
    }
  } else {
    console.log("Timer already started for this quiz.");
  }
}
