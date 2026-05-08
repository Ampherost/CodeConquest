import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError } from "@/lib/db/errors";
import {
  getAssessmentForInvitation,
  listAssignedQuizzes,
  assignQuizToAssessment,
  removeQuizFromAssessment,
  getAssignmentRow,
  isQuizAssigned,
  getQuizStatus,
  getQuizSubmission,
  saveQuizSubmission,
  startTimer,
  type AssessmentQuizRow,
  type AssignedQuiz,
} from "@/lib/db/assessments";

const ROW: AssessmentQuizRow = {
  assessment_id: "a-1",
  quiz_id: 1,
  status: "pending",
  submission: null,
  timer_start: null,
  timer_duration: "00:30:00",
  timer_flag: false,
  score: null,
  last_activity: null,
};

// ---------------------------------------------------------------------------
// getAssessmentForInvitation
// ---------------------------------------------------------------------------

describe("getAssessmentForInvitation", () => {
  it("returns ok with the assessment_id when the invitation exists", async () => {
    const supabase = createMockSupabaseClient({
      data: { assessment_id: "a-1" },
      error: null,
    });
    const result = await getAssessmentForInvitation(supabase as never, "inv-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.assessment_id).toBe("a-1");
  });

  it("returns NotFoundError when the invitation does not exist (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getAssessmentForInvitation(supabase as never, "missing");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// listAssignedQuizzes
// ---------------------------------------------------------------------------

describe("listAssignedQuizzes", () => {
  it("returns empty array when no quizzes are assigned", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listAssignedQuizzes(supabase as never, "a-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("merges quiz titles into AssignedQuiz[]", async () => {
    // defaultResult drives the 2nd call (quizzes)
    const supabase = createMockSupabaseClient({
      data: [{ quiz_id: 1, title: "Intro Quiz" }],
      error: null,
    });
    // nextResult drives the 1st call (assessment_quizzes)
    supabase.__setNextResult({
      data: [{ quiz_id: 1, status: "pending" }],
      error: null,
    });

    const result = await listAssignedQuizzes(supabase as never, "a-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      const q: AssignedQuiz = result.data[0];
      expect(q.status).toBe("pending");
      expect(q.quiz?.title).toBe("Intro Quiz");
    }
  });

  it("returns null quiz reference when no matching quiz title is found", async () => {
    const supabase = createMockSupabaseClient({
      data: [], // quizzes: empty
      error: null,
    });
    supabase.__setNextResult({
      data: [{ quiz_id: 99, status: "pending" }], // assignment with no matching quiz
      error: null,
    });

    const result = await listAssignedQuizzes(supabase as never, "a-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data[0].quiz).toBeNull();
  });

  it("returns error when assessment_quizzes query fails", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await listAssignedQuizzes(supabase as never, "a-1");

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// assignQuizToAssessment
// ---------------------------------------------------------------------------

describe("assignQuizToAssessment", () => {
  it("returns ok(undefined) on success", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await assignQuizToAssessment(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "23505", message: "duplicate", details: "", hint: "" },
    });
    const result = await assignQuizToAssessment(supabase as never, "a-1", 1);

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// removeQuizFromAssessment
// ---------------------------------------------------------------------------

describe("removeQuizFromAssessment", () => {
  it("returns ok(undefined) on success", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await removeQuizFromAssessment(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await removeQuizFromAssessment(supabase as never, "a-1", 1);

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getAssignmentRow
// ---------------------------------------------------------------------------

describe("getAssignmentRow", () => {
  it("returns ok with the full row when found", async () => {
    const supabase = createMockSupabaseClient({ data: ROW, error: null });
    const result = await getAssignmentRow(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(ROW);
  });

  it("returns NotFoundError when missing (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getAssignmentRow(supabase as never, "a-1", 99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// isQuizAssigned
// ---------------------------------------------------------------------------

describe("isQuizAssigned", () => {
  it("returns ok(true) when the quiz is assigned", async () => {
    const supabase = createMockSupabaseClient({ data: { quiz_id: 1 }, error: null });
    const result = await isQuizAssigned(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBe(true);
  });

  it("returns ok(false) when the quiz is not assigned — not an error", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await isQuizAssigned(supabase as never, "a-1", 99);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getQuizStatus
// ---------------------------------------------------------------------------

describe("getQuizStatus", () => {
  it("returns ok with the status string", async () => {
    const supabase = createMockSupabaseClient({
      data: { status: "completed" },
      error: null,
    });
    const result = await getQuizStatus(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBe("completed");
  });

  it("returns NotFoundError when the row is missing", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getQuizStatus(supabase as never, "a-1", 99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// getQuizSubmission
// ---------------------------------------------------------------------------

describe("getQuizSubmission", () => {
  it("returns ok with the submission payload", async () => {
    const payload = { submission: [{ question_id: 1, answer: "A" }] };
    const supabase = createMockSupabaseClient({
      data: { submission: payload },
      error: null,
    });
    const result = await getQuizSubmission(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(payload);
  });

  it("returns ok(null) when submission is null", async () => {
    const supabase = createMockSupabaseClient({
      data: { submission: null },
      error: null,
    });
    const result = await getQuizSubmission(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// saveQuizSubmission
// ---------------------------------------------------------------------------

describe("saveQuizSubmission", () => {
  it("returns ok(undefined) on success", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await saveQuizSubmission(
      supabase as never,
      "a-1",
      1,
      { submission: [] },
      "12:00:00"
    );

    expect(result.ok).toBe(true);
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await saveQuizSubmission(
      supabase as never,
      "a-1",
      1,
      {},
      "12:00:00"
    );

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// startTimer
// ---------------------------------------------------------------------------

describe("startTimer", () => {
  it("updates timer when timer_flag is false", async () => {
    // defaultResult drives the update call (2nd)
    const supabase = createMockSupabaseClient({ data: null, error: null });
    // nextResult drives getAssignmentRow (1st)
    supabase.__setNextResult({ data: ROW, error: null });

    const result = await startTimer(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
  });

  it("skips the update when timer_flag is already true", async () => {
    const alreadyStarted = { ...ROW, timer_flag: true, timer_start: "2024-01-01T00:00:00Z" };
    // Only one DB call needed (getAssignmentRow); update should not happen
    const supabase = createMockSupabaseClient({ data: alreadyStarted, error: null });

    const result = await startTimer(supabase as never, "a-1", 1);

    expect(result.ok).toBe(true);
  });

  it("returns NotFoundError when the row does not exist", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await startTimer(supabase as never, "a-1", 99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
