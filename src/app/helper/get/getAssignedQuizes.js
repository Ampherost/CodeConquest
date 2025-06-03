import { createClient } from "@/utils/supabase/client";

export async function getAssignedQuizes(assessment_id) {
  const supabase = await createClient();

  // Step 1: Get all quiz assignments for this assessment
  const { data: assignments, error: assignmentErr } = await supabase
    .from("assessment_quizzes")
    .select("quiz_id, status")
    .eq("assessment_id", assessment_id);

  if (assignmentErr || !assignments) {
    return { quizzes: null, error: assignmentErr };
  }

  const quizIds = assignments.map((a) => a.quiz_id);

  // Step 2: Fetch quiz details by quiz_id
  const { data: quizData, error: quizErr } = await supabase
    .from("quizzes")
    .select("quiz_id, title")
    .in("quiz_id", quizIds);

  if (quizErr || !quizData) {
    return { quizzes: null, error: quizErr };
  }

  // Step 3: Merge quiz details with assignment status
  const merged = assignments.map((a) => ({
    ...a,
    quiz: quizData.find((q) => q.quiz_id === a.quiz_id),
  }));

  return { quizzes: merged, error: null };
}
