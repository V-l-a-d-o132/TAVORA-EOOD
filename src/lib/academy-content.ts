import { supabase } from "@/lib/supabase";

export interface ChecklistItemData {
  id: number;
  text: string;
}

export interface LessonSlide {
  id: string;
  type:
    | "title"
    | "content"
    | "comparison"
    | "framework"
    | "interactive"
    | "example"
    | "checkpoint"
    | "summary"
    | "checklist";
  title: string;
  subtitle?: string;
  body?: string;
  highlights?: string[];
  leftSide?: {
    label: string;
    content: string;
    verdict: "bad" | "good";
  };
  rightSide?: {
    label: string;
    content: string;
    verdict: "bad" | "good";
  };
  frameworkSteps?: {
    number: number;
    title: string;
    description: string;
    icon: string;
    example: string;
  }[];
  interactivePrompt?: {
    scenario: string;
    task: string;
    hint: string;
    revealAnswer: string;
  };
  examples?: {
    label: string;
    text: string;
    highlight?: string;
  }[];
  checkpoint?: {
    question: string;
    options: string[];
    correctIndex?: number;
    explanation?: string;
  };
  keyTakeaways?: string[];
  cta?: string;
  checklistItems?: ChecklistItemData[];
}

export interface LessonData {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  slides: LessonSlide[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export async function fetchLessonData(
  moduleId: string,
  lessonId?: string,
): Promise<LessonData | null> {
  if (!lessonId) return null;
  const { data, error } = await supabase.rpc("academy_get_lesson", {
    p_module: moduleId,
    p_lesson: lessonId,
  });
  if (error) throw error;
  return data as LessonData | null;
}
