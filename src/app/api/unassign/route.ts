import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { invitation_id, quiz_id } = body;
  if (!invitation_id || !quiz_id) {
    return NextResponse.json(
      { error: "Missing invitation_id or quiz_id" },
      { status: 400 }
    );
  }

  // 1. Fetch assessment_id from invitations
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("assessment_id")
    .eq("invitation_id", invitation_id)
    .single();
  if (invError || !invitation) {
    return NextResponse.json(
      { error: "Invalid invitation_id" },
      { status: 400 }
    );
  }
  const assessmentId = invitation.assessment_id;

  // 2. Delete matching row in assessment_quizzes by both assessment_id and quiz_id
  const { data, error } = await supabase
    .from("assessment_quizzes")
    .delete()
    .match({ assessment_id: assessmentId, quiz_id })
    .single();
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Entry deleted", data });
}
