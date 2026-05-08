import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError, DuplicateError } from "@/lib/db/errors";
import {
  getBusinessProfile,
  createBusinessProfile,
  updateBusinessProfile,
  type BusinessProfile,
} from "@/lib/db/businesses";

const PROFILE: BusinessProfile = {
  user_id: "b-1",
  business_name: "Acme Corp",
  business_email: "acme@example.com",
};

// ---------------------------------------------------------------------------
// getBusinessProfile
// ---------------------------------------------------------------------------

describe("getBusinessProfile", () => {
  it("returns ok with the profile when found", async () => {
    const supabase = createMockSupabaseClient({ data: PROFILE, error: null });
    const result = await getBusinessProfile(supabase as never, "b-1");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(PROFILE);
  });

  it("returns NotFoundError when no row exists (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getBusinessProfile(supabase as never, "missing");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// createBusinessProfile
// ---------------------------------------------------------------------------

describe("createBusinessProfile", () => {
  it("returns ok with the created profile on success", async () => {
    const supabase = createMockSupabaseClient({ data: PROFILE, error: null });
    const result = await createBusinessProfile(supabase as never, {
      user_id: "b-1",
      business_name: "Acme Corp",
      business_email: "acme@example.com",
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(PROFILE);
  });

  it("returns DuplicateError on unique-constraint violation (23505)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "23505", message: "duplicate key", details: "", hint: "" },
    });
    const result = await createBusinessProfile(supabase as never, {
      user_id: "b-1",
      business_name: "Acme Corp",
      business_email: "acme@example.com",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(DuplicateError);
  });
});

// ---------------------------------------------------------------------------
// updateBusinessProfile
// ---------------------------------------------------------------------------

describe("updateBusinessProfile", () => {
  it("returns ok with the updated profile on success", async () => {
    const updated = { ...PROFILE, business_name: "Acme Corp 2" };
    const supabase = createMockSupabaseClient({ data: updated, error: null });
    const result = await updateBusinessProfile(supabase as never, "b-1", {
      business_name: "Acme Corp 2",
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.business_name).toBe("Acme Corp 2");
  });

  it("returns NotFoundError when the row does not exist (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await updateBusinessProfile(supabase as never, "missing", {
      business_name: "X",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
