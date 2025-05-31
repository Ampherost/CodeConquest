import { createClient } from "@/utils/supabase/server";

export default async function getAssignedQuizes(assessmentID) 
{
    const supabase = await createClient();
    const { data: quizzes, error } = await supabase
    .from('assessment_quizzes')
    .select('quizzes(*),status') 
    .eq('assessment_id', assessmentID);
}