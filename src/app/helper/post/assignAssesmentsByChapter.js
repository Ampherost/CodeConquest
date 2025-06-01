'use server';
import { createClient } from "@/utils/supabase/server";

export default async function assignAssesmentsByChapter(assessmentID, chapterTitle, moduleTitle) {
  const supabase = await createClient();

  // Fetch all the quizzes for the given chapter and module
  const { data: quizzes, error: quizError } = await supabase
    .from('quizzes')
    .select('quiz_id')
    .eq('chapter_title', chapterTitle)
    .eq('module_title', moduleTitle);

  if (quizError) {
    console.error('Error fetching quizzes:', quizError);
    throw quizError; 
  }

  if (!quizzes || quizzes.length === 0) {
    console.warn('No quizzes found for the given chapter/module');
    return;
  }


  const insertData = quizzes.map(q => ({
    quiz_id: q.quiz_id,
    assessment_id: assessmentID,
    status: 'accepted',
  }));

  const { data: inserted, error: assessmentError } = await supabase
    .from('assessment_quizzes')
    .insert(insertData);

  if (assessmentError) {
    console.error('Error assigning quizzes:', assessmentError);
    throw assessmentError;
  }

  return inserted;
}
