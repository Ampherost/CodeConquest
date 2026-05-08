import type { AuthError, PostgrestError } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Base error
// ---------------------------------------------------------------------------

export class DbError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "DbError";
    this.cause = cause;
    // Restore prototype chain (required when extending built-ins in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ---------------------------------------------------------------------------
// Specialised subclasses
// ---------------------------------------------------------------------------

export class NotFoundError extends DbError {
  constructor(message = "Record not found", cause?: unknown) {
    super(message, cause);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DuplicateError extends DbError {
  constructor(message = "Duplicate record", cause?: unknown) {
    super(message, cause);
    this.name = "DuplicateError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class PermissionError extends DbError {
  constructor(message = "Permission denied", cause?: unknown) {
    super(message, cause);
    this.name = "PermissionError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ---------------------------------------------------------------------------
// Supabase → DbError converter
// ---------------------------------------------------------------------------

/**
 * Maps a Supabase `PostgrestError` or `AuthError` to one of our typed error
 * classes.  Returns `null` when `error` is null (i.e. the call succeeded).
 *
 * Supabase error code reference:
 *   - PostgrestError.code follows PostgreSQL SQLSTATE codes
 *     - "23505" → unique-constraint violation → DuplicateError
 *     - "PGRST116" → zero rows returned by .single() → NotFoundError
 *   - AuthError.status 401/403 → PermissionError
 */
export function wrapSupabaseError(
  error: PostgrestError | AuthError | null
): DbError | null {
  if (error === null) return null;

  const message = error.message;

  // PostgrestError — has a `code` field
  if ("code" in error) {
    const code = (error as PostgrestError).code;

    if (code === "PGRST116") {
      // PostgREST "JSON object requested, multiple (or no) rows returned"
      return new NotFoundError(message, error);
    }

    if (code === "23505") {
      // PostgreSQL unique-constraint violation
      return new DuplicateError(message, error);
    }

    if (code === "42501" || code === "PGRST301") {
      // PostgreSQL insufficient privilege / PostgREST JWT expired/missing
      return new PermissionError(message, error);
    }
  }

  // AuthError — check HTTP status
  if ("status" in error) {
    const status = (error as AuthError).status;
    if (status === 401 || status === 403) {
      return new PermissionError(message, error);
    }
  }

  // Fallback: generic DbError
  return new DbError(message, error);
}
