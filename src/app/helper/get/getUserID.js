import { createClient } from "@/utils/supabase/server";
import { getUserByEmail } from "@/lib/db/users";

export default async function getUserID(email) {
  const supabase = await createClient();

  const result = await getUserByEmail(supabase, email);

  if (!result.ok) {
    console.error('Error fetching user ID:', result.error.message);
    return null;
  }

  return result.data.user_id || null;
}
