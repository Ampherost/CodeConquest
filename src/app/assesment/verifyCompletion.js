import { createClient } from "@/utils/supabase/server";
import { getQuizStatus } from "@/lib/db/assessments";

export default async function verifyCompletion(assessmentId, quizId) {
  const supabase = await createClient();

  const result = await getQuizStatus(supabase, assessmentId, quizId);

  if (!result.ok) {
    console.error('Supabase error:', result.error);
    return false;
  }

  if (result.data !== 'completed') {
    console.log('Quiz is not completed');
    return false;
  }

  return true;
}
