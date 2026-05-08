# src/lib/db — Database Service Layer

This directory is the single place where Supabase queries live. Components and
API routes call these functions instead of using the Supabase client directly.

See also: [docs/db-audit.md](../../../docs/db-audit.md) for the original audit
that motivated this layer.

---

## Domain modules

| File | Tables touched | Key functions |
|------|---------------|---------------|
| `users.ts` | `users` | `getUserById`, `getUserByEmail`, `upsertUser`, `getAuthenticatedUser` |
| `businesses.ts` | `business_users` | `getBusinessUser`, `listBusinessUsers`, `upsertBusinessUser` |
| `candidates.ts` | `candidate_users`, `invitations` | `getCandidateUser`, `upsertCandidateUser`, `listCandidatesForBusiness` |
| `invitations.ts` | `invitations` | `getInvitation`, `listInvitationsForBusiness`, `listInvitationsForCandidate`, `createInvitation`, `updateInvitationStatus`, `findInvitationsByParticipants`, `patchInvitationByParticipants`, `findInvitationByAssessmentAndCandidate`, `findInvitationByAssessmentAndBusiness` |
| `invitation-codes.ts` | `invitation_codes` | `createInvitationCode`, `getInvitationCodeByCode`, `updateInvitationCodeStatus`, `listPendingInvitationCodesForBusiness` |
| `quizzes.ts` | `quizzes`, `questions` | `getQuizById`, `listQuizzes`, `getQuizQuestions`, `getQuestionsForScoring` |
| `assessments.ts` | `assessment_quizzes`, `invitations`, `quizzes` | `listAssignedQuizzes`, `assignQuiz`, `getQuizStatus`, `getQuizTimer`, `updateQuizTimer`, `saveQuizSubmission`, `getQuizSubmission`, `getQuizScore` |
| `modules.ts` | static (no DB) | `listModules`, `getModuleBySlug` |

---

## File naming

One file per domain entity, named after the entity (plural noun):

```
src/lib/db/
  users.ts
  businesses.ts
  candidates.ts
  invitations.ts
  invitation-codes.ts
  quizzes.ts
  assessments.ts
  modules.ts
  index.ts        ← re-exports everything
  types.ts        ← Result<T>, ok(), err()
  errors.ts       ← DbError hierarchy, wrapSupabaseError()
```

---

## Function naming

`<verb><EntityName>` — verb is one of:

| Verb     | Meaning                                  |
|----------|------------------------------------------|
| `get`    | Fetch a single record (returns `Result<T>`, `NotFoundError` if missing) |
| `list`   | Fetch multiple records (returns `Result<T[]>`, empty array if none) |
| `create` | Insert a new record                      |
| `update` | Mutate an existing record                |
| `patch`  | Partial update by a compound key         |
| `find`   | Lookup by non-PK criteria (may return null) |
| `delete` | Remove a record                          |

---

## Return type

Every public function returns `Result<T>` — **never throws**.

```ts
import { ok, err, wrapSupabaseError } from "@/lib/db";

export async function getUser(
  supabase: SupabaseClient,
  userId: string
): Promise<Result<User>> {
  const { data, error } = await supabase
    .from("users")
    .select("user_id, email, role")
    .eq("user_id", userId)
    .single();

  if (error) return err(wrapSupabaseError(error) ?? new DbError(error.message));
  return ok(data);
}
```

Callers narrow on `result.ok`:

```ts
const result = await getUser(supabase, userId);
if (!result.ok) {
  if (result.error instanceof NotFoundError) { /* 404 */ }
  return NextResponse.json({ error: result.error.message }, { status: 500 });
}
console.log(result.data.role);
```

---

## Dependency injection — SupabaseClient as first parameter

Every function accepts a `SupabaseClient` as its **first parameter**.  This
means the same function works:

- In API routes (server client, full DB access)
- In Server Components (server client)
- In Client Components (browser client, respects RLS)
- In tests (mock client — see `__mocks__/supabase.ts`)

```ts
// API route (server-side)
import { createClient } from "@/utils/supabase/server";
const supabase = await createClient();
const result = await getUser(supabase, userId);

// Test
import { createMockSupabaseClient } from "@/lib/db/__mocks__/supabase";
const supabase = createMockSupabaseClient({ data: fakeUser, error: null });
const result = await getUser(supabase, "abc");
```

---

## Domain types

Types used only within a single domain file live **in that file**, not in
`types.ts`.  Only cross-cutting types (like `Result<T>`) go in `types.ts`.

```ts
// users.ts
export interface User {
  user_id: string;
  email: string;
  role: "business" | "candidate";
}

export async function getUser(...): Promise<Result<User>> { ... }
```

---

## Re-exports

Every public symbol must be re-exported from `index.ts` so callers always
import from `"@/lib/db"`:

```ts
// index.ts
export * from "./errors";
export * from "./types";
export * from "./users";
export * from "./invitations";
// ...
```

---

## Conventions that emerged during Week 1

- **`find*` prefix** for lookups that return `Result<T | null>` (using
  `.maybeSingle()`), distinguishing them from `get*` which always expects a row.
- **`wrapSupabaseError` covers the common error codes** (`PGRST116` → NotFoundError,
  `23505` → DuplicateError, `42501`/`PGRST301` → PermissionError). Callers can
  `instanceof`-check without touching raw Supabase error codes.
- **Client-component reads** (e.g. `pendingApplicants.tsx`, `DashboardAssessments.tsx`)
  use the browser Supabase client passed to the same service functions — RLS
  enforces access control; no separate API endpoint needed.
- **API routes use `authenticateRequest(role)`** — never raw `auth.getUser()`.
  The two remaining page files that call `auth.getUser()` directly
  (`quiz/[quizID]/page.jsx`, `quiz/[quizID]/review/page.jsx`) are legacy paths
  not yet migrated (deferred to Week 4).

---

## Known TODOs / deferred items

- **Week 4**: Migrate legacy quiz/review pages off `getUserRolebyEmail` /
  `getUserID` helpers and onto `getAuthenticatedUser` + `authenticateRequest`.
- **No test for `modules.ts` static data edge-cases**: coverage is 100% but
  the "no module found" branch in `getModuleBySlug` is exercised by the mock —
  confirm against real `lib/chapters.ts` data in Week 4.
- **`src/app/helper/generateCode.jsx`** is still imported by `formFieldInvitation.tsx`
  — it's a pure utility (no DB calls), not subject to the migration rule.
- **`src/app/helper/get/getUserRolebyEmail.js`** and **`getUserID.js`** are
  still imported by the legacy quiz pages — keep until Week 4 migration.
