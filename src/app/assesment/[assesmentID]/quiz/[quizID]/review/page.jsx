import React from "react";
import Quiz from "@/app/components/Assesment/Quiz";
import { createClient } from "@/utils/supabase/server";
import getQuizQuestions from "@/app/helper/get/getQuizQuestions";

export default async function ReviewQuizPage({ params }) {
  const { assesmentID, quizID } = await params;
  const supabase = await createClient();

  // Fetch the stored submission for this assessment and quiz
  const { data: fetched, error } = await supabase
    .from("assessment_quizzes")
    .select("submission")
    .match({ assessment_id: assesmentID, quiz_id: quizID })
    .single();

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Failed to load submission: {error.message}
      </div>
    );
  }

  const quizQuestions = await getQuizQuestions(quizID);
  let submissionArray = fetched?.submission ?? [];
  if (
    typeof submissionArray === "string" &&
    submissionArray.trim().startsWith("[")
  ) {
    try {
      submissionArray = JSON.parse(submissionArray);
    } catch (err) {
      console.error("Failed to parse submission:", err);
      submissionArray = [];
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <main className="p-8">
        <Quiz
          quiz_questions={quizQuestions}
          assessmentID={assesmentID}
          quizID={quizID}
          reviewMode={true}
          submission={submissionArray}
        />
      </main>
    </div>
  );
}
