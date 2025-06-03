import { createClient } from "@/utils/supabase/server";

export default async function getQuizQuestions(quiz_id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('question_id, quiz_id, title, options, description, hints, type')
    .eq('quiz_id', quiz_id);

  if (error) {
    console.error('Error fetching quizzes:', error.message);
    return null;
  }

  return data || null;
}

