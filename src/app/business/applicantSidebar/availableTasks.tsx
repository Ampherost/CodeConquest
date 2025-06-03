"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import getQuizQuestions from "@/app/helper/get/getQuizQuestions";
import { getAssignedQuizes } from "@/app/helper/get/getAssignedQuizes";

interface AvailableTaskProps {
  invitation_id: string;
  onAssigned: () => void;
  refreshToggle: number;
}

interface Quiz {
  quiz_id?: number;
  id?: number;
  title?: string;
}

const AvailableTask: React.FC<AvailableTaskProps> = ({
  invitation_id,
  onAssigned,
  refreshToggle,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      const supabase = createClient();

      // 1. Fetch the assessment_id from the invitation
      const { data: invitation, error: invError } = await supabase
        .from("invitations")
        .select("assessment_id")
        .eq("invitation_id", invitation_id)
        .single();

      if (invError || !invitation) {
        throw new Error("Failed to fetch invitation");
      }
      const assessmentId = invitation.assessment_id;

      // 2. Fetch all assigned quizzes for this assessment
      const assignedResult = await getAssignedQuizes(assessmentId);
      const assignedIds: number[] = Array.isArray(assignedResult.quizzes)
        ? assignedResult.quizzes
            .map((q): number | undefined => {
              const idValue = q.quiz?.quiz_id;
              return typeof idValue === "number" ? idValue : undefined;
            })
            .filter((idValue): idValue is number => idValue !== undefined)
        : [];

      // 3. Fetch all quizzes
      const allQuizzes = await getQuizQuestions();

      // 4. Filter out quizzes that are already assigned
      const available = allQuizzes.filter((quiz: Quiz) => {
        const idToCheck = quiz.quiz_id ?? quiz.id;
        return (
          typeof idToCheck === "number" && !assignedIds.includes(idToCheck)
        );
      });

      setQuizzes(available);
    } catch (err) {
      console.error(
        "Error fetching quizzes:",
        err instanceof Error ? err.message : String(err)
      );
      setError("Failed to load quizzes");
    }
  }

  const handleAssignQuiz = async (quiz: Quiz) => {
    try {
      const supabase = createClient();
      // 1. Fetch the assessment_id from the invitation
      const { data: invitation, error: invError } = await supabase
        .from("invitations")
        .select("assessment_id")
        .eq("invitation_id", invitation_id)
        .single();
      if (invError || !invitation) {
        throw new Error("Failed to fetch invitation");
      }
      const assessment_id = invitation.assessment_id;
      // 2. Prepare payload for assignment
      const quiz_id = quiz.quiz_id ?? quiz.id;
      if (typeof quiz_id !== "number") {
        throw new Error("Invalid quiz id");
      }
      // 3. Call the assign API route
      const response = await fetch("/api/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assessment_id,
          quiz_id,
          // Optionally add more fields as needed
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign quiz");
      }
      // Refresh the full available list after assignment
      onAssigned();
    } catch (err) {
      console.error(
        "Error assigning quiz:",
        err instanceof Error ? err.message : String(err)
      );
      setError("Failed to assign quiz");
    }
  };

  useEffect(() => {
    fetchData();
  }, [invitation_id, refreshToggle]);

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
          quizzes.map((quiz: Quiz) => {
            const keyId = quiz.quiz_id ?? quiz.id;
            return (
              <div
                key={keyId}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>{quiz.title ?? "Untitled Quiz"}</span>
                <button
                  className="ml-4 px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    handleAssignQuiz(quiz);
                  }}
                >
                  Assign
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AvailableTask;
