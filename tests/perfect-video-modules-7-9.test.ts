import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  new URL(
    "../supabase/migrations/20260928175443_perfect_video_modules_7_9_v6_release.sql",
    import.meta.url,
  ),
  "utf8",
);

const payloadMatch = migration.match(
  /payload jsonb := \$curriculum\$(\[[\s\S]*?\])\$curriculum\$::jsonb;/,
);
if (!payloadMatch) throw new Error("Modules 7–9 payload is missing from migration");

const lessons = JSON.parse(payloadMatch[1]) as Array<{
  module_id: string;
  lesson_id: string;
    title: string;
    objective: string;
    hook: string;
    blocks: Array<{
    position: number;
    block_key: string;
    block_type: string;
    title: string;
    content: unknown;
    required: boolean;
    answer_key?: { correct?: string; order?: string[] };
    feedback?: { explanation?: string };
  }>;
}>;

const textOf = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textOf).join(" ");
  if (value && typeof value === "object") {
    return Object.values(value).map(textOf).join(" ");
  }
  return "";
};

const expectedIds = [
  ...Array.from({ length: 16 }, (_, i) => `pv07-${String(i + 1).padStart(2, "0")}`),
  ...Array.from({ length: 16 }, (_, i) => `pv08-${String(i + 1).padStart(2, "0")}`),
  ...[1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
    (i) => `pv09-${String(i).padStart(2, "0")}`,
  ),
];

describe("Perfect Video modules 7–9 release content", () => {
  it("keeps every existing lesson ID and varies the lesson length by the work", () => {
    expect(lessons).toHaveLength(43);
    expect(lessons.map((lesson) => lesson.lesson_id).sort()).toEqual(
      expectedIds.sort(),
    );
    const moduleCounts = lessons.reduce<Record<string, number>>((counts, lesson) => {
      counts[lesson.module_id] = (counts[lesson.module_id] ?? 0) + 1;
      return counts;
    }, {});
    expect(moduleCounts).toEqual({ "s02-m07": 16, "s02-m08": 16, "s02-m09": 11 });

    const stepCounts = new Set(lessons.map((lesson) => lesson.blocks.length));
    expect(Math.min(...stepCounts)).toBe(13);
    expect(Math.max(...stepCounts)).toBeGreaterThanOrEqual(18);
    expect(stepCounts.size).toBeGreaterThanOrEqual(5);
  });

  it("uses substantial, practical material and closed automatic checks only", () => {
    const forbidden = new Set([
      "practical_response",
      "reflection",
      "homework",
      "submission",
      "prompt_builder",
    ]);
    const visibleLengths = lessons.map((lesson) =>
      lesson.blocks.reduce(
        (total, block) => total + block.title.length + textOf(block.content).length,
        0,
      ),
    );
    expect(Math.min(...visibleLengths)).toBeGreaterThanOrEqual(6000);
    expect(visibleLengths.sort((a, b) => a - b)[21]).toBeGreaterThanOrEqual(7300);

    for (const lesson of lessons) {
      expect(lesson.objective.trim()).not.toBe("");
      expect(lesson.hook.trim()).not.toBe("");
      expect(lesson.blocks.every((block, i) =>
        block.block_key && block.title && block.position === i,
      )).toBe(true);
      expect(new Set(lesson.blocks.map((block) => block.block_key)).size).toBe(
        lesson.blocks.length,
      );
      expect(lesson.blocks.some((block) => forbidden.has(block.block_type))).toBe(false);

      const types = lesson.blocks.map((block) => block.block_type);
      expect(types.filter((type) => type === "quiz")).toHaveLength(2);
      expect(types.filter((type) => type === "scenario")).toHaveLength(2);
      expect(types.filter((type) => type === "sequence_sort")).toHaveLength(1);

      const graded = lesson.blocks.filter((block) => block.answer_key);
      expect(graded).toHaveLength(5);
      for (const block of graded) {
        expect(block.content as Record<string, unknown>).not.toHaveProperty("answer_key");
        expect(block.feedback?.explanation?.length).toBeGreaterThan(250);
        if (block.block_type === "quiz" || block.block_type === "scenario") {
          const options = (block.content as { options: Array<{ id: string }> }).options;
          expect(options).toHaveLength(3);
          expect(new Set(options.map((option) => option.id)).size).toBe(3);
          expect(options.some((option) => option.id === block.answer_key?.correct)).toBe(true);
        }
        if (block.block_type === "sequence_sort") {
          const items = (block.content as { items: Array<{ id: string }> }).items;
          expect(block.answer_key?.order).toEqual(["s1", "s2", "s3", "s4"]);
          expect(new Set(block.answer_key?.order)).toEqual(
            new Set(items.map((item) => item.id)),
          );
        }
      }
    }
  });

  it("keeps answer keys private and snapshots learner progress before rebasing", () => {
    expect(migration).toContain("INSERT INTO academy_private.lesson_block_keys");
    expect(migration).toContain("LOCK TABLE public.academy_lesson_progress");
    expect(migration).toContain("academy_private.lesson_progress_history");
    expect(migration).toContain("progress_xp_before<>progress_xp_after");
    expect(migration).toContain("score_percent=NULL");
    expect(migration).toContain("completed_at=NULL");
  });
});
