import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LEARNING_SECTIONS } from "../src/mocks/learning-platform";
import { lessonReadingDuration } from "../src/lib/academy-reading-time";

const sql = readFileSync(
  new URL(
    "../supabase/migrations/20260929194936_perfect_video_modules_10_12_v7_release.sql",
    import.meta.url,
  ),
  "utf8",
);
const match = sql.match(/payload jsonb := \$curriculum\$(\[[\s\S]*?\])\$curriculum\$::jsonb;/);
if (!match) throw new Error("The 10–12 release has no curriculum payload");

type Block = {
  position: number;
  block_key: string;
  block_type: string;
  title: string;
  content: Record<string, unknown>;
  required: boolean;
  points: number;
  answer_key?: { correct?: string; order?: string[] };
  feedback?: { explanation: string };
};
type Lesson = {
  module_id: string;
  lesson_id: string;
  title: string;
  estimated_minutes: number;
  objective: string;
  hook: string;
  blocks: Block[];
};
const lessons = JSON.parse(match[1]) as Lesson[];
const section = LEARNING_SECTIONS.find((entry) => entry.id === "perfektno-video");

describe("Perfect Video 10–12 first publication", () => {
  it("publishes exactly the 40 catalog lessons with titles and reading-only labels", () => {
    expect(lessons).toHaveLength(40);
    expect(new Set(lessons.map((entry) => entry.lesson_id)).size).toBe(40);
    for (const [moduleId, count] of Object.entries({
      "s02-m10": 16,
      "s02-m11": 16,
      "s02-m12": 8,
    })) {
      const catalog = section?.modules.find((entry) => entry.id === moduleId);
      const published = lessons.filter((entry) => entry.module_id === moduleId);
      expect(published).toHaveLength(count);
      expect(published.map((entry) => entry.lesson_id)).toEqual(
        catalog?.lessons.map((entry) => entry.id),
      );
      for (const lesson of published) {
        const listing = catalog?.lessons.find((entry) => entry.id === lesson.lesson_id);
        expect(lesson.title).toBe(listing?.title);
        expect(listing?.duration).toBe(lessonReadingDuration(moduleId, lesson.lesson_id));
      }
    }
  });

  it("provides substantial, varied practice with five privately graded checks per lesson", () => {
    const counts = new Set<number>();
    const correctPositions = new Set<string>();
    const forbidden = new Set([
      "practical_response", "reflection", "homework", "submission", "prompt_builder",
    ]);
    for (const lesson of lessons) {
      counts.add(lesson.blocks.length);
      expect(lesson.objective.length).toBeGreaterThan(70);
      expect(lesson.hook.length).toBeGreaterThan(50);
      expect(lesson.blocks.length).toBeGreaterThanOrEqual(13);
      expect(lesson.blocks.length).toBeLessThanOrEqual(20);
      expect(lesson.blocks.map((entry) => entry.position)).toEqual(
        Array.from({ length: lesson.blocks.length }, (_, index) => index),
      );
      expect(new Set(lesson.blocks.map((entry) => entry.block_key)).size).toBe(
        lesson.blocks.length,
      );
      expect(lesson.blocks.some((entry) => forbidden.has(entry.block_type))).toBe(false);
      const visible = lesson.blocks.map((entry) =>
        entry.title + JSON.stringify(entry.content),
      ).join(" ");
      expect(visible.length).toBeGreaterThan(5000);
      for (const type of ["quiz", "scenario"]) {
        expect(lesson.blocks.filter((entry) => entry.block_type === type)).toHaveLength(2);
      }
      expect(lesson.blocks.filter((entry) => entry.block_type === "sequence_sort")).toHaveLength(1);
      const checks = lesson.blocks.filter((entry) => entry.answer_key);
      expect(checks).toHaveLength(5);
      for (const check of checks) {
        expect(check.content).not.toHaveProperty("answer_key");
        expect(check.feedback?.explanation.length).toBeGreaterThan(250);
        if (check.block_type === "sequence_sort") {
          const items = check.content.items as Array<{ id: string }>;
          expect(new Set(check.answer_key?.order)).toEqual(new Set(items.map((item) => item.id)));
        } else {
          const options = check.content.options as Array<{ id: string; label: string }>;
          expect(options).toHaveLength(3);
          expect(new Set(options.map((entry) => entry.label)).size).toBe(3);
          expect(options.some((entry) => entry.id === check.answer_key?.correct)).toBe(true);
          correctPositions.add(check.answer_key?.correct ?? "");
        }
      }
    }
    expect(counts.size).toBeGreaterThanOrEqual(4);
    expect(correctPositions).toEqual(new Set(["a", "b", "c"]));
  });

  it("refuses to overwrite existing lessons and leaves earlier learner rows alone", () => {
    expect(sql).toContain("Modules 10–12 already contain lessons");
    expect(sql).toContain("INSERT INTO academy_private.lesson_block_keys");
    expect(sql).toContain("Expected 200 private answer keys");
    expect(sql).toContain("academy_private.lesson_validation(version_uuid)");
    expect(sql).not.toMatch(/LOCK TABLE public\.academy_lesson_(?:progress|attempts_v2)/);
    expect(sql).not.toMatch(/(?:UPDATE|DELETE FROM) public\.academy_lesson_(?:progress|attempts_v2)/);
  });
});
