import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json(
      { error: "Code parameter is required." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: userData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleError || userData?.role !== "candidate") {
    return NextResponse.json(
      { error: "You are not authorized to accept invitation codes." },
      { status: 403 }
    );
  }

  const { data: inviteData, error: inviteError } = await supabase
    .from("invitation_codes")
    .select("*")
    .eq("invite_code", code)
    .single();

  if (inviteError || !inviteData) {
    return NextResponse.json(
      { error: "Invalid or expired invitation code." },
      { status: 404 }
    );
  }

  // If you already accepted an invitation
  const { data: existingList } = await supabase
    .from("invitations")
    .select("*")
    .eq("business_user_id", inviteData.business_user_id)
    .eq("candidate_user_id", user.id)
    .eq("position", inviteData.position)
    .limit(1);

  if (existingList && existingList.length > 0) {
    return NextResponse.json(
      { error: "You’ve already accepted this invitation." },
      { status: 400 }
    );
  }

  const { error: insertError } = await supabase.from("invitations").insert([
    {
      business_user_id: inviteData.business_user_id,
      candidate_user_id: user.id,
      position: inviteData.position,
      status: "completed",
    },
  ]);

  if (insertError) {
    console.error("Insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to create invitation." },
      { status: 500 }
    );
  }

  const { error: updateError } = await supabase
    .from("invitation_codes")
    .update({ status: "completed" })
    .eq("invite_code", code);

  if (updateError) {
    console.error("Insert error:", insertError);
    return NextResponse.json(
      { error: "Failed to update invitation code status." },
      { status: 500 }
    );
  }

  return NextResponse.json({ user_id: user.id });
}
