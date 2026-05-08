import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError } from "@/lib/db/errors";
import {
  getQuizById,
  listQuizzes,
  getQuizQuestions,
  getQuestionsForScoring,
  type Quiz,
  type Question,
  type QuestionForScoring,
} from "@/lib/db/quizzes";

const QUIZ_ROW: Quiz = {
  quiz_id: 1,
  title: "Intro Quiz",
  chapter_title: "Intro",
  module_title: "Software Engineering",
};

const QUESTION_ROW: Question = {
  question_id: 10,
  quiz_id: 1,
  title: "What is abstraction?",
  options: ["Option A", "Option B"],
  description: null,
  hints: null,
  type: "mcq",
};

// ---------------------------------------------------------------------------
// getQuizById
// ---------------------------------------------------------------------------

describe("getQuizById", () => {
  it("returns ok with the quiz when found", async () => {
    const supabase = createMockSupabaseClient({ data: QUIZ_ROW, error: null });
    const result = await getQuizById(supabase as never, 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(QUIZ_ROW);
  });

  it("returns NotFoundError when the row does not exist (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getQuizById(supabase as never, 999);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// listQuizzes
// ---------------------------------------------------------------------------

describe("listQuizzes", () => {
  it("returns ok with all quizzes when no filter provided", async () => {
    const supabase = createMockSupabaseClient({
      data: [QUIZ_ROW],
      error: null,
    });
    const result = await listQuizzes(supabase as never);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([QUIZ_ROW]);
  });

  it("returns ok with matching quizzes when quizId filter provided", async () => {
    const supabase = createMockSupabaseClient({
      data: [QUIZ_ROW],
      error: null,
    });
    const result = await listQuizzes(supabase as never, { quizId: 1 });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toHaveLength(1);
  });

  it("returns ok with empty array when no quizzes match", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listQuizzes(supabase as never);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns ok with empty array when data is null", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await listQuizzes(supabase as never);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getQuizQuestions
// ---------------------------------------------------------------------------

describe("getQuizQuestions", () => {
  it("returns ok with questions when found", async () => {
    const supabase = createMockSupabaseClient({
      data: [QUESTION_ROW],
      error: null,
    });
    const result = await getQuizQuestions(supabase as never, 1);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(QUESTION_ROW);
    }
  });

  it("returns ok with empty array when quiz has no questions", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await getQuizQuestions(supabase as never, 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns ok with empty array when data is null", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await getQuizQuestions(supabase as never, 999);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns error on Supabase failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await getQuizQuestions(supabase as never, 1);

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getQuestionsForScoring
// ---------------------------------------------------------------------------

const SCORING_ROW: QuestionForScoring = {
  question_id: 10,
  options: ["Option A", "Option B"],
  correct_answer_index: 1,
};

describe("getQuestionsForScoring", () => {
  it("returns ok with empty array when no question IDs provided", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await getQuestionsForScoring(supabase as never, []);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns ok with scoring rows when questions found", async () => {
    const supabase = createMockSupabaseClient({
      data: [SCORING_ROW],
      error: null,
    });
    const result = await getQuestionsForScoring(supabase as never, [10]);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(SCORING_ROW);
    }
  });

  it("returns ok with empty array when data is null", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await getQuestionsForScoring(supabase as never, [10]);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns error on Supabase failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await getQuestionsForScoring(supabase as never, [10]);

    expect(result.ok).toBe(false);
  });
});
