import React from "react";
import Quiz from "@/app/components/Assesment/Quiz";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getQuizQuestions } from "@/lib/db/quizzes";
import { getQuizSubmission } from "@/lib/db/assessments";
import {
  findInvitationByAssessmentAndCandidate,
  findInvitationByAssessmentAndBusiness,
} from "@/lib/db/invitations";
import getUserRolebyEmail from "@/app/helper/get/getUserRolebyEmail";
import getUserID from "@/app/helper/get/getUserID";

export default async function ReviewQuizPage({ params }) {
  const { assesmentID, quizID } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.error("Error fetching user:", error);
    redirect("/unauthorized");
  }

  const role = await getUserRolebyEmail(data.user.email);
  const userID = await getUserID(data.user.email);

  // Allow both candidates (who own the assessment) and business users (who created the invitation)
  let authorized = false;

  if (role === "candidate") {
    const invResult = await findInvitationByAssessmentAndCandidate(supabase, assesmentID, userID);
    authorized = invResult.ok && invResult.data !== null;
  } else if (role === "business") {
    const invResult = await findInvitationByAssessmentAndBusiness(supabase, assesmentID, userID);
    authorized = invResult.ok && invResult.data !== null;
  }

  if (!authorized) {
    redirect("/unauthorized");
  }

  // Fetch the stored submission for this assessment and quiz
  const submissionResult = await getQuizSubmission(supabase, assesmentID, quizID);

  if (!submissionResult.ok) {
    return (
      <div className="p-8 text-red-500">
        Failed to load submission: {submissionResult.error.message}
      </div>
    );
  }

  const questionsResult = await getQuizQuestions(supabase, Number(quizID));
  const quizQuestions = questionsResult.ok ? questionsResult.data : [];

  // Safely extract the submission data
  let submissionData = submissionResult.data ?? {};

  if (typeof submissionData === "string") {
    try {
      submissionData = JSON.parse(submissionData);
    } catch (err) {
      console.error("Failed to parse submission JSON:", err);
      submissionData = {};
    }
  }

  // The submission is stored as { submission: [...answers] }
  const submissionArray = Array.isArray(submissionData?.submission)
    ? submissionData.submission
    : [];

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
