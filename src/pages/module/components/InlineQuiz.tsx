import { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from '@/mocks/quiz-questions';
import { C } from '@/pages/module/constants';

interface InlineQuizProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onComplete: (score: number, total: number) => void;
  onClose: () => void;
}

export default function InlineQuiz({ questions, lessonTitle, onComplete, onClose }: InlineQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<'quiz' | 'result'>('quiz');

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(false));
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
    setPhase('quiz');
  }, [questions]);

  const currentQuestion = questions[currentIdx];

  const handleSelect = useCallback(
    (idx: number) => {
      if (revealed || !currentQuestion) return;
      setSelected(idx);
      setRevealed(true);
      const isCorrect = idx === currentQuestion.correctIndex;
      setAnswers((prev) => {
        const copy = [...prev];
        copy[currentIdx] = isCorrect;
        return copy;
      });
      if (currentIdx < questions.length - 1) {
        setTimeout(() => {
          setCurrentIdx((i) => i + 1);
          setSelected(null);
          setRevealed(false);
        }, 1500);
      }
    },
    [revealed, currentQuestion, currentIdx, questions.length]
  );

  const finishQuiz = useCallback(() => {
    const correctCount = answers.filter(Boolean).length;
    setPhase('result');
    onComplete(correctCount, questions.length || 1);
  }, [answers, questions.length, onComplete]);

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

  /* Keyboard shortcuts */
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
        if (num < (currentQuestion?.options?.length || 0)) {
          handleSelect(num);
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, revealed, currentQuestion, goNext, goPrev, handleSelect, onClose]);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <p className="text-sm" style={{ color: C.textMuted }}>Няма налични въпроси за този урок.</p>
        <button
          onClick={onClose}
          className="mt-4 px-5 py-2.5 text-sm font-semibold transition-colors"
          style={{ background: C.accent, color: '#fff' }}
        >
          Затвори
        </button>
      </div>
    );
  }

  /* ─── RESULT SCREEN ─── */
  if (phase === 'result') {
    const correctCount = answers.filter(Boolean).length;
    const percent = Math.round((correctCount / questions.length) * 100);
    const passed = percent >= 60;
    return (
      <div className="p-6 sm:p-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-5" style={{ border: `2px solid ${passed ? C.success : C.accent}` }}>
            <i className={passed ? 'ri-trophy-line' : 'ri-restart-line'} style={{ color: passed ? C.success : C.accent, fontSize: '28px' }} />
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: C.text }}>{passed ? 'Браво.' : 'Почти.'}</h3>
          <p className="text-sm mb-5" style={{ color: C.textMuted }}>{passed ? 'Ти премина теста успешно' : 'Прегледай материала и опитай пак'}</p>
          <div className="inline-flex items-baseline gap-3">
            <span className="text-5xl font-bold tracking-tight" style={{ color: passed ? C.success : C.accent }}>{correctCount}</span>
            <span className="text-2xl" style={{ color: C.textDim }}>/</span>
            <span className="text-3xl font-semibold" style={{ color: C.textMuted }}>{questions.length}</span>
            <span className="text-sm ml-1" style={{ color: C.textDim }}>({percent}%)</span>
          </div>
          {passed && <p className="text-sm font-semibold mt-4" style={{ color: C.success }}>+{correctCount * 4} точки</p>}
        </div>

        <div className="space-y-2 mb-6 max-h-72 overflow-y-auto">
          {questions.map((q, idx) => {
            const state = answers[idx] ? 'correct' : 'wrong';
            return (
              <div
                key={q.id}
                className="flex items-center gap-3 p-3 text-sm"
                style={{
                  background: state === 'correct' ? C.successDim : '#1a0505',
                  border: `1px solid ${state === 'correct' ? '#113311' : '#441111'}`,
                }}
              >
                <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{
                  background: state === 'correct' ? C.success : C.accent,
                  color: '#fff',
                }}>
                  {state === 'correct' ? <i className="ri-check-line" style={{ fontSize: '12px' }} /> :
                   <i className="ri-close-line" style={{ fontSize: '12px' }} />}
                </div>
                <span className="flex-1 text-sm" style={{ color: C.textMuted }}>{q.question}</span>
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
                setAnswers(new Array(questions.length).fill(false));
              }}
              className="flex-1 px-5 py-3 text-sm font-medium transition-colors"
              style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
            >
              Опитай пак
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 text-sm font-bold transition-colors"
            style={{ background: C.accent, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            {passed ? 'Продължи' : 'Затвори'}
          </button>
        </div>
      </div>
    );
  }

  /* ─── QUIZ SCREEN ─── */
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${C.accent}` }}>
              <i className="ri-brain-line" style={{ color: C.accent, fontSize: '16px' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: C.text }}>Проверка на знанията</h3>
              <p className="text-xs truncate max-w-[240px]" style={{ color: C.textDim }}>{lessonTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ border: `1px solid ${C.border}`, background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
          >
            <i className="ri-close-line" style={{ color: C.textDim, fontSize: '14px' }} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1" style={{ height: '2px', background: C.border }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${((currentIdx + (revealed ? 1 : 0)) / questions.length) * 100}%`, background: C.accent }}
            />
          </div>
          <span className="text-xs font-mono shrink-0" style={{ color: C.textDim }}>
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
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
                  width: active && !state ? '20px' : '6px',
                  height: '3px',
                  background: active && !state ? C.accent : state ? C.success : C.border,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="px-5 py-6">
        <p className="text-lg font-semibold mb-6 leading-relaxed" style={{ color: C.text }}>
          {currentQuestion.question}
        </p>

        <div className="space-y-2">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            let cStyle: React.CSSProperties = { background: C.bg, border: `1px solid ${C.border}` };
            let lStyle: React.CSSProperties = { background: C.border, color: C.textDim };
            let tStyle: React.CSSProperties = { color: C.textMuted };
            if (revealed) {
              if (isCorrect) {
                cStyle = { background: C.successDim, border: `1px solid ${C.success}` };
                lStyle = { background: C.success, color: '#fff' };
                tStyle = { color: '#fff' };
              } else if (isSelected && !isCorrect) {
                cStyle = { background: '#1a0505', border: `1px solid ${C.accent}` };
                lStyle = { background: C.accent, color: '#fff' };
                tStyle = { color: '#fff' };
              } else {
                cStyle = { background: C.bg, border: `1px solid ${C.border}`, opacity: 0.4 };
                lStyle = { background: C.border, color: C.textDim };
                tStyle = { color: C.textDim };
              }
            } else if (isSelected) {
              cStyle = { background: '#1a0505', border: `1px solid ${C.accent}` };
              lStyle = { background: C.accent, color: '#fff' };
              tStyle = { color: '#fff' };
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={revealed}
                className="w-full text-left px-4 py-3.5 transition-all duration-200"
                style={cStyle}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0 text-xs font-bold transition-all" style={lStyle}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1 text-sm leading-relaxed" style={tStyle}>
                    {opt}
                  </span>
                  {revealed && isCorrect && (
                    <i className="ri-check-line shrink-0" style={{ color: C.success, fontSize: '18px' }} />
                  )}
                  {revealed && isSelected && !isCorrect && (
                    <i className="ri-close-line shrink-0" style={{ color: C.accent, fontSize: '18px' }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-5 p-4" style={answers[currentIdx] ? { background: C.successDim, border: `1px solid #113311` } : { background: '#1a0505', border: `1px solid #441111` }}>
            <div className="flex items-center gap-2 mb-2">
              <i className={answers[currentIdx] ? 'ri-check-double-line' : 'ri-information-line'}
                 style={{ color: answers[currentIdx] ? C.success : C.accent, fontSize: '16px' }} />
              <span className="text-sm font-semibold" style={{ color: answers[currentIdx] ? C.success : C.accent }}>
                {answers[currentIdx] ? 'Верен отговор.' : 'Грешен отговор.'}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={goPrev}
          disabled={currentIdx === 0 || revealed}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
          style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textMuted }}
        >
          <i className="ri-arrow-left-line" style={{ fontSize: '12px' }} />
          Назад
        </button>

        <span className="text-xs font-mono" style={{ color: C.textDim }}>
          {answers.filter(Boolean).length}/{questions.length} отговорени
        </span>

        {currentIdx === questions.length - 1 ? (
          <button
            onClick={finishQuiz}
            disabled={!revealed}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-colors"
            style={{ background: C.accent, color: '#fff' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            Край
            <i className="ri-flag-line" style={{ fontSize: '12px' }} />
          </button>
        ) : (
          <button
            onClick={goNext}
            disabled={!revealed}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors"
            style={{ background: C.accent, color: '#fff' }}
            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            Следващ
            <i className="ri-arrow-right-line" style={{ fontSize: '12px' }} />
          </button>
        )}
      </div>
    </div>
  );
}