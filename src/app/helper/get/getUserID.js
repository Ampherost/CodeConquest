import { createClient } from "@/utils/supabase/server";

export default async function getUserID(email) {
  const supabase = await createClient(); // Removed `await` unless your createClient is async

  const { data, error } = await supabase
    .from('users')
    .select('user_id')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user ID:', error.message);
    return null;
  }

  return data?.user_id || null;
}
