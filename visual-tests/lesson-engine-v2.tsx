import React from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import LessonEngineV2 from '../src/pages/module/components/lesson-v2/LessonEngineV2';
import type { LessonBlockV2, LessonV2 } from '../src/lib/lesson-engine-v2';

const blocks: LessonBlockV2[] = [
  { id: 'objective', key: 'objective', position: 0, type: 'objective', title: 'Цел на урока', content: { body: 'Да различаваш задача за AI от решение, което изисква човешка преценка.' }, required: true, points: 5 },
  { id: 'hook', key: 'hook', position: 1, type: 'hook', title: 'Реалният проблем', content: { body: 'Екипът губи часове в AI, но резултатът пак се пренаписва от нулата.' }, required: true, points: 5 },
  { id: 'concept', key: 'concept', position: 2, type: 'concept', title: 'Принципът зад решението', content: { body: 'AI е силен при ясно зададен контекст, критерий и проверима чернова; отговорността за фактите и решението остава човешка.' }, required: true, points: 5 },
  { id: 'interaction', key: 'interaction', position: 3, type: 'decision_tree', title: 'Избери надеждния първи експеримент', content: { prompt: 'Клиент иска да автоматизира следващото бизнес решение. От коя задача започваш?', options: [{ id: 'a', label: 'Повтаряема задача с ясен вход и проверим резултат' }, { id: 'b', label: 'Окончателно юридическо решение без проверка' }, { id: 'c', label: 'Неясна задача без критерий за успех' }] }, required: true, points: 10 },
  { id: 'quiz', key: 'quiz', position: 4, type: 'quiz', title: 'Проверка на разбирането', content: { question: 'Кой носи отговорност за финалното решение?', options: [{ id: 'a', label: 'Човекът, който проверява фактите' }, { id: 'b', label: 'AI моделът' }] }, required: true, points: 15 },
  { id: 'practice', key: 'practice', position: 5, type: 'practical_response', title: 'Практическа задача', content: { prompt: 'Опиши една своя задача, желания резултат и човешката проверка.', minLength: 60 }, required: true, points: 15 },
  { id: 'summary', key: 'summary', position: 6, type: 'summary', title: 'Обобщение и следваща стъпка', content: { takeaways: ['Ясният вход прави резултата проверим.', 'Човекът запазва отговорността.'], nextStep: 'Избери една задача и направи малък тест още днес.' }, required: true, points: 5 },
];

const lesson: LessonV2 = {
  id: 'visual-lesson', moduleId: 's01-m01', lessonId: 'l01-01', status: 'published', versionId: 'visual-v2', version: 2,
  title: 'Основи на AI за бизнес — какво работи и какво не', subtitle: 'От впечатляващ отговор към надежден работен процес', duration: '25 мин',
  objective: 'да различаваш задача за AI от решение, което изисква човешка преценка', hook: 'Реален бизнес риск', estimatedMinutes: 25,
  sourceKind: 'reference', validation: { errors: [], warnings: [] }, blocks, versionChanged: false,
  progress: { currentBlockKey: 'interaction', blockState: {}, completedBlockKeys: ['objective', 'hook', 'concept'], xp: 15, scorePercent: null, masteryStatus: 'learning', completedAt: null, lastActivityAt: new Date().toISOString() },
};

createRoot(document.getElementById('root')!).render(
  <main className="min-h-screen bg-[#080808] px-3 py-5 sm:px-6 md:py-8">
    <LessonEngineV2 moduleId="s01-m01" lessonId="l01-01" userId="visual-student" lessonOverride={lesson} previewMode />
  </main>,
);
