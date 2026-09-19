import { useState, useEffect, useMemo, useCallback } from 'react';
import { getQuizForLesson, generateDefaultQuiz } from '@/mocks/quiz-questions';
import type { QuizQuestion } from '@/mocks/quiz-questions';

interface QuizComponentProps {
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

type AnswerState = 'unanswered' | 'correct' | 'wrong';

const BRAND = {
  bg: '#0a0a0a',
  card: '#111111',
  border: '#1a1a1a',
  borderLight: '#222222',
  accent: '#e53e3e',
  text: '#ffffff',
  textMuted: '#888888',
  textDim: '#555555',
  success: '#22c55e',
  successBg: '#0a1f0a',
  errorBg: '#1a0505',
};

export default function QuizComponent({
  moduleId,
  lessonId,
  lessonTitle,
  onClose,
  onComplete,
}: QuizComponentProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');

  const shuffledIndices = useMemo(() => {
    if (questions.length === 0) return [] as number[][];
    return questions.map((q) => {
      const indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices;
    });
  }, [questions]);

  useEffect(() => {
    const quizData = getQuizForLesson(moduleId, lessonId) || generateDefaultQuiz(moduleId, lessonId, lessonTitle);
    setQuestions(quizData.questions);
    setAnswers(new Array(quizData.questions.length).fill('unanswered'));
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setPhase('quiz');
  }, [moduleId, lessonId, lessonTitle]);

  const handleSelect = useCallback((shuffledIdx: number) => {
    if (revealed) return;
    setSelected(shuffledIdx);
    setRevealed(true);

    const cur = currentIdx;
    const shuf = shuffledIndices[cur];
    const qs = questions;
    if (!shuf || !qs[cur]) return;

    const realIdx = shuf[shuffledIdx];
    const correctIdx = qs[cur].correctIndex;
    const isCorrect = realIdx === correctIdx;

    setAnswers((prev) => {
      const copy = [...prev];
      copy[cur] = isCorrect ? 'correct' : 'wrong';
      return copy;
    });

    if (cur < questions.length - 1) {
      setTimeout(() => {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
        setRevealed(false);
      }, 1800);
    }
  }, [revealed, currentIdx, shuffledIndices, questions]);

  const goNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }, [currentIdx, questions.length]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => Math.max(0, i - 1));
      setSelected(null);
      setRevealed(false);
    }
  }, [currentIdx]);

  const finishQuiz = useCallback(() => {
    const correctCount = answers.filter((a) => a === 'correct').length;
    setPhase('result');
    onComplete(correctCount, questions.length);
  }, [answers, questions.length, onComplete]);

  const currentQuestion = questions[currentIdx];
  const currentShuffled = shuffledIndices[currentIdx] || [];
  const totalAnswered = answers.filter((a) => a !== 'unanswered').length;
  const isLast = currentIdx === questions.length - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase === 'result') {
        if (e.key === 'Escape') { e.preventDefault(); onClose(); }
        return;
      }
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' && revealed) {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
      if (!revealed && e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10) - 1;
        if (num < currentShuffled.length) handleSelect(num);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, revealed, currentShuffled.length, goNext, goPrev, handleSelect, onClose]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-16" style={{ background: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center" style={{ border: `1px solid ${BRAND.border}` }}>
          <i className="ri-loader-4-line animate-spin" style={{ color: BRAND.textDim, fontSize: '16px' }} />
        </div>
        <p className="text-sm" style={{ color: BRAND.textMuted }}>Зареждаме въпросите...</p>
      </div>
    );
  }

  /* ─── RESULT SCREEN ─── */
  if (phase === 'result') {
    const correctCount = answers.filter((a) => a === 'correct').length;
    const percent = Math.round((correctCount / questions.length) * 100);
    const passed = percent >= 60;

    return (
      <div className="p-6 sm:p-8" style={{ background: BRAND.card, border: `1px solid ${BRAND.border}` }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-5" style={{ border: `2px solid ${passed ? BRAND.success : BRAND.accent}` }}>
            <i className={passed ? 'ri-trophy-line' : 'ri-restart-line'} style={{ color: passed ? BRAND.success : BRAND.accent, fontSize: '24px' }} />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.text }}>
            {passed ? 'Браво.' : 'Почти.'}
          </h3>
          <p className="text-sm mb-4" style={{ color: BRAND.textMuted }}>
            {passed ? 'Ти премина теста успешно' : 'Прегледай материала и опитай пак'}
          </p>
          <div className="inline-flex items-baseline gap-3">
            <span className="text-4xl font-bold" style={{ color: passed ? BRAND.success : BRAND.accent }}>{correctCount}</span>
            <span className="text-xl" style={{ color: BRAND.textDim }}>/</span>
            <span className="text-2xl font-semibold" style={{ color: BRAND.textMuted }}>{questions.length}</span>
            <span className="text-sm ml-1" style={{ color: BRAND.textDim }}>({percent}%)</span>
          </div>
          {passed && (
            <p className="text-sm font-semibold mt-3" style={{ color: BRAND.success }}>+{correctCount * 4} точки</p>
          )}
        </div>

        <div className="space-y-2 mb-6 max-h-72 overflow-y-auto">
          {questions.map((q, idx) => {
            const state = answers[idx];
            return (
              <div
                key={q.id}
                className="flex items-center gap-3 p-3 text-sm"
                style={{
                  background: state === 'correct' ? BRAND.successBg : state === 'wrong' ? BRAND.errorBg : BRAND.bg,
                  border: `1px solid ${state === 'correct' ? '#113311' : state === 'wrong' ? '#441111' : BRAND.border}`,
                }}
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{
                  background: state === 'correct' ? BRAND.success : state === 'wrong' ? BRAND.accent : BRAND.border,
                  color: '#fff',
                }}>
                  {state === 'correct' ? <i className="ri-check-line" style={{ fontSize: '12px' }} /> :
                   state === 'wrong' ? <i className="ri-close-line" style={{ fontSize: '12px' }} /> :
                   <span className="text-xs font-medium">{idx + 1}</span>}
                </div>
                <span className="flex-1 text-sm" style={{ color: BRAND.textMuted }}>{q.question}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          {!passed && (
            <button
              onClick={() => {
                setPhase('quiz');
                setCurrentIdx(0);
                setSelected(null);
                setRevealed(false);
                setAnswers(new Array(questions.length).fill('unanswered'));
              }}
              className="flex-1 px-5 py-3 text-sm font-medium transition-colors"
              style={{ background: 'transparent', border: `1px solid ${BRAND.border}`, color: BRAND.textMuted }}
            >
              Опитай пак
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 text-sm font-semibold transition-colors"
            style={{ background: BRAND.accent, color: '#fff', border: `1px solid ${BRAND.accent}` }}
          >
            {passed ? 'Продължи' : 'Затвори'}
          </button>
        </div>
      </div>
    );
  }

  /* ─── QUIZ SCREEN ─── */
  return (
    <div style={{ background: BRAND.card, border: `1px solid ${BRAND.border}` }}>
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${BRAND.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ border: `1px solid ${BRAND.accent}` }}>
              <i className="ri-brain-line" style={{ color: BRAND.accent, fontSize: '15px' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: BRAND.text }}>Проверка на знанията</h3>
              <p className="text-xs truncate max-w-[240px]" style={{ color: BRAND.textDim }}>{lessonTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ border: `1px solid ${BRAND.border}`, background: 'transparent' }}
          >
            <i className="ri-close-line" style={{ color: BRAND.textDim, fontSize: '14px' }} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1" style={{ height: '2px', background: BRAND.border }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${((currentIdx + (revealed ? 1 : 0)) / questions.length) * 100}%`, background: BRAND.accent }}
            />
          </div>
          <span className="text-xs font-mono shrink-0" style={{ color: BRAND.textDim }}>
            {currentIdx + 1} / {questions.length}
          </span>
        </div>

        {/* Dash nav */}
        <div className="flex items-center gap-2 mt-3">
          {questions.map((q, idx) => {
            const state = answers[idx];
            const active = idx === currentIdx;
            return (
              <button
                key={q.id}
                onClick={() => {
                  if (!revealed) {
                    setCurrentIdx(idx);
                    setSelected(null);
                    setRevealed(false);
                  }
                }}
                className="transition-all"
                style={{
                  width: active && !state ? '18px' : '6px',
                  height: '3px',
                  background: active && !state ? BRAND.accent : state === 'correct' ? BRAND.success : state === 'wrong' ? BRAND.accent : BRAND.border,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-6">
        <p className="text-lg font-semibold mb-6 leading-relaxed" style={{ color: BRAND.text }}>
          {currentQuestion.question}
        </p>

        <div className="space-y-2">
          {currentShuffled.map((realIdx, sIdx) => {
            const realIsCorrect = realIdx === currentQuestion.correctIndex;
            const isSelected = selected === sIdx;

            let containerStyle: React.CSSProperties = { background: BRAND.bg, border: `1px solid ${BRAND.border}` };
            let letterStyle: React.CSSProperties = { background: BRAND.border, color: BRAND.textDim };
            let textStyle: React.CSSProperties = { color: BRAND.textMuted };

            if (revealed) {
              if (realIsCorrect) {
                containerStyle = { background: BRAND.successBg, border: `1px solid ${BRAND.success}` };
                letterStyle = { background: BRAND.success, color: '#fff' };
                textStyle = { color: '#fff' };
              } else if (isSelected && !realIsCorrect) {
                containerStyle = { background: BRAND.errorBg, border: `1px solid ${BRAND.accent}` };
                letterStyle = { background: BRAND.accent, color: '#fff' };
                textStyle = { color: '#fff' };
              } else {
                containerStyle = { background: BRAND.bg, border: `1px solid ${BRAND.border}`, opacity: 0.4 };
                letterStyle = { background: BRAND.border, color: BRAND.textDim };
                textStyle = { color: BRAND.textDim };
              }
            } else if (isSelected) {
              containerStyle = { background: '#1a0505', border: `1px solid ${BRAND.accent}` };
              letterStyle = { background: BRAND.accent, color: '#fff' };
              textStyle = { color: '#fff' };
            }

            return (
              <button
                key={sIdx}
                onClick={() => handleSelect(sIdx)}
                disabled={revealed}
                className="w-full text-left px-4 py-3.5 transition-all duration-200"
                style={containerStyle}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0 text-xs font-bold transition-all" style={letterStyle}>
                    {String.fromCharCode(65 + sIdx)}
                  </div>
                  <span className="flex-1 text-sm leading-relaxed" style={textStyle}>
                    {currentQuestion.options[realIdx]}
                  </span>
                  {revealed && realIsCorrect && (
                    <i className="ri-check-line shrink-0" style={{ color: BRAND.success, fontSize: '18px' }} />
                  )}
                  {revealed && isSelected && !realIsCorrect && (
                    <i className="ri-close-line shrink-0" style={{ color: BRAND.accent, fontSize: '18px' }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {revealed && (
          <div className="mt-5 p-4" style={answers[currentIdx] === 'correct'
            ? { background: BRAND.successBg, border: `1px solid #113311` }
            : { background: BRAND.errorBg, border: `1px solid #441111` }
          }>
            <div className="flex items-center gap-2 mb-2">
              <i className={answers[currentIdx] === 'correct' ? 'ri-check-double-line' : 'ri-information-line'}
                 style={{ color: answers[currentIdx] === 'correct' ? BRAND.success : BRAND.accent, fontSize: '16px' }} />
              <span className="text-sm font-semibold" style={{ color: answers[currentIdx] === 'correct' ? BRAND.success : BRAND.accent }}>
                {answers[currentIdx] === 'correct' ? 'Верен отговор.' : 'Грешен отговор.'}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: BRAND.textMuted }}>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${BRAND.border}` }}>
        <button
          onClick={goPrev}
          disabled={currentIdx === 0 || revealed}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
          style={{ background: 'transparent', border: `1px solid ${BRAND.border}`, color: BRAND.textMuted }}
        >
          <i className="ri-arrow-left-line" style={{ fontSize: '12px' }} />
          Назад
        </button>

        <span className="text-xs font-mono" style={{ color: BRAND.textDim }}>
          {totalAnswered}/{questions.length} отговорени
        </span>

        {isLast ? (
          <button
            onClick={finishQuiz}
            disabled={totalAnswered < questions.length}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ background: BRAND.accent, color: '#fff', border: `1px solid ${BRAND.accent}` }}
          >
            Край
            <i className="ri-flag-line" style={{ fontSize: '12px' }} />
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!revealed}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{ background: BRAND.accent, color: '#fff', border: `1px solid ${BRAND.accent}` }}
          >
            Следващ
            <i className="ri-arrow-right-line" style={{ fontSize: '12px' }} />
          </button>
        )}
      </div>
    </div>
  );
}