import { createClient } from "@/utils/supabase/client";

export default async function getQuizQuestions(quizId) {
  const supabase = createClient();
  let query = supabase.from("quizzes").select("*");
  if (quizId && !isNaN(Number(quizId))) {
    query = query.eq("quiz_id", Number(quizId));
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching quiz questions:", error.message);
    return [];
  }
  return data;
}