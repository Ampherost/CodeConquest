import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const {
    assessment_id,
    quiz_id,
    // timer_start,
    // last_activity,
    // submission,
    // score,
    // timer_duration,
    // timer_flag,
    status = "pending",
  } = body;

  // timer_flag is hardcoded as false, and other nullable fields set to null
  const { data, error } = await supabase
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
        status,
        timer_flag: false,
      },
    ])
    .select()
    .single();
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: "Invitation created", data });
}
