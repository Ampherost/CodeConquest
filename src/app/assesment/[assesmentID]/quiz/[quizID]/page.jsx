import Quiz from "@/app/components/Assesment/Quiz";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import getUserRolebyEmail from "@/app/helper/get/getUserRolebyEmail";
import getUserID from "@/app/helper/get/getUserID";
import getAssignedAssesment from "@/app/helper/get/getAssignedAssesment";
import getQuizQuestions from "@/app/helper/get/getQuizQuestions";
import isAssessmentLinked from "@/app/assesment/verifyUser";
import QuizTimer from "../../../timer";
import {
  getStartTime,
  getDuration,
  updateStartTimertoNow,
} from "../../../updateTimer";
import verifyCompletion from "../../../verifyCompletion";

export default async function functionQuizPage({ params }) {
  const { assesmentID, quizID } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.error("Error fetching user:", error);
    redirect("/unauthorized");
  }

  const role = await getUserRolebyEmail(data.user.email);
  const userID = await getUserID(data.user.email);
  const verifyUsertype = await isAssessmentLinked(userID, assesmentID, quizID);
  const isQuizCompleted = await verifyCompletion(assesmentID, quizID);

  if (role !== "candidate" || !verifyUsertype || isQuizCompleted) {
    console.error("Unauthorized access or user not linked to assessment");
    redirect("/unauthorized");
  }

  const assignedAssessment = await getAssignedAssesment(assesmentID, quizID);
  const quizQuestions = await getQuizQuestions(quizID);

  const startTimer = await updateStartTimertoNow(assesmentID, quizID);
  const timerStart = await getStartTime(assesmentID, quizID);
  const timerDuration = await getDuration(assesmentID, quizID);

  let timeLeft = 0;

  if (timerStart && timerDuration) {
    const timer = new QuizTimer(timerDuration, timerStart);
    timeLeft = Math.floor(timer.getRemainingTime() / 1000);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <main className="p-8">
        <Quiz
          quiz_questions={quizQuestions}
          initialTimeLeft={timeLeft}
          assessmentID={assesmentID}
          quizID={quizID}
        />
      </main>
    </div>
  );
}
