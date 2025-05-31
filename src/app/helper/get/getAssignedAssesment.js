import { createClient } from "@/utils/supabase/server";

/**
 * Retrieves an assigned assessment record from the `assessment_quizzes` table
 * for the given `assessmentID` and `quizID`, including linked invitation data.

 */

export default async function getAssignedAssessment(assessmentID, quizID) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assessment_quizzes")
    .select("(*)")
    .eq("assessment_id", assessmentID)
    .eq("quiz_id", quizID)
    .single(); 

  if (error) 
{
    console.error("Error fetching assessment_quizzes record:", error.message);
    return null;
  }

  return data || null;
}
