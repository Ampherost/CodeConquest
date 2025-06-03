"use client";

import { useState, useEffect, useTransition } from "react";
import Question from "./QuestionCard";
import Timer from "../Timer";
import confetti from "canvas-confetti";
import ConfirmModal from "../ConfirmModal";

async function submitQuiz({ assessmentID, quizID, answers }) {
  try {
    const response = await fetch("/api/submit-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentID, quizID, answers }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to submit quiz");
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default function Quiz({
  quiz_questions,
  initialTimeLeft,
  assessmentID,
  quizID,
  reviewMode,
  submission,
}) {
  const [answers, setAnswers] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isSubmitting = isPending;

  useEffect(() => {
      if (reviewMode === false) return;


    // Map submission answers by question_id for quick lookup
    const submissionMap = new Map();
    submission.forEach(({ question_id, answer, type }) => {
      submissionMap.set(question_id, { answer, type });
    });

    // Build full answers array matching quiz_questions with fallback answers
    const populatedAnswers = quiz_questions.map(({ question_id, type }) => {
      const sub = submissionMap.get(question_id);
      return {
        question_id,
        answer: sub?.answer ?? "",
        isCorrect: null,
        type: sub?.type ?? type,
      };
    });

    setAnswers(populatedAnswers);
    setHasSubmitted(true);
  }, [reviewMode, submission, quiz_questions]);

  const handleAnswer = (question_id, answer, type) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.question_id !== question_id);
      return [...filtered, { question_id, answer, isCorrect: null, type }];
    });
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleFinalSubmit = () => {
    setSubmissionError(null);
    const filledAnswers = answers.filter(
      (a) => a.answer !== null && a.answer !== ""
    );

    startTransition(async () => {
      const result = await submitQuiz({ assessmentID, quizID, answers: filledAnswers });
      if (result.success) {
        setHasSubmitted(true);
        triggerConfetti();
      } else {
        setSubmissionError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  useEffect(() => {
    if (hasSubmitted || reviewMode) return;
    const handleBeforeUnload = (e) => {
      if (!hasSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasSubmitted]);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center justify-between px-4">
          <h2 className="text-5xl font-extrabold text-center py-8">Assessment</h2>
          {!reviewMode && (
            <Timer initialTime={initialTimeLeft} onExpire={handleFinalSubmit} />
          )}
        </div>

        <div className="space-y-10">
          {quiz_questions.map((qs) => (
            <Question
              key={qs.question_id}
              {...qs}
              onAnswer={(answer) => handleAnswer(qs.question_id, answer, qs.type)}
              initialAnswer={answers.find((a) => a.question_id === qs.question_id)?.answer}
              disabled={reviewMode}
            />
          ))}
        </div>

        {!reviewMode && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={hasSubmitted || isSubmitting}
            className={`flex justify-center w-full max-w-md mx-auto mt-10 px-6 py-3 rounded-2xl text-white text-base font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              hasSubmitted
                ? "bg-gray-400 cursor-not-allowed"
                : isSubmitting
                ? "bg-gray-500 cursor-wait"
                : "bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600"
            }`}
          >
            {isSubmitting
              ? "Submitting..."
              : hasSubmitted
              ? "✅ Submitted Successfully"
              : "🚀 Submit Answers"}
          </button>
        )}

        {submissionError && (
          <p className="text-red-500 mt-4 text-center">{submissionError}</p>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          handleFinalSubmit();
        }}
      />
    </div>
  );
}
