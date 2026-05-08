"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAssessmentForInvitation, listAssignedQuizzes } from "@/lib/db/assessments";
import { listQuizzes, type Quiz } from "@/lib/db/quizzes";

interface AvailableTaskProps {
  invitation_id: string;
  onAssigned: () => void;
  refreshToggle: number;
}

const AvailableTask: React.FC<AvailableTaskProps> = ({
  invitation_id,
  onAssigned,
  refreshToggle,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();

        // 1. Fetch the assessment_id from the invitation
        const assessResult = await getAssessmentForInvitation(supabase, invitation_id);
        if (!assessResult.ok) throw new Error("Failed to fetch invitation");
        const currentAssessmentId = assessResult.data.assessment_id;
        setAssessmentId(currentAssessmentId);

        // 2. Fetch all assigned quizzes for this assessment
        const assignedResult = await listAssignedQuizzes(supabase, currentAssessmentId);
        const assignedIds: number[] = assignedResult.ok
          ? assignedResult.data
              .map((q) => q.quiz_id)
              .filter((id): id is number => typeof id === "number")
          : [];

        // 3. Fetch all quizzes
        const quizzesResult = await listQuizzes(supabase);
        const allQuizzes = quizzesResult.ok ? quizzesResult.data : [];

        // 4. Filter out quizzes that are already assigned
        const available = allQuizzes.filter(
          (quiz) => !assignedIds.includes(quiz.quiz_id)
        );

        setQuizzes(available);
      } catch (err) {
        console.error(
          "Error fetching quizzes:",
          err instanceof Error ? err.message : String(err)
        );
        setError("Failed to load quizzes");
      }
    }

    fetchData();
  }, [invitation_id, refreshToggle]);

  const handleAssignQuiz = async (quiz: Quiz) => {
    try {
      // 3. Call the assign API route (assessment_id already in state)
      const response = await fetch("/api/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessment_id: assessmentId, quiz_id: quiz.quiz_id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign quiz");
      }

      // Signal parent to refresh
      onAssigned();
    } catch (err) {
      console.error(
        "Error assigning quiz:",
        err instanceof Error ? err.message : String(err)
      );
      setError("Failed to assign quiz");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl">Available Tasks</h1>
      <div className="mt-4 space-y-4">
        {quizzes.length === 0 ? (
          <p className="text-gray-600">No quizzes available to assign.</p>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.quiz_id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>{quiz.title ?? "Untitled Quiz"}</span>
              <button
                className="ml-4 px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                onClick={() => handleAssignQuiz(quiz)}
              >
                Assign
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableTask;
