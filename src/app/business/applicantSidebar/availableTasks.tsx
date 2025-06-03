"use client";
import React, { useState, useEffect } from "react";
import getQuizQuestions from "@/app/helper/get/getQuizQuestions";

interface QuizQuestion {
  id: string | number;
  title?: string;
  name?: string;
  // Add other fields as needed
}

const AvailableTask: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const data = await getQuizQuestions();
        setQuizzes(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching quiz questions:", err.message);
        } else {
          console.error("Error fetching quiz questions:", err);
        }
        setError("Failed to load quiz questions");
      }
    }
    fetchQuizzes();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="font-bold text-2xl">Available Tasks</h1>
      <div className="mt-4 space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span>{quiz.title || quiz.name || "Untitled Question"}</span>
            <button className="ml-4 px-3 py-1 bg-blue-500 text-white rounded">
              Assign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableTask;
