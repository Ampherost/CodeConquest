import { createClient } from '@/utils/supabase/server';
import DashboardLearning from '../learning/DashboardLearning';

export default async function Page() {
  const supabase = await createClient(); // ← await NOT needed if this isn't async
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ensure we pass null (not undefined)
  const email = user?.email ?? null;

  return <DashboardLearning userEmail={email} />;
}