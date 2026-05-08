import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/apiAuth";
import {
  getInvitationCodeByCode,
  updateInvitationCodeStatus,
} from "@/lib/db/invitation-codes";
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

  const { supabase, user, error, status } = await authenticateRequest("candidate");
  if (error || !supabase || !user) {
    return NextResponse.json({ error: error ?? "Unauthorized." }, { status: status ?? 401 });
  }

  // Look up the invitation code
  const codeResult = await getInvitationCodeByCode(supabase, code);
  if (!codeResult.ok) {
    return NextResponse.json(
      { error: "Invalid or expired invitation code." },
      { status: 404 }
    );
  }
  const inviteData = codeResult.data;

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
  const updateResult = await updateInvitationCodeStatus(supabase, code, "completed");
  if (!updateResult.ok) {
    console.error("Update error:", updateResult.error);
    return NextResponse.json(
      { error: "Failed to update invitation code status." },
      { status: 500 }
    );
  }

  // Copy notes from the invitation code to the invitation row
  const patchResult = await patchInvitationByParticipants(
    supabase,
    inviteData.business_user_id,
    user.id,
    inviteData.position,
    { notes: inviteData.notes }
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
