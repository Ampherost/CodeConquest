import {
  DbError,
  NotFoundError,
  DuplicateError,
  PermissionError,
  wrapSupabaseError,
} from "@/lib/db/errors";
import { ok, err, type Result } from "@/lib/db/types";
import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
import type { PostgrestError } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Error class hierarchy
// ---------------------------------------------------------------------------

describe("DbError hierarchy", () => {
  it("DbError is an instance of Error", () => {
    const e = new DbError("base");
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(DbError);
    expect(e.message).toBe("base");
    expect(e.name).toBe("DbError");
  });

  it("NotFoundError extends DbError", () => {
    const e = new NotFoundError("not found");
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(DbError);
    expect(e).toBeInstanceOf(NotFoundError);
    expect(e.name).toBe("NotFoundError");
  });

  it("DuplicateError extends DbError", () => {
    const e = new DuplicateError("duplicate");
    expect(e).toBeInstanceOf(DbError);
    expect(e).toBeInstanceOf(DuplicateError);
    expect(e.name).toBe("DuplicateError");
  });

  it("PermissionError extends DbError", () => {
    const e = new PermissionError("forbidden");
    expect(e).toBeInstanceOf(DbError);
    expect(e).toBeInstanceOf(PermissionError);
    expect(e.name).toBe("PermissionError");
  });

  it("stores cause on DbError", () => {
    const cause = { code: "PGRST116", message: "no rows" };
    const e = new NotFoundError("not found", cause);
    expect(e.cause).toBe(cause);
  });
});

// ---------------------------------------------------------------------------
// wrapSupabaseError
// ---------------------------------------------------------------------------

describe("wrapSupabaseError", () => {
  it("returns null when error is null", () => {
    expect(wrapSupabaseError(null)).toBeNull();
  });

  it("maps PGRST116 to NotFoundError", () => {
    const pgError: PostgrestError = {
      name: "PostgrestError",
      code: "PGRST116",
      message: "no rows",
      details: "",
      hint: "",
    };
    const result = wrapSupabaseError(pgError);
    expect(result).toBeInstanceOf(NotFoundError);
  });

  it("maps 23505 to DuplicateError", () => {
    const pgError: PostgrestError = {
      name: "PostgrestError",
      code: "23505",
      message: "unique violation",
      details: "",
      hint: "",
    };
    expect(wrapSupabaseError(pgError)).toBeInstanceOf(DuplicateError);
  });

  it("maps 42501 to PermissionError", () => {
    const pgError: PostgrestError = {
      name: "PostgrestError",
      code: "42501",
      message: "permission denied",
      details: "",
      hint: "",
    };
    expect(wrapSupabaseError(pgError)).toBeInstanceOf(PermissionError);
  });

  it("falls back to DbError for unknown codes", () => {
    const pgError: PostgrestError = {
      name: "PostgrestError",
      code: "99999",
      message: "something else",
      details: "",
      hint: "",
    };
    const result = wrapSupabaseError(pgError);
    expect(result).toBeInstanceOf(DbError);
    expect(result).not.toBeInstanceOf(NotFoundError);
    expect(result).not.toBeInstanceOf(DuplicateError);
    expect(result).not.toBeInstanceOf(PermissionError);
  });
});

// ---------------------------------------------------------------------------
// Result<T> helpers
// ---------------------------------------------------------------------------

describe("Result helpers", () => {
  it("ok() produces { ok: true, data }", () => {
    const result = ok({ id: "123" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ id: "123" });
    }
  });

  it("err() produces { ok: false, error }", () => {
    const error = new NotFoundError("not found");
    const result = err(error);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(error);
      expect(result.error).toBeInstanceOf(NotFoundError);
    }
  });

  it("Result type narrows correctly", () => {
    const results: Result<string>[] = [ok("hello"), err(new DbError("oops"))];
    const successes = results.filter((r): r is { ok: true; data: string } => r.ok);
    expect(successes).toHaveLength(1);
    expect(successes[0].data).toBe("hello");
  });
});

// ---------------------------------------------------------------------------
// createMockSupabaseClient — chainability
// ---------------------------------------------------------------------------

describe("createMockSupabaseClient", () => {
  it("is chainable and resolves to { data, error }", async () => {
    const supabase = createMockSupabaseClient({ data: { role: "candidate" }, error: null });
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", "abc")
      .single();
    expect(error).toBeNull();
    expect(data).toEqual({ role: "candidate" });
  });

  it("supports longer chains", async () => {
    const supabase = createMockSupabaseClient({ data: [{ id: 1 }], error: null });
    const { data } = await supabase
      .from("invitations")
      .select("*")
      .eq("business_user_id", "x")
      .eq("status", "completed")
      .order("created_at");
    expect(data).toEqual([{ id: 1 }]);
  });

  it("supports .maybeSingle()", async () => {
    const supabase = createMockSupabaseClient({ data: null, error: null });
    const { data, error } = await supabase
      .from("invitations")
      .select("invitation_id")
      .eq("assessment_id", "a1")
      .eq("candidate_user_id", "u1")
      .maybeSingle();
    expect(data).toBeNull();
    expect(error).toBeNull();
  });

  it("__setNextResult overrides the default for one call", async () => {
    const supabase = createMockSupabaseClient({ data: { role: "business" }, error: null });

    supabase.__setNextResult({ data: null, error: { code: "PGRST116", message: "not found", details: "", hint: "" } });

    const first = await supabase.from("users").select("role").eq("user_id", "x").single();
    expect(first.error).not.toBeNull();
    expect(first.data).toBeNull();

    // Second call falls back to default
    const second = await supabase.from("users").select("role").eq("user_id", "y").single();
    expect(second.error).toBeNull();
    expect(second.data).toEqual({ role: "business" });
  });

  it("auth.getUser() resolves", async () => {
    const supabase = createMockSupabaseClient({ data: { id: "u1", email: "a@b.com" }, error: null });
    const { data, error } = await supabase.auth.getUser();
    expect(error).toBeNull();
    expect(data.user).toEqual({ id: "u1", email: "a@b.com" });
  });
});
