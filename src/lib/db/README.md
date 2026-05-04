# src/lib/db — Database Service Layer

This directory is the single place where Supabase queries live. Components and
API routes call these functions instead of using the Supabase client directly.

---

## File naming

One file per domain entity, named after the entity (plural noun):

```
src/lib/db/
  users.ts
  invitations.ts
  invitation-codes.ts
  assessment-quizzes.ts
  quizzes.ts
  questions.ts
  candidate-users.ts
  business-users.ts
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
| `delete` | Remove a record                          |

Examples: `getUser`, `listInvitations`, `createAssessmentQuiz`, `updateTimer`,
`deleteAssessmentQuiz`.

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
