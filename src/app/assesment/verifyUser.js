import { createClient } from "@/utils/supabase/server";
import { findInvitationByAssessmentAndCandidate } from "@/lib/db/invitations";
import { isQuizAssigned } from "@/lib/db/assessments";

export default async function isAssessmentLinked(userId, assessmentId, quizId) {
  const supabase = await createClient();

  const invResult = await findInvitationByAssessmentAndCandidate(supabase, assessmentId, userId);
  if (!invResult.ok) {
    console.error('Supabase error (invitations):', invResult.error);
    return false;
  }
  if (!invResult.data) {
    return false;
  }

  const quizResult = await isQuizAssigned(supabase, assessmentId, quizId);
  if (!quizResult.ok) {
    console.error('Supabase error (assessment_quizzes):', quizResult.error);
    return false;
  }

  return quizResult.data;
}
