import { createClient } from "@/utils/supabase/server";

export default async function verifyCompletion(assessmentId, quizId) 
{
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('assessment_quizzes')
    .select('status')
    .eq('assessment_id', assessmentId)
    .eq('quiz_id', quizId)
    .single();

  if (error) {
    console.error('Supabase error:', error);
    return false;
  }

  if(data.status !== 'completed') {
    console.log('Quiz is not completed');
    return false;
  }

  return true; 
}
