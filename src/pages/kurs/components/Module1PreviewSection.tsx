import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { moduleReadingDuration } from '@/lib/academy-reading-time';

// ────────────────── palette ──────────────────
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#141414',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  greenBg: '#0a1f0a',
  greenBorder: '#113311',
  yellow: '#f59e0b',
};

const INSIGHTS = [
  {
    "num": "1",
    "title": "Ясна задача и проверим резултат",
    "desc": "Опиши задачата, разрешените източници, ограниченията и как ще приемеш резултата. Роля като „експерт“ сама по себе си не дава доказателства.",
    "example": "„Използвай само приложените данни. Отдели фактите от предположенията. Ако липсва информация, посочи я. Предай кратък отговор с източник за всяко число.“"
  },
  {
    "num": "2",
    "title": "Избор на инструмент по задача",
    "desc": "Сравни наличните версии на ChatGPT, Claude и Gemini с една и съща учебна задача. Провери качеството, правата за данните, цената и времето за поправки.",
    "example": "Един бриф, еднакви входни данни, общи критерии. Запази отговорите и отбележи кой може да се използва след проверка."
  },
  {
    "num": "3",
    "title": "Човешка проверка преди използване",
    "desc": "Планирай кой проверява фактите, кое изисква одобрение и кога процесът спира. Оцени целия разход, включително грешките и поправките.",
    "example": "Измери ръчната работа и работата с AI върху четири тестови случая. Сравни приетите резултати и общото време."
  }
];

// ────────────────── 4 inline lessons (simplified) ──────────────────
interface Lesson {
  id: number;
  title: string;
  tag: string;
  points: string[];
  tip: string;
}

const M1_LESSONS: Lesson[] = [
  {
    "id": 1,
    "title": "Основи на AI за бизнес — какво работи и какво не",
    "tag": "Преглед 1",
    "points": [
      "Избери една ограничена задача и разрешени входни данни",
      "Отдели проверимите факти от предложенията на модела",
      "Запиши кой приема резултата и какви грешки са недопустими"
    ],
    "tip": "Пълният урок включва обяснение и задача. Този преглед не заменя изпълнението им."
  },
  {
    "id": 2,
    "title": "Prompt engineering на професионално ниво",
    "tag": "Преглед 2",
    "points": [
      "Опиши цел, контекст, ограничения и формат",
      "Дай пример за приемлив резултат и критерии за проверка",
      "Провери инструкцията върху няколко различни случая"
    ],
    "tip": "Заданието се оценява по приетия резултат, а не по това колко впечатляващо звучи."
  },
  {
    "id": 3,
    "title": "Мулти-моделна стратегия: ChatGPT, Claude, Gemini",
    "tag": "Преглед 3",
    "points": [
      "Сравни наличните инструменти с еднаква задача",
      "Провери източниците, разрешенията и ограниченията за данните",
      "Отчети разхода за проверка и поправка на отговора"
    ],
    "tip": "Функциите и наличността се менят. Избираш инструмент след собствен тест на задачата."
  },
  {
    "id": 4,
    "title": "AI за бизнес решения всеки ден",
    "tag": "Преглед 4",
    "points": [
      "Начертай малък работен процес с начало и край",
      "Определи човешко одобрение и условие за спиране",
      "Измери качество, време и общ разход спрямо ръчната работа"
    ],
    "tip": "Пълният безплатен модул е в Академията. Там са обясненията, упражненията и проверките."
  }
];

const STORAGE_KEY = 'm1_funnel_progress';

function loadProgress(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveProgress(completed: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  } catch { /* storage full — silently ignore */ }
}

