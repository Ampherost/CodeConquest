import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/apiAuth";
import { createInvitationCode } from "@/lib/db/invitation-codes";
import { DuplicateError } from "@/lib/db/errors";

export async function POST(req: NextRequest) {
  // Require authenticated business user
  const { supabase, user, error, status } = await authenticateRequest("business");
  if (error || !supabase || !user) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: status ?? 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    invite_code,
    notes = "",
    position = "",
    full_name = "",
    email = "",
    status: inviteStatus = "pending",
  } = body as {
    invite_code?: string;
    notes?: string;
    position?: string;
    full_name?: string;
    email?: string;
    status?: string;
  };

  if (!invite_code) {
    return NextResponse.json(
      { error: "Missing invite_code" },
      { status: 400 }
    );
  }

  // Use the authenticated user's ID as business_user_id instead of trusting the client
  const result = await createInvitationCode(supabase, {
    invite_code,
    business_user_id: user.id,
    notes,
    position,
    full_name,
    email,
    status: inviteStatus,
  });

  if (!result.ok) {
    // Handle unique constraint violation (code collision)
    if (result.error instanceof DuplicateError) {
      return NextResponse.json(
        { error: "Invitation code already exists. Please try again." },
        { status: 409 }
      );
    }
    console.error(result.error);
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Invitation created" });
}
