import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import { NotFoundError, DuplicateError, PermissionError } from "@/lib/db/errors";
import {
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getCurrentUser,
  type User,
} from "@/lib/db/users";

// Convenience fixture
const USER_ROW: User = {
  user_id: "u-123",
  email: "alice@example.com",
  role: "candidate",
};

// ---------------------------------------------------------------------------
// getUserById
// ---------------------------------------------------------------------------

describe("getUserById", () => {
  it("returns ok with the user when found", async () => {
    const supabase = createMockSupabaseClient({ data: USER_ROW, error: null });
    const result = await getUserById(supabase as never, "u-123");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(USER_ROW);
  });

  it("returns NotFoundError when the row does not exist (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getUserById(supabase as never, "missing");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it("returns PermissionError on 42501", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "42501", message: "permission denied", details: "", hint: "" },
    });
    const result = await getUserById(supabase as never, "u-123");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(PermissionError);
  });
});

// ---------------------------------------------------------------------------
// getUserByEmail
// ---------------------------------------------------------------------------

describe("getUserByEmail", () => {
  it("returns ok with the user when found", async () => {
    const supabase = createMockSupabaseClient({ data: USER_ROW, error: null });
    const result = await getUserByEmail(supabase as never, "alice@example.com");

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(USER_ROW);
  });

  it("returns NotFoundError when the email is not in the table (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await getUserByEmail(supabase as never, "nobody@example.com");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});

// ---------------------------------------------------------------------------
// createUser
// ---------------------------------------------------------------------------

describe("createUser", () => {
  it("returns ok with the created user on success", async () => {
    const supabase = createMockSupabaseClient({ data: USER_ROW, error: null });
    const result = await createUser(supabase as never, {
      user_id: "u-123",
      email: "alice@example.com",
      role: "candidate",
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(USER_ROW);
  });

  it("returns DuplicateError on unique-constraint violation (23505)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: {
        code: "23505",
        message: "duplicate key value violates unique constraint",
        details: "",
        hint: "",
      },
    });
    const result = await createUser(supabase as never, {
      user_id: "u-999",
      email: "alice@example.com",
      role: "candidate",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(DuplicateError);
  });
});

// ---------------------------------------------------------------------------
// updateUser
// ---------------------------------------------------------------------------

describe("updateUser", () => {
  it("returns ok with the updated user on success", async () => {
    const updated = { ...USER_ROW, email: "alice-new@example.com" };
    const supabase = createMockSupabaseClient({ data: updated, error: null });
    const result = await updateUser(supabase as never, "u-123", {
      email: "alice-new@example.com",
    });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBe("alice-new@example.com");
  });

  it("returns NotFoundError when the row does not exist (PGRST116)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    const result = await updateUser(supabase as never, "missing", { role: "business" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it("returns PermissionError on RLS denial (PGRST301)", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST301", message: "JWT expired", details: "", hint: "" },
    });
    const result = await updateUser(supabase as never, "u-123", { role: "business" });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(PermissionError);
  });
});

// ---------------------------------------------------------------------------
// getCurrentUser
// ---------------------------------------------------------------------------

describe("getCurrentUser", () => {
  it("returns ok when auth session exists and user row is found", async () => {
    // Default result drives the users-table query; auth.getUser is overridden below.
    const supabase = createMockSupabaseClient({ data: USER_ROW, error: null });
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u-123" } },
      error: null,
    });

    const result = await getCurrentUser(supabase as never);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(USER_ROW);
  });

  it("returns NotFoundError when there is no active session (data.user is null)", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    const result = await getCurrentUser(supabase as never);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it("returns PermissionError when auth.getUser fails with 401", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Unauthorized", status: 401, name: "AuthError" },
    });

    const result = await getCurrentUser(supabase as never);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(PermissionError);
  });

  it("returns NotFoundError when auth succeeds but the users row is missing", async () => {
    const supabase = createMockSupabaseClient({
      data: null,
      error: { code: "PGRST116", message: "no rows", details: "", hint: "" },
    });
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "u-orphan" } },
      error: null,
    });

    const result = await getCurrentUser(supabase as never);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
