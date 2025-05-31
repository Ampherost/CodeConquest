import { createClient } from "@/utils/supabase/server";

export default async function verifyUserAssesment(userID, assessmentID) 
{
    const supabase = await createClient(); 
    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('candidate_user_id', userID)
        .eq('assessment_id', assessmentID)

    

    if(data === null) 
    {
       return false
    }
    else return true;
}
