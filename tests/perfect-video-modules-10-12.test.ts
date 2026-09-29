import { describe, expect, it } from "vitest";
import { LEARNING_SECTIONS } from "../src/mocks/learning-platform";

const course = LEARNING_SECTIONS.find((section) =>
  section.modules.some((module) => module.id === "s02-m10"),
);

describe("Perfect Video modules 10–12 catalog", () => {
  it("keeps the current course size and complete lesson IDs", () => {
    expect(course).toBeDefined();
    expect(course?.totalModules).toBe(15);
    expect(course?.totalLessons).toBe(246);

    const expected = {
      "s02-m10": Array.from({ length: 16 }, (_, i) => `pv10-${String(i + 1).padStart(2, "0")}`),
      "s02-m11": Array.from({ length: 16 }, (_, i) => `pv11-${String(i + 1).padStart(2, "0")}`),
      "s02-m12": Array.from({ length: 8 }, (_, i) => `pv12-${String(i + 1).padStart(2, "0")}`),
    };
    for (const [id, lessonIds] of Object.entries(expected)) {
      const module = course?.modules.find((entry) => entry.id === id);
      expect(module?.lessons.map((lesson) => lesson.id)).toEqual(lessonIds);
      expect(module?.lessons.every((lesson) => lesson.hasQuiz)).toBe(true);
      expect(module?.lessons.every((lesson) => lesson.duration !== "5 мин")).toBe(true);
      expect(module?.duration).toMatch(/^≈/);
      expect(module?.isLocked).toBe(true);
    }
  });

  it("exposes substantial practice durations instead of placeholder estimates", () => {
    const expectedDurations = {
      "s02-m10": "≈9 ч 48 мин",
      "s02-m11": "≈9 ч 44 мин",
      "s02-m12": "≈5 ч",
    };
    for (const [id, duration] of Object.entries(expectedDurations)) {
      expect(course?.modules.find((module) => module.id === id)?.duration).toBe(duration);
    }
  });
});
