import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { BlackButton } from '@/app/components/BlackButton'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const handleLogout = () => {}

  return (
    <>
      <p>Business Profile: {data.user.email}</p>
    </>
  )
}
//      //<BlackButton text="Logout" onClick={handleLogout} />
