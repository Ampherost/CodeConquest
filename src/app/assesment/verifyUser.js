import { createClient } from "@/utils/supabase/server";

export default async function isAssessmentLinked(userId, assessmentId) 
{
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('candidate_user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error);
    return false;
  }

  return Boolean(data); 
}
