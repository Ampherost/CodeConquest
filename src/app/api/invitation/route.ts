import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/apiAuth";

export async function POST(req: NextRequest) {
  // Require authenticated business user
  const { supabase, user, error, status } = await authenticateRequest("business");
  if (error || !supabase || !user) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: status ?? 401 });
  }

  const body = await req.json();

  const {
    invite_code,
    notes = "",
    position = "",
    full_name = "",
    email = "",
    status: inviteStatus = "pending",
  } = body;

  if (!invite_code) {
    return NextResponse.json(
      { error: "Missing invite_code" },
      { status: 400 }
    );
  }

  // Use the authenticated user's ID as business_user_id instead of trusting the client
  const { data, error: insertError } = await supabase
    .from("invitation_codes")
    .insert([
      {
        invite_code,
        business_user_id: user.id,
        notes,
        position,
        full_name,
        email,
        status: inviteStatus,
      },
    ])
    .single();

  if (insertError) {
    // Handle unique constraint violation (code collision)
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Invitation code already exists. Please try again." },
        { status: 409 }
      );
    }
    console.error(insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Invitation created", data });
}
