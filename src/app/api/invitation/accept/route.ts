import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/db/users";
import {
  findInvitationsByParticipants,
  createInvitation,
  patchInvitationByParticipants,
} from "@/lib/db/invitations";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { code } = body as { code?: string };

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

  const userResult = await getUserById(supabase, user.id);

  if (!userResult.ok || userResult.data.role !== "candidate") {
    return NextResponse.json(
      { error: "You are not authorized to accept invitation codes." },
      { status: 403 }
    );
  }

  // Look up the invitation code (invitation_codes table — outside service layer scope)
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

  // Check for duplicate invitation
  const dupResult = await findInvitationsByParticipants(
    supabase,
    inviteData.business_user_id,
    user.id,
    inviteData.position
  );
  if (!dupResult.ok) {
    return NextResponse.json(
      { error: "Failed to check for existing invitation." },
      { status: 500 }
    );
  }
  if (dupResult.data.length > 0) {
    return NextResponse.json(
      { error: "You've already accepted this invitation." },
      { status: 400 }
    );
  }

  // Create the invitation row
  const createResult = await createInvitation(supabase, {
    business_user_id: inviteData.business_user_id,
    candidate_user_id: user.id,
    position: inviteData.position,
    status: "completed",
  });
  if (!createResult.ok) {
    console.error("Insert error:", createResult.error);
    return NextResponse.json(
      { error: "Failed to create invitation." },
      { status: 500 }
    );
  }

  // Mark the invitation code as used
  const { error: updateError } = await supabase
    .from("invitation_codes")
    .update({ status: "completed" })
    .eq("invite_code", code);

  if (updateError) {
    console.error("Update error:", updateError);
    return NextResponse.json(
      { error: "Failed to update invitation code status." },
      { status: 500 }
    );
  }

  // Fetch notes from the invitation code, then copy to the invitation row
  const { data: noteData, error: noteFetchError } = await supabase
    .from("invitation_codes")
    .select("notes")
    .eq("invite_code", code)
    .single();

  if (noteFetchError) {
    console.error("Fetch note error:", noteFetchError);
    return NextResponse.json(
      { error: "Failed to fetch note from invitation code." },
      { status: 500 }
    );
  }

  const patchResult = await patchInvitationByParticipants(
    supabase,
    inviteData.business_user_id,
    user.id,
    inviteData.position,
    { notes: noteData.notes }
  );
  if (!patchResult.ok) {
    console.error("Note update error:", patchResult.error);
    return NextResponse.json(
      { error: "Failed to update note in invitation." },
      { status: 500 }
    );
  }

  return NextResponse.json({ user_id: user.id });
}
