import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  try {
    let body;

    // Safely parse JSON body
    try {
      body = await request.json();
    } catch (err) {
      console.error('Error parsing JSON body:', err);
      return NextResponse.json({ error: 'Invalid or empty JSON body' }, { status: 400 });
    }

    const { assessmentID, quizID, answers } = body || {};

    if (!assessmentID || !quizID || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Received data:', { assessmentID, quizID, answers });

    const supabase = await createClient();

    const mcqAnswers = answers.filter(a => a.type === 'mcq');
    const mcqQuestionIDs = mcqAnswers.map(a => a.question_id);

    const { data: statusUpdate } = await supabase
      .from('assessment_quizzes')
      .select('status')
      .eq('assessment_id', assessmentID)
      .eq('quiz_id', quizID)
      .single();

    if (statusUpdate?.status === 'completed') {
      return NextResponse.json({ error: 'Quiz already completed' }, { status: 400 });
    }

    const { data: questionsData, error: fetchError } = await supabase
      .from('questions')
      .select('question_id, options, correct_answer_index')
      .in('question_id', mcqQuestionIDs);

    if (fetchError || !questionsData) {
      console.error('Error fetching questions:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch question data' }, { status: 500 });
    }

    const updatedAnswers = answers.map(answer => {
      if (answer.type !== 'mcq') return { ...answer, isCorrect: null };

      const question = questionsData.find(q => q.question_id === answer.question_id);
      if (!question) return { ...answer, isCorrect: null };

      const correctOption = question.options?.[question.correct_answer_index];
      const isCorrect = answer.answer === correctOption;

      return { ...answer, isCorrect };
    });

    const { data: updateData, error: updateError } = await supabase
      .from('assessment_quizzes')
      .update({
        submission: { submission: updatedAnswers },
        status: 'completed',
        last_activity: new Date().toTimeString().split(' ')[0],
      })
      .eq('assessment_id', assessmentID)
      .eq('quiz_id', quizID);

    if (updateError) {
      console.error('Error submitting quiz:', updateError);
      return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updateData });
  } catch (err) {
    console.error('Unexpected server error:', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
