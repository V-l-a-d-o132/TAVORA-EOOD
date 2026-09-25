import type { LessonBlockType, LessonBlockV2 } from './lesson-engine-v2';

const readingTypes = new Set<LessonBlockType>([
  'objective', 'hook', 'concept', 'rich_text', 'before_after',
  'case_study', 'example', 'summary',
]);

const labels: Partial<Record<LessonBlockType, string>> = {
  objective: 'Цел на урока',
  hook: 'Реалният проблем',
  concept: 'Учебен материал',
  rich_text: 'Учебен материал',
  before_after: 'Сравнение',
  case_study: 'Казус и решение',
  example: 'Решен пример',
  summary: 'Обобщение',
  quiz: 'Проверка на знанията',
  reflection: 'Размисъл',
  checklist: 'Списък за проверка',
  homework: 'Практическа задача',
  submission: 'Предаване на задача',
};

// Presentation follows the block's purpose, regardless of the course it belongs to.
export function lessonBlockPresentation(block: LessonBlockV2) {
  const reading = readingTypes.has(block.type);
  const label = block.key === 'practice_brief' ? 'Практическа задача'
    : block.key === 'model_solution' ? 'Решен пример'
    : block.type === 'practical_response' ? (block.required ? 'Практическа задача' : 'Твоите бележки')
    : labels[block.type] ?? 'Практическа стъпка';
  const continueHint = reading ? 'Отбележи „Прочетох“, за да продължиш.'
    : block.type === 'quiz' ? 'Отговори на въпроса, за да продължиш.'
    : 'Изпълни задачата в тази стъпка, за да продължиш.';
  return { label, reading, continueHint };
}
