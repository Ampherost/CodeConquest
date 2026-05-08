import { createClient } from "@/utils/supabase/server";
import { getUserByEmail } from "@/lib/db/users";

export default async function getUserRolebyEmail(email) {
    const supabase = await createClient();

    const result = await getUserByEmail(supabase, email);

    if (!result.ok) {
        console.error('Error fetching user role:', result.error.message);
        return null;
    }

    return result.data.role || null;
}
