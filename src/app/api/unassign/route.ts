import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/apiAuth";
import { getInvitation } from "@/lib/db/invitations";
import { removeQuizFromAssessment } from "@/lib/db/assessments";

export async function POST(req: NextRequest) {
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

  const { invitation_id, quiz_id } = body as {
    invitation_id?: string;
    quiz_id?: string | number;
  };

  if (!invitation_id || !quiz_id) {
    return NextResponse.json(
      { error: "Missing invitation_id or quiz_id" },
      { status: 400 }
    );
  }

  // Fetch invitation and verify ownership
  const invResult = await getInvitation(supabase, invitation_id);
  if (!invResult.ok || invResult.data.business_user_id !== user.id) {
    return NextResponse.json(
      { error: "Invalid invitation_id or you do not own this invitation." },
      { status: 403 }
    );
  }

  const assessmentId = invResult.data.assessment_id;

  const removeResult = await removeQuizFromAssessment(supabase, assessmentId, quiz_id);
  if (!removeResult.ok) {
    console.error(removeResult.error);
    return NextResponse.json({ error: removeResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Entry deleted" });
}
