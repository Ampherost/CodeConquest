"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import getQuizQuestions from "@/app/helper/get/getQuizQuestions";
import { getAssignedQuizes } from "@/app/helper/get/getAssignedQuizes";

interface AvailableTaskProps {
  invitation_id: string;
}

interface Quiz {
  quiz_id?: number;
  id?: number;
  title?: string;
}

const AvailableTask: React.FC<AvailableTaskProps> = ({ invitation_id }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        // assignedResult.quizzes is expected to be an array of objects like { quiz: { quiz_id, title }, ... }
        const assignedIds: number[] = Array.isArray(assignedResult.quizzes)
          ? assignedResult.quizzes
              .map((q): number | undefined => {
                const idValue = q.quiz?.quiz_id;
                return typeof idValue === "number" ? idValue : undefined;
              })
              .filter((idValue): idValue is number => idValue !== undefined)
          : [];

        // 3. Fetch all quizzes
        const allQuizzes = await getQuizQuestions(); // returns Quiz[] from "quizzes" table

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

    fetchData();
  }, [invitation_id]);

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
                <button className="ml-4 px-3 py-1 bg-blue-500 text-white rounded">
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
