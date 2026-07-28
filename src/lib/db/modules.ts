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

export type DashboardModule = RawModule & {
  slug: string;
  level: string;
  chaptersCount: number;
  quizzesCount: number;
  image: string;
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
 * Return all module cards dynamically formatted for dashboard views.
 */
export async function listDashboardModules(
  _supabase: unknown
): Promise<Result<DashboardModule[]>> {
  const dashboardList: DashboardModule[] = rawModules.map((mod) => {
    const chapterContents = chaptersByModule[mod.id] ?? [];
    const quizCount = chapterContents.reduce(
      (sum, ch) => sum + (ch.quiz ? ch.quiz.length : 0),
      0
    );

    return {
      ...mod,
      slug: mod.id,
      level: mod.level ?? "Beginner",
      image: mod.image ?? "/assets/software-engineer.png",
      chaptersCount: mod.chapters ? mod.chapters.length : 0,
      quizzesCount: quizCount,
    };
  });

  return ok(dashboardList);
}

/**
 * Return non-W.I.P. modules for current active learning dashboard tab.
 */
export async function listCurrentModules(
  _supabase: unknown
): Promise<Result<DashboardModule[]>> {
  const result = await listDashboardModules(_supabase);
  if (!result.ok) return result;
  return ok(result.data.filter((m) => m.level !== "W.I.P."));
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
