import { useEffect, useState } from "react";
import { getAssignedQuizes } from "@/app/helper/get/getAssignedQuizes";
import { createClient } from "@/utils/supabase/client";

interface AssignedTaskProps {
  invitation_id: string;
}

const AssignedTask = ({ invitation_id }: AssignedTaskProps) => {
  interface Quiz {
    quiz?: {
      quiz_id?: string;
      title?: string;
    };
    status?: string;
  }

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const supabase = await createClient();
      const { data: invitation, error: invitationError } = await supabase
        .from("invitations")
        .select("assessment_id")
        .eq("invitation_id", invitation_id)
        .single();

      if (invitationError || !invitation) return;

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
  }, [invitation_id]);

  return (
    <div>
      <h1 className="font-bold text-2xl">Assigned Task</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes assigned.</p>
      ) : (
        quizzes.map((q, idx) => (
          <div
            key={idx}
            className="flex flex-row justify-between items-center p-2"
          >
            <h2 className="font-medium">{q.quiz?.title || "Untitled Quiz"}</h2>
            {q.status === "completed" ? (
              <button
                className="text-blue-500 underline"
                onClick={() =>
                  window.open(`/view-quiz/${q.quiz?.quiz_id}`, "_blank")
                }
              >
                Completed
              </button>
            ) : (
              <span>{q.status || "Pending"}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};
export default AssignedTask;
