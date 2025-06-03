import { useEffect, useState } from "react";
import { getAssignedQuizes } from "@/app/helper/get/getAssignedQuizes";
import { createClient } from "@/utils/supabase/client";

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
  interface Quiz {
    quiz?: {
      quiz_id?: string;
      title?: string;
    };
    status?: string;
  }

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assessmentID, setAssessmentID] = useState<string>("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      const supabase = await createClient();
      const { data: invitation, error: invitationError } = await supabase
        .from("invitations")
        .select("assessment_id")
        .eq("invitation_id", invitation_id)
        .single();

      if (invitationError || !invitation) return;

      setAssessmentID(invitation.assessment_id);

      const result = await getAssignedQuizes(invitation.assessment_id);
      if (
        result &&
        typeof result === "object" &&
        "quizzes" in result &&
        (!("error" in result) || !result.error)
      ) {
        setQuizzes((result as { quizzes: Quiz[] }).quizzes || []);
      }
    };

    fetchQuizzes();
  }, [invitation_id, refreshToggle]);

  // Function to unassign a quiz by deleting the row via API
  const handleUnassign = async (quizId?: string) => {
    if (!quizId) return;
    try {
      const response = await fetch("/api/unassign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
