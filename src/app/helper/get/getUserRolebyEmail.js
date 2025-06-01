import { createClient } from "@/utils/supabase/server";

export default async function getUserRolebyEmail(email) {
    const supabase = await createClient(); 
    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single(); 

    if (error)
         {
        console.error('Error fetching user role:', error.message);
        return null;
    }

    return data?.role || null;
}
