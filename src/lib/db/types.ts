import type { DbError } from "./errors";

// ---------------------------------------------------------------------------
// Result<T> — discriminated union returned by every service function
// ---------------------------------------------------------------------------

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: DbError };

/** Wrap a successful value in a Result. */
export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

/** Wrap an error in a Result. */
export function err(error: DbError): Result<never> {
  return { ok: false, error };
}
