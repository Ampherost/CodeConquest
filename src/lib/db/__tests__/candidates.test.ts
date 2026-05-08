import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError, DuplicateError } from "@/lib/db/errors";
import {
  getCandidateProfile,
  createCandidateProfile,
  listCandidatesForBusiness,
  type CandidateProfile,
  type CandidateWithInvitation,
} from "@/lib/db/candidates";

const PROFILE: CandidateProfile = {
  user_id: "c-1",
  first_name: "Alice",
  last_name: "Smith",
};

// ---------------------------------------------------------------------------
// getCandidateProfile
// ---------------------------------------------------------------------------

describe("getCandidateProfile", () => {
  it("returns ok with the profile when found", async () => {
    const supabase = createMockSupabaseClient({ data: PROFILE, error: null });
    const result = await getCandidateProfile(supabase as never, "c-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(PROFILE);
  });

  it("returns NotFoundError when the row does not exist (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getCandidateProfile(supabase as never, "missing");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// createCandidateProfile
// ---------------------------------------------------------------------------

describe("createCandidateProfile", () => {
  it("returns ok with the created profile on success", async () => {
    const supabase = createMockSupabaseClient({ data: PROFILE, error: null });
    const result = await createCandidateProfile(supabase as never, {
      user_id: "c-1",
      first_name: "Alice",
      last_name: "Smith",
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(PROFILE);
  });

  it("returns DuplicateError on unique-constraint violation (23505)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "23505", message: "duplicate key", details: "", hint: "" },
    });
    const result = await createCandidateProfile(supabase as never, {
      user_id: "c-1",
      first_name: "Alice",
      last_name: "Smith",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(DuplicateError);
  });
});

// ---------------------------------------------------------------------------
// listCandidatesForBusiness
// ---------------------------------------------------------------------------

describe("listCandidatesForBusiness", () => {
  it("returns empty array when there are zero invitations — not an error", async () => {
    // First call (invitations) returns empty → function exits early
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listCandidatesForBusiness(supabase as never, "b-1", "completed");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("consolidates invitation and candidate data into CandidateWithInvitation[]", async () => {
    // defaultResult drives the 2nd call (candidate_users)
    const supabase = createMockSupabaseClient({
      data: [PROFILE],
      error: null,
    });
    // nextResult is consumed by the 1st call (invitations)
    supabase.__setNextResult({
      data: [{ candidate_user_id: "c-1", invitation_id: "inv-1" }],
      error: null,
    });

    const result = await listCandidatesForBusiness(supabase as never, "b-1", "completed");

    expect(result.ok).toBe(true);
    if (result.ok) {
      const item: CandidateWithInvitation = result.data[0];
      expect(item.user_id).toBe("c-1");
      expect(item.first_name).toBe("Alice");
      expect(item.last_name).toBe("Smith");
      expect(item.invitation_id).toBe("inv-1");
    }
  });

  it("returns empty array when invitations exist but candidate lookup returns nothing", async () => {
    const supabase = createMockSupabaseClient({
      data: [], // candidate_users returns empty
      error: null,
    });
    supabase.__setNextResult({
      data: [{ candidate_user_id: "c-ghost", invitation_id: "inv-2" }],
      error: null,
    });

    const result = await listCandidatesForBusiness(supabase as never, "b-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns error when the invitations query fails", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await listCandidatesForBusiness(supabase as never, "b-1");

    expect(result.ok).toBe(false);
  });

  it("does not require status filter — returns all invitations when omitted", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listCandidatesForBusiness(supabase as never, "b-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });
});
