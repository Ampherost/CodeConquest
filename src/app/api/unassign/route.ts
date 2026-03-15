import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/apiAuth";

export async function POST(req: NextRequest) {
  // Require authenticated business user
  const { supabase, user, error, status } = await authenticateRequest("business");
  if (error || !supabase || !user) {
    return NextResponse.json({ error: error ?? "Unauthorized" }, { status: status ?? 401 });
  }

  const body = await req.json();
  const { invitation_id, quiz_id } = body;

  if (!invitation_id || !quiz_id) {
    return NextResponse.json(
      { error: "Missing invitation_id or quiz_id" },
      { status: 400 }
    );
  }

  // 1. Fetch assessment_id from invitations AND verify ownership
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("assessment_id")
    .eq("invitation_id", invitation_id)
    .eq("business_user_id", user.id)
    .single();

  if (invError || !invitation) {
    return NextResponse.json(
      { error: "Invalid invitation_id or you do not own this invitation." },
      { status: 403 }
    );
  }

  const assessmentId = invitation.assessment_id;

  // 2. Delete matching row in assessment_quizzes
  const { data, error: deleteError } = await supabase
    .from("assessment_quizzes")
    .delete()
    .match({ assessment_id: assessmentId, quiz_id })
    .single();

  if (deleteError) {
    console.error(deleteError);
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Entry deleted", data });
}