// /api/invitation/ json 
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const {
    invite_code,
    business_user_id,
    candidate_user_id = null,
    notes = '',
    position = ''
  } = body

  const { data, error } = await supabase
    .from('invitation_codes')
    .insert([
      {
        invite_code,
        business_user_id,
        candidate_user_id,
        notes,
        position,
      },
    ])
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Invitation created', data })
}
