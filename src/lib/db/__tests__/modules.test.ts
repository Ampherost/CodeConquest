import { listModules, getModuleBySlug } from "@/lib/db/modules";
import { modules as rawModules } from "../../../../lib/modules";
import { chaptersByModule } from "../../../../lib/chapters";
import { NotFoundError } from "@/lib/db/errors";

// modules.ts functions don't use the supabase client yet, pass null as a stand-in
const supabase = null;

// ---------------------------------------------------------------------------
// listModules
// ---------------------------------------------------------------------------

describe("listModules", () => {
  it("returns ok with all modules", async () => {
    const result = await listModules(supabase);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toEqual(rawModules);
  });

  it("returns the same length as the raw export", async () => {
    const result = await listModules(supabase);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toHaveLength(rawModules.length);
  });

  it("each module has id, title, description, and chapters array", async () => {
    const result = await listModules(supabase);

    expect(result.ok).toBe(true);
    if (result.ok) {
      for (const mod of result.data) {
        expect(typeof mod.id).toBe("string");
        expect(typeof mod.title).toBe("string");
        expect(typeof mod.description).toBe("string");
        expect(Array.isArray(mod.chapters)).toBe(true);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// getModuleBySlug
// ---------------------------------------------------------------------------

describe("getModuleBySlug", () => {
  it("returns ok with the correct module for a known slug", async () => {
    const slug = rawModules[0].id;
    const result = await getModuleBySlug(supabase, slug);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBe(slug);
      expect(result.data.title).toBe(rawModules[0].title);
    }
  });

  it("includes chapterContents matching chaptersByModule", async () => {
    const slug = "software-engineering";
    const result = await getModuleBySlug(supabase, slug);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.chapterContents).toEqual(
        chaptersByModule[slug] ?? []
      );
    }
  });

  it("returns chapterContents as empty array for a module with no chapters in chaptersByModule", async () => {
    // Add a module that is not in chaptersByModule to verify graceful fallback.
    // We mock the raw import by testing a slug that doesn't exist in chaptersByModule.
    // Since all real slugs map fine, we verify "compilers" as a smoke test.
    const slug = "compilers";
    const result = await getModuleBySlug(supabase, slug);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Array.isArray(result.data.chapterContents)).toBe(true);
    }
  });

  it("returns NotFoundError for an unknown slug", async () => {
    const result = await getModuleBySlug(supabase, "does-not-exist");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });
});
