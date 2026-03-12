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
    assessment_id,
    quiz_id,
    status: assignStatus = "pending",
  } = body;

  if (!assessment_id || !quiz_id) {
    return NextResponse.json(
      { error: "Missing assessment_id or quiz_id" },
      { status: 400 }
    );
  }

  // Verify this business user owns the invitation linked to the assessment
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("invitation_id")
    .eq("assessment_id", assessment_id)
    .eq("business_user_id", user.id)
    .maybeSingle();

  if (invError || !invitation) {
    return NextResponse.json(
      { error: "You do not have permission to assign quizzes to this assessment." },
      { status: 403 }
    );
  }

  const { data, error: insertError } = await supabase
    .from("assessment_quizzes")
    .insert([
      {
        assessment_id,
        quiz_id,
        timer_start: null,
        last_activity: null,
        submission: null,
        score: null,
        timer_duration: "00:30:00",
        status: assignStatus,
        timer_flag: false,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error(insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Quiz assigned", data });
}
