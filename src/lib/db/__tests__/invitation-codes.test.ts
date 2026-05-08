import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError, DuplicateError } from "@/lib/db/errors";
import {
  createInvitationCode,
  getInvitationCodeByCode,
  updateInvitationCodeStatus,
  listPendingInvitationCodesForBusiness,
  type InvitationCode,
} from "@/lib/db/invitation-codes";

const CODE_ROW: InvitationCode = {
  invite_code: "ABC123",
  business_user_id: "biz-1",
  full_name: "Jane Doe",
  email: "jane@example.com",
  position: "Engineer",
  notes: "Top candidate",
  status: "pending",
};

// ---------------------------------------------------------------------------
// createInvitationCode
// ---------------------------------------------------------------------------

describe("createInvitationCode", () => {
  it("returns ok on successful insert", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await createInvitationCode(supabase as never, {
      invite_code: "ABC123",
      business_user_id: "biz-1",
      position: "Engineer",
    });

    expect(result.ok).toBe(true);
  });

  it("returns DuplicateError on unique-constraint violation (23505)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "23505", message: "duplicate key", details: "", hint: "" },
    });
    const result = await createInvitationCode(supabase as never, {
      invite_code: "ABC123",
      business_user_id: "biz-1",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(DuplicateError);
  });

  it("returns error on generic Supabase failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await createInvitationCode(supabase as never, {
      invite_code: "XYZ",
      business_user_id: "biz-1",
    });

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// getInvitationCodeByCode
// ---------------------------------------------------------------------------

describe("getInvitationCodeByCode", () => {
  it("returns ok with the code row when found", async () => {
    const supabase = createMockSupabaseClient({ data: CODE_ROW, error: null });
    const result = await getInvitationCodeByCode(supabase as never, "ABC123");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(CODE_ROW);
  });

  it("returns NotFoundError when no row matches (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getInvitationCodeByCode(supabase as never, "BOGUS");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// updateInvitationCodeStatus
// ---------------------------------------------------------------------------

describe("updateInvitationCodeStatus", () => {
  it("returns ok on successful update", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await updateInvitationCodeStatus(supabase as never, "ABC123", "completed");

    expect(result.ok).toBe(true);
  });

  it("returns error on Supabase failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await updateInvitationCodeStatus(supabase as never, "ABC123", "completed");

    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// listPendingInvitationCodesForBusiness
// ---------------------------------------------------------------------------

describe("listPendingInvitationCodesForBusiness", () => {
  it("returns ok with pending codes for the business user", async () => {
    const row = {
      invite_code: "ABC123",
      full_name: "Jane Doe",
      email: "jane@example.com",
      position: "Engineer",
      notes: null,
    };
    const supabase = createMockSupabaseClient({ data: [row], error: null });
    const result = await listPendingInvitationCodesForBusiness(supabase as never, "biz-1");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(row);
    }
  });

  it("returns ok with empty array when none match", async () => {
    const supabase = createMockSupabaseClient({ data: [], error: null });
    const result = await listPendingInvitationCodesForBusiness(supabase as never, "biz-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns ok with empty array when data is null", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const result = await listPendingInvitationCodesForBusiness(supabase as never, "biz-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual([]);
  });

  it("returns error on Supabase failure", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await listPendingInvitationCodesForBusiness(supabase as never, "biz-1");

    expect(result.ok).toBe(false);
  });
});