export default function Module1PreviewSection() {
  const [started, setStarted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    setCompletedLessons(saved);
    if (saved.length > 0) setStarted(true);
    if (saved.length >= 4 && saved.length === M1_LESSONS.length) {
      setShowLoginGate(true);
    }
  }, []);

  const handleStart = () => {
    setStarted(true);
    setExpandedLesson(1);
  };

  const handleMarkRead = useCallback((lessonId: number) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      saveProgress(next);

      // After completing lesson 4 → show login gate
      if (next.length >= M1_LESSONS.length) {
        setTimeout(() => setShowLoginGate(true), 600);
      }
      return next;
    });
  }, []);

  const toggleLesson = (lessonId: number) => {
    setExpandedLesson((prev) => (prev === lessonId ? null : lessonId));
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/kurs` },
    });
    if (error) setGoogleLoading(false);
  };

  const allDone = completedLessons.length >= M1_LESSONS.length;

  return (
    <section id="module1-preview" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.success}` }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.success }}>Безплатен достъп</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight mb-4">
            Модул 01:{' '}
            <span style={{ color: C.success }}>AI Advantage</span>
          </h2>
          <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: C.textMuted }}>
            Ето какво ще научиш в първия модул. Това не са "тайни" — това е систематизиран подход,
            който ти спестява месеци проба-грешка. Ето 3 конкретни неща от модула:
          </p>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {INSIGHTS.map((insight) => (
            <div
              key={insight.num}
              className="p-5 md:p-6 flex flex-col transition-all group"
              style={{ background: C.surface, border: `1px solid ${C.border}` }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 flex items-center justify-center text-sm font-bold shrink-0" style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, color: C.success }}>
                  {insight.num}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: C.success }}>Работен принцип</span>
              </div>

              <h3 className="text-base font-bold mb-2 tracking-tight" style={{ color: C.text }}>{insight.title}</h3>
              <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: C.textMuted }}>{insight.desc}</p>

              {/* Example box */}
              <div className="p-3 text-xs leading-relaxed italic" style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textDim }}>
                {insight.example}
              </div>
            </div>
          ))}
        </div>

        {/* Module stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { value: '4', label: 'Теми в безплатния модул', icon: 'ri-book-open-line' },
            { value: moduleReadingDuration('s01-m01', M1_LESSONS.map((lesson) => `l01-${String(lesson.id).padStart(2, '0')}`)).replace(/ четене$/, ''), label: 'Ориентир само за четене', icon: 'ri-time-line' },
            { value: '4', label: 'Практически извода', icon: 'ri-lightbulb-line' },
            { value: 'Безплатно', label: 'Завинаги твой', icon: 'ri-vip-crown-line' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="w-9 h-9 flex items-center justify-center mx-auto mb-2" style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}` }}>
                <i className={`${stat.icon} text-sm`} style={{ color: C.success }} />
              </div>
              <div className="text-lg md:text-xl font-bold mb-0.5" style={{ color: C.success }}>{stat.value}</div>
              <div className="text-[11px]" style={{ color: C.textDim }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ═══════ INLINE MODULE 1 ═══════ */}
        {!started ? (
          /* ── Start CTA ── */
          <div className="p-6 md:p-10 text-center" style={{ background: C.greenBg, border: `2px solid ${C.success}` }}>
            <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5" style={{ border: `2px solid ${C.success}` }}>
              <i className="ri-play-circle-line text-2xl" style={{ color: C.success }} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight" style={{ color: C.text }}>
              Готов ли си да започнеш{' '}
              <span style={{ color: C.success }}>прегледа на Модул 1?</span>
            </h3>
            <p className="text-sm max-w-lg mx-auto leading-relaxed mb-2" style={{ color: C.textMuted }}>
              Напълно безплатно. Без регистрация.
            </p>
            <p className="text-xs max-w-md mx-auto leading-relaxed mb-6" style={{ color: C.textDim }}>
              Разгледай четирите теми тук. Пълните уроци, самостоятелните задачи и проверките са в Академията.
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-4 text-sm font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
              style={{ background: C.success, color: '#0a0a0a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#33e06e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.success; }}
            >
              <i className="ri-rocket-line" style={{ fontSize: '16px' }} />
              Разгледай безплатния модул
            </button>
            <p className="text-xs mt-4" style={{ color: C.textDim }}>
              Без кредитна карта и без автоматично плащане. Това е кратък преглед на пълния модул.
            </p>
          </div>
        ) : (
          /* ── Inline lessons area ── */
          <div className="mb-6">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: C.success }}>
                  {completedLessons.length} от {M1_LESSONS.length} урока завършени
                </span>
                <span className="text-xs" style={{ color: C.textDim }}>
                  {allDone ? 'Модулът е завършен!' : `${Math.round((completedLessons.length / M1_LESSONS.length) * 100)}%`}
                </span>
              </div>
              <div className="w-full h-1.5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${(completedLessons.length / M1_LESSONS.length) * 100}%`,
                    background: C.success,
                  }}
                />
              </div>
            </div>

            {/* Lesson cards */}
            <div className="space-y-3 mb-10">
              {M1_LESSONS.map((lesson) => {
                const isDone = completedLessons.includes(lesson.id);
                const isExpanded = expandedLesson === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className="transition-all"
                    style={{
                      background: isExpanded ? C.surfaceHover : C.surface,
                      border: `1px solid ${isDone ? C.greenBorder : C.border}`,
                      opacity: isDone ? 0.7 : 1,
                    }}
                  >
                    {/* Header row — click to expand */}
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className="w-full text-left p-4 md:p-5 flex items-center gap-3 md:gap-4 cursor-pointer"
                    >
                      {/* Status icon */}
                      <div
                        className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shrink-0 transition-all"
                        style={{
                          background: isDone ? C.greenBg : C.bg,
                          border: `1px solid ${isDone ? C.greenBorder : C.border}`,
                          color: isDone ? C.success : C.textDim,
                        }}
                      >
                        {isDone ? (
                          <i className="ri-check-line text-sm" />
                        ) : (
                          <span className="text-xs font-bold">{lesson.id}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: C.textDim }}>{lesson.tag}</span>
                          {isDone && <span className="text-[10px] font-bold" style={{ color: C.success }}>ЗАВЪРШЕН</span>}
                        </div>
                        <h4 className="text-sm md:text-base font-bold truncate" style={{ color: isDone ? C.textDim : C.text }}>
                          {lesson.title}
                        </h4>
                      </div>

                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        {isExpanded ? (
                          <i className="ri-arrow-up-s-line text-base" style={{ color: C.textDim }} />
                        ) : (
                          <i className="ri-arrow-down-s-line text-base" style={{ color: C.textDim }} />
                        )}
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-4 md:px-5 pb-5">
                        <div className="mb-5">
                          <p className="text-[11px] uppercase tracking-[0.1em] mb-4 font-bold" style={{ color: C.textDim }}>
                            Какво ще научиш в този урок:
                          </p>
                          <ul className="space-y-2.5">
                            {lesson.points.map((pt, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: C.textMuted }}>
                                <span className="mt-0.5 shrink-0" style={{ color: C.success }}>▸</span>
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tip box */}
                        <div className="p-3 md:p-4 mb-5 text-xs md:text-sm leading-relaxed" style={{ background: C.greenBg, border: `1px solid ${C.greenBorder}`, color: C.textMuted }}>
                          <span className="font-bold mr-1" style={{ color: C.success }}>Ключов извод:</span>
                          {lesson.tip}
                        </div>

                        {/* Mark as read button */}
                        {!isDone ? (
                          <button
                            onClick={() => handleMarkRead(lesson.id)}
                            className="w-full py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                            style={{ background: C.success, color: '#0a0a0a' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#33e06e'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = C.success; }}
                          >
                            <i className="ri-check-double-line" style={{ fontSize: '14px' }} />
                            Прочетох — следващ урок
                          </button>
                        ) : (
                          <div className="text-center py-2 text-xs font-bold" style={{ color: C.success }}>
                            <i className="ri-check-double-line mr-1" /> Урокът е завършен
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ──── LOGIN GATE (after all 4 lessons) ──── */}
            {showLoginGate && (
              <div
                className="p-6 md:p-10 text-center animate-[fadeInUp_0.5s_ease-out]"
                style={{ background: C.greenBg, border: `2px solid ${C.success}` }}
              >
                <div className="w-16 h-16 flex items-center justify-center mx-auto mb-5" style={{ border: `2px solid ${C.success}` }}>
                  <i className="ri-check-line text-2xl" style={{ color: C.success }} />
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight" style={{ color: C.text }}>
                  Браво! Завърши{' '}
                  <span style={{ color: C.success }}>Модул 1</span>
                </h3>

                <p className="text-sm max-w-lg mx-auto leading-relaxed mb-2" style={{ color: C.textMuted }}>
                  Вече знаеш как да работиш с AI на професионално ниво.
                </p>
                <p className="text-xs max-w-md mx-auto leading-relaxed mb-6" style={{ color: C.textDim }}>
                  Остават още 10 модула: от изграждане на сайтове до системата за привличане на клиенти.
                  Избери как искаш да продължиш:
                </p>

                {/* 3 options */}
                <div className="space-y-3 max-w-sm mx-auto">
                  {/* Option 1: Google Login */}
                  <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="w-full py-3.5 text-sm font-bold transition-all whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    style={{ background: C.success, color: '#0a0a0a' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#33e06e'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.success; }}
                  >
                    {googleLoading ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <i className="ri-google-fill" style={{ fontSize: '18px' }} />
                        Продължи безплатно с Google
                      </>
                    )}
                  </button>

                  {/* Option 2: Email login */}
                  <Link
                    to="/login"
                    className="w-full py-3.5 text-sm font-medium transition-all whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: 'transparent', border: `1px solid ${C.success}`, color: C.success }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.greenBg; e.currentTarget.style.color = '#33e06e'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.success; }}
                  >
                    <i className="ri-mail-line" style={{ fontSize: '16px' }} />
                    Влез с имейл и парола
                  </Link>

                  {/* Option 3: View programs & pricing */}
                  <button
                    onClick={() => { const el = document.getElementById('akademiya-enrollment'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    className="w-full py-3.5 text-sm font-bold transition-all whitespace-nowrap inline-flex items-center justify-center gap-2 cursor-pointer"
                    style={{ background: C.accent, color: '#fff' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#ff5555'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                  >
                    <i className="ri-shopping-cart-line" style={{ fontSize: '16px' }} />
                    Виж програмите и цените
                  </button>
                </div>

                <p className="text-xs mt-5" style={{ color: C.textDim }}>
                  Без риск — 30 дни гаранция за връщане на парите.
                </p>
              </div>
            )}

            {/* In-progress message (if started but not done everything) */}
            {!showLoginGate && completedLessons.length > 0 && completedLessons.length < M1_LESSONS.length && (
              <div className="text-center py-6">
                <p className="text-xs" style={{ color: C.textDim }}>
                  Продължи напред — остават ти още {M1_LESSONS.length - completedLessons.length} урока до login gate
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
