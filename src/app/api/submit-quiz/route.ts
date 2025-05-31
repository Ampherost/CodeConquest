import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {

    //TODO: VALIDATE THE QUIZ HASNT ALREADY BEEN SUBMITTED




  try {
    const { assessmentID, quizID, answers } = await request.json()
    console.log('Received data:', { assessmentID, quizID, answers });

    const supabase = await createClient();

    //filter for mcq answers
    const mcqAnswers = answers.filter((a: any) => a.type === 'mcq');
    const mcqQuestionIDs = mcqAnswers.map((a: any) => a.question_id);

    const {data: statusUpdate} = await supabase.from('assessment_quizzes')
    .select('status')
    .eq('assessment_id', assessmentID)
    .eq('quiz_id', quizID)
    .single();

    if (statusUpdate?.status === 'completed') 
    {
      return NextResponse.json({ error: 'Quiz already completed' }, { status: 400 });
    }
    

    //get the right answers for the mcq questions
    const { data: questionsData, error: fetchError } = await supabase
      .from('questions')
      .select('question_id, options, correct_answer_index')
      .in('question_id', mcqQuestionIDs);

    if (fetchError) 
    {
      console.error('Error fetching questions:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch question data' }, { status: 500 });
    }

    //if its not mcq, it stays null else
    const updatedAnswers = answers.map((answer: any) => 
    {
      if (answer.type !== 'mcq') return { ...answer, isCorrect: null };

      const question = questionsData.find(q => q.question_id === answer.question_id);
      if (!question) return { ...answer, isCorrect: null };

      const correctOption = question.options?.[question.correct_answer_index];
      const isCorrect = answer.answer === correctOption;

      return { ...answer, isCorrect };
    });

    // Update row with new submission data
    const { data, error } = await supabase
      .from('assessment_quizzes')
      .update({
        submission: { submission: updatedAnswers },
        status: 'completed',
        last_activity: new Date().toTimeString().split(' ')[0],
      })
      .eq('assessment_id', assessmentID)
      .eq('quiz_id', quizID);

    if (error) {
      console.error('Error submitting quiz:', error);
      return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Invalid request:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
