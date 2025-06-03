// app/components/SupabaseClient.jsx
'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

const SupabaseClient = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const supabase = createBrowserClient()

    const fetchUser = async () => 
    {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error fetching user please:", error)
        return
      }
      setUser(data.user)
    }

    fetchUser()
  }, [])

  return (
    <div>
      {user ? (
        <p>Candidate Profile: {user.email}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default SupabaseClient
