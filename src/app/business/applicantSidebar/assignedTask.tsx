import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAssessmentForInvitation, listAssignedQuizzes, type AssignedQuiz } from "@/lib/db/assessments";

interface AssignedTaskProps {
  invitation_id: string;
  refreshToggle?: number;
  OnUnassigned: () => void;
}

const AssignedTask = ({
  invitation_id,
  refreshToggle,
  OnUnassigned,
}: AssignedTaskProps) => {
  const [quizzes, setQuizzes] = useState<AssignedQuiz[]>([]);
  const [assessmentID, setAssessmentID] = useState<string>("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      const supabase = createClient();

      const assessResult = await getAssessmentForInvitation(supabase, invitation_id);
      if (!assessResult.ok) return;

      const assessmentId = assessResult.data.assessment_id;
      setAssessmentID(assessmentId);

      const quizzesResult = await listAssignedQuizzes(supabase, assessmentId);
      if (quizzesResult.ok) {
        setQuizzes(quizzesResult.data);
      }
    };

    fetchQuizzes();
  }, [invitation_id, refreshToggle]);

  const handleUnassign = async (quizId?: number | string) => {
    if (!quizId) return;
    try {
      const response = await fetch("/api/unassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitation_id, quiz_id: quizId }),
      });
      if (response.ok) {
        OnUnassigned();
      }
    } catch (error) {
      console.error("Failed to unassign quiz:", error);
    }
  };

  return (
    <div>
      <h1 className="font-bold text-2xl">Assigned Task</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes assigned.</p>
      ) : (
        quizzes.map((q, idx) => (
          <div
            key={q.quiz?.quiz_id ?? idx}
            className="flex flex-row justify-between items-center p-2"
          >
            <h2 className="font-medium">{q.quiz?.title || "Untitled Quiz"}</h2>
            {q.status === "completed" ? (
              <button
                className="text-blue-500 underline"
                onClick={() =>
                  window.open(
                    `/assesment/${assessmentID}/quiz/${q.quiz?.quiz_id}/review`,
                    "_blank"
                  )
                }
              >
                Completed
              </button>
            ) : (
              <>
                <span>{q.status || "Pending"}</span>
                <button
                  disabled={!q.quiz?.quiz_id}
                  className={`ml-4 px-3 py-1 rounded cursor-pointer ${
                    q.quiz?.quiz_id
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (q.quiz?.quiz_id) {
                      handleUnassign(q.quiz.quiz_id);
                    } else {
                      console.error("Cannot unassign: quiz_id is undefined");
                    }
                  }}
                >
                  Unassign
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
export default AssignedTask;
