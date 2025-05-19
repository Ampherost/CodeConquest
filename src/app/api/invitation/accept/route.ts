// /api/invitation/accept?code=1234


import { createClient } from '@/utils/supabase/server'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Code parameter is required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || userData?.role !== 'candidate') {
    return NextResponse.json(
      { error: 'You are not authorized to accept invitation codes.' },
      { status: 403 }
    )
  }

  const { data: inviteData, error: inviteError } = await supabase
    .from('invitation_codes')
    .select('*')
    .eq('invite_code', code)
    .single()

  if (inviteError || !inviteData) {
    return NextResponse.json({ error: 'Invalid or expired invitation code.' }, { status: 404 })
  }

  const { error: insertError } = await supabase.from('invitations').insert([
    {
      business_user_id: inviteData.business_user_id,
      candidate_user_id: inviteData.user,
      notes: inviteData.notes,
      position: inviteData.position,
    },
  ])

  if (insertError) {
    return NextResponse.json({ error: 'Failed to create invitation.' }, { status: 500 })
  }

  return NextResponse.json({ user_id: inviteData.user_id })
}
