import { modules as rawModules, type Module as RawModule } from "../../../lib/modules";
import { chaptersByModule, type ChapterContent } from "../../../lib/chapters";
import { ok, type Result } from "./types";

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

/** Summary view — matches `lib/modules.ts` Module shape (no chapter content). */
export type ModuleSummary = RawModule;

/** Full module with chapter content loaded from chapters.ts. */
export type Module = RawModule & {
  chapterContents: ChapterContent[];
};

// ---------------------------------------------------------------------------
// Service functions
//
// These functions wrap the static data in lib/modules.ts and lib/chapters.ts
// as Result<T> so callers are insulated from the data source. In week 4 the
// implementations here can be swapped to read from the database without any
// change to callers.
// ---------------------------------------------------------------------------

/**
 * Return the full list of module summaries (id, title, description, chapters).
 * Never fails — the static data is always available.
 */
export async function listModules(
  // supabase is accepted for interface parity with future DB implementation
  _supabase: unknown
): Promise<Result<ModuleSummary[]>> {
  return ok(rawModules);
}

/**
 * Return a single module by slug (module id), including its chapter contents.
 * Returns NotFoundError when no module with that slug exists.
 */
export async function getModuleBySlug(
  _supabase: unknown,
  slug: string
): Promise<Result<Module>> {
  const { NotFoundError } = await import("./errors");
  const raw = rawModules.find((m) => m.id === slug);
  if (!raw) {
    return { ok: false, error: new NotFoundError(`Module not found: ${slug}`) };
  }
  return ok({ ...raw, chapterContents: chaptersByModule[slug] ?? [] });
}
