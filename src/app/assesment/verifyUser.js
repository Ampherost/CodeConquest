import { createClient } from "@/utils/supabase/server";

export default async function isAssessmentLinked(userId, assessmentId, quizId) {
  const supabase = await createClient();

  // Check if invitation exists
  const { data: invitationData, error: invitationError } = await supabase
    .from('invitations')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('candidate_user_id', userId)
    .maybeSingle();

  if (invitationError) {
    console.error('Supabase error (invitations):', invitationError);
    return false;
  }

  if (!invitationData) {
    return false;
  }

  // Check if assessment_quizes has a row linking the quiz
  const { data: quizLinkData, error: quizLinkError } = await supabase
    .from('assessment_quizzes')
    .select('*')
    .eq('assessment_id', assessmentId)
    .eq('quiz_id', quizId)
    .maybeSingle();

  if (quizLinkError) {
    console.error('Supabase error (assessment_quizes):', quizLinkError);
    return false;
  }

  return Boolean(quizLinkData);
}
