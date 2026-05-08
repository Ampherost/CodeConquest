import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/supabase/apiAuth";
import { findInvitationByAssessmentAndBusiness } from "@/lib/db/invitations";
import { assignQuizToAssessment } from "@/lib/db/assessments";

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

  const {
    assessment_id,
    quiz_id,
    status: assignStatus = "pending",
  } = body as { assessment_id?: string; quiz_id?: number; status?: string };

  if (!assessment_id || !quiz_id) {
    return NextResponse.json(
      { error: "Missing assessment_id or quiz_id" },
      { status: 400 }
    );
  }

  // Verify this business user owns the invitation linked to the assessment
  const invResult = await findInvitationByAssessmentAndBusiness(
    supabase,
    assessment_id,
    user.id
  );
  if (!invResult.ok || !invResult.data) {
    return NextResponse.json(
      { error: "You do not have permission to assign quizzes to this assessment." },
      { status: 403 }
    );
  }

  const assignResult = await assignQuizToAssessment(
    supabase,
    assessment_id,
    Number(quiz_id),
    String(assignStatus)
  );
  if (!assignResult.ok) {
    console.error(assignResult.error);
    return NextResponse.json({ error: assignResult.error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Quiz assigned" });
}
