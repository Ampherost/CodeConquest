import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError } from "@/lib/db/errors";
import {
  getInvitation,
  listInvitationsForBusiness,
  listInvitationsForCandidate,
  createInvitation,
  updateInvitationStatus,
  findInvitationsByParticipants,
  patchInvitationByParticipants,
  findInvitationByAssessmentAndCandidate,
  findInvitationByAssessmentAndBusiness,
  type Invitation,
} from "@/lib/db/invitations";

const INV: Invitation = {
  invitation_id: "inv-1",
  business_user_id: "b-1",
  candidate_user_id: "c-1",
  position: "Engineer",
  status: "completed",
  notes: "Top candidate",
  assessment_id: "a-1",
};

// ---------------------------------------------------------------------------
// getInvitation
// ---------------------------------------------------------------------------

describe("getInvitation", () => {
  it("returns ok when the invitation exists", async () => {
    const supabase = createMockSupabaseClient({ data: INV, error: null });
    const result = await getInvitation(supabase as never, "inv-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(INV);
  });

  it("returns NotFoundError when missing (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getInvitation(supabase as never, "missing");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// listInvitationsForBusiness
// ---------------------------------------------------------------------------

describe("listInvitationsForBusiness", () => {
  it("returns all invitations for a business user", async () => {
    const supabase = createMockSupabaseClient({ data: [INV], error: null });
    const result = await listInvitationsForBusiness(supabase as never, "b-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toHaveLength(1);
  });

  it("returns empty array when no invitations exist", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listInvitationsForBusiness(supabase as never, "b-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await listInvitationsForBusiness(supabase as never, "b-1");

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// listInvitationsForCandidate
// ---------------------------------------------------------------------------

describe("listInvitationsForCandidate", () => {
  it("returns invitations with embedded quiz data", async () => {
    const row = {
      invitation_id: "inv-1",
      position: "Engineer",
      status: "completed",
      assessment_id: "a-1",
      assessment_quizzes: [{ quiz_id: 1, status: "completed" }],
    };
    const supabase = createMockSupabaseClient({ data: [row], error: null });
    const result = await listInvitationsForCandidate(supabase as never, "c-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0].assessment_quizzes).toHaveLength(1);
    }
  });

  it("returns empty array when candidate has no invitations", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listInvitationsForCandidate(supabase as never, "c-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// createInvitation
// ---------------------------------------------------------------------------

describe("createInvitation", () => {
  it("returns ok(undefined) on success", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await createInvitation(supabase as never, {
      business_user_id: "b-1",
      candidate_user_id: "c-1",
      position: "Engineer",
      status: "completed",
    });

    expect(result.ok).toBe(true);
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "23505", message: "duplicate", details: "", hint: "" },
    });
    const result = await createInvitation(supabase as never, {
      business_user_id: "b-1",
      candidate_user_id: "c-1",
      position: "Engineer",
      status: "completed",
    });

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// updateInvitationStatus
// ---------------------------------------------------------------------------

describe("updateInvitationStatus", () => {
  it("returns the updated invitation on success", async () => {
    const updated = { ...INV, status: "pending" };
    const supabase = createMockSupabaseClient({ data: updated, error: null });
    const result = await updateInvitationStatus(supabase as never, "inv-1", "pending");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.status).toBe("pending");
  });

  it("returns NotFoundError when the invitation does not exist", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await updateInvitationStatus(supabase as never, "missing", "pending");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// findInvitationsByParticipants
// ---------------------------------------------------------------------------

describe("findInvitationsByParticipants", () => {
  it("returns matching invitations", async () => {
    const supabase = createMockSupabaseClient({ data: [INV], error: null });
    const result = await findInvitationsByParticipants(
      supabase as never,
      "b-1",
      "c-1",
      "Engineer"
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toHaveLength(1);
  });

  it("returns empty array when no duplicate exists", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await findInvitationsByParticipants(
      supabase as never,
      "b-1",
      "c-new",
      "Engineer"
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// patchInvitationByParticipants
// ---------------------------------------------------------------------------

describe("patchInvitationByParticipants", () => {
  it("returns ok(undefined) on success", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await patchInvitationByParticipants(
      supabase as never,
      "b-1",
      "c-1",
      "Engineer",
      { notes: "Updated note" }
    );

    expect(result.ok).toBe(true);
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await patchInvitationByParticipants(
      supabase as never,
      "b-1",
      "c-1",
      "Engineer",
      { notes: "x" }
    );

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// findInvitationByAssessmentAndCandidate
// ---------------------------------------------------------------------------

describe("findInvitationByAssessmentAndCandidate", () => {
  it("returns ok(invitation) when found", async () => {
    const supabase = createMockSupabaseClient({ data: INV, error: null });
    const result = await findInvitationByAssessmentAndCandidate(
      supabase as never,
      "a-1",
      "c-1"
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(INV);
  });

  it("returns ok(null) when no invitation links the candidate to the assessment", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await findInvitationByAssessmentAndCandidate(
      supabase as never,
      "a-1",
      "c-stranger"
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeNull();
  });

  it("returns error on DB failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await findInvitationByAssessmentAndCandidate(
      supabase as never,
      "a-1",
      "c-1"
    );

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// findInvitationByAssessmentAndBusiness
// ---------------------------------------------------------------------------

describe("findInvitationByAssessmentAndBusiness", () => {
  it("returns ok(invitation) when found", async () => {
    const supabase = createMockSupabaseClient({ data: INV, error: null });
    const result = await findInvitationByAssessmentAndBusiness(
      supabase as never,
      "a-1",
      "b-1"
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(INV);
  });

  it("returns ok(null) when no invitation links the business to the assessment", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await findInvitationByAssessmentAndBusiness(
      supabase as never,
      "a-1",
      "b-stranger"
    );

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeNull();
  });
});
