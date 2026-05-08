/**
 * createMockSupabaseClient()
 *
 * Returns a lightweight chainable mock that matches the subset of Supabase's
 * query-builder API used by the db service layer:
 *
 *   supabase.from(table).select(cols).eq(col, val).single()
 *   supabase.from(table).insert(rows).select().single()
 *   supabase.from(table).update(patch).eq(col, val)
 *   supabase.from(table).delete().match(filters).single()
 *   supabase.from(table).select(cols).in(col, values)
 *   supabase.auth.getUser()
 *
 * Every terminal call (.single(), .maybeSingle(), awaiting the builder) resolves
 * to `{ data, error }` taken from the options passed at construction time.
 *
 * Usage in tests:
 *
 *   const supabase = createMockSupabaseClient({ data: { role: "candidate" }, error: null });
 *   const { data, error } = await supabase.from("users").select("role").eq("user_id", "x").single();
 *   expect(data).toEqual({ role: "candidate" });
 *
 * Per-call overrides:
 *
 *   const supabase = createMockSupabaseClient();
 *   supabase.__setNextResult({ data: null, error: { message: "not found", code: "PGRST116" } });
 */

import type { PostgrestError } from "@supabase/supabase-js";

export interface MockResult<T = unknown> {
  data: T | null;
  error: Partial<PostgrestError> | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Builder = Record<string, any> & {
  then: (resolve: (value: MockResult) => void) => Promise<MockResult>;
};

function makeBuilder(resolve: () => MockResult): Builder {
  const terminal = () => Promise.resolve(resolve());

  const builder: Builder = new Proxy(
    {
      then(onFulfilled: (v: MockResult) => void) {
        return Promise.resolve(resolve()).then(onFulfilled);
      },
    } as Builder,
    {
      get(target, prop: string) {
        if (prop === "then") return target.then.bind(target);
        // Terminal methods that return the resolved promise
        if (
          prop === "single" ||
          prop === "maybeSingle" ||
          prop === "csv" ||
          prop === "execute"
        ) {
          return terminal;
        }
        // All other methods (select, eq, neq, in, not, filter, match, order,
        // limit, range, insert, update, delete, upsert, select, returns…)
        // return the same builder so chains work.
        return () => builder;
      },
    }
  );

  return builder;
}

export function createMockSupabaseClient(defaultResult: MockResult = { data: null, error: null }) {
  let nextResult: MockResult | null = null;

  const getResult = (): MockResult => {
    if (nextResult !== null) {
      const r = nextResult;
      nextResult = null;
      return r;
    }
    return defaultResult;
  };

  const client = {
    /** Override the result for the very next terminal call only. */
    __setNextResult(result: MockResult) {
      nextResult = result;
    },

    from(_table: string) {
      return makeBuilder(getResult);
    },

    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: defaultResult.data }, error: defaultResult.error }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: defaultResult.data, error: defaultResult.error }),
      signUp: jest.fn().mockResolvedValue({ data: defaultResult.data, error: defaultResult.error }),
      signOut: jest.fn().mockResolvedValue({ error: defaultResult.error }),
    },
  };

  return client;
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
