import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

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
    num: '1',
    title: 'Prompt Engineering на професионално ниво',
    desc: 'Научи точните prompt шаблони, с които AI инструментите дават резултати като от професионален копирайтър, SEO специалист и маркетинг стратег — не като от чатбот.',
    example: '"Действай като senior SEO специалист с 10 години опит в e-commerce. Анализирай моята ниша [X] и ми дай 5 конкретни keyword стратегии, които моите конкуренти пропускат. За всяка стратегия посочи: обем на търсене, ниво на конкуренция и конкретен план за имплементация."',
  },
  {
    num: '2',
    title: 'Мулти-моделна стратегия',
    desc: 'ChatGPT, Claude и Gemini не са взаимнозаменяеми. Всеки има силни страни. Ще научиш кой инструмент за какво да ползваш — и как да ги комбинираш за максимален резултат.',
    example: 'ChatGPT → креативни текстове и brainstorming. Claude → дълги документи и анализи. Gemini → SEO съдържание с Google интеграция. Това не е теория — точни workflows за всеки.',
  },
  {
    num: '3',
    title: 'Всеки ден с AI — работен процес',
    desc: 'Не става дума да "използваш ChatGPT понякога". Става дума за цялостен работен процес, в който AI е твоят асистент за всичко — от идеи до публикуване.',
    example: 'Сутрин: AI ти генерира дневен план. Обяд: AI редактира съдържанието ти. Вечер: AI анализира резултатите. Това е реалният workflow на хора, които печелят от AI.',
  },
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
    id: 1,
    title: 'Как AI мисли (и как да го накараш да мисли за теб)',
    tag: 'Урок 1',
    points: [
      'Разбери как работят големите езикови модели — не магия, а математика',
      'Научи "context window" и защо това е най-важният ти инструмент',
      'Принципът "Garbage In, Garbage Out" — качеството на prompt-а определя всичко',
      '3-те нива на AI комуникация: Basic → Advanced → Master',
    ],
    tip: 'Ключов извод: AI не "знае" нищо. Той предвижда следващата дума. Когато разбереш това, започваш да пишеш prompts, които реално работят.',
  },
  {
    id: 2,
    title: 'Prompt шаблони, които печелят пари',
    tag: 'Урок 2',
    points: [
      'Шаблон "Expert Persona" — накарай AI да действа като специалист с 10г опит',
      'Шаблон "Chain of Thought" — за сложни анализи и стратегии',
      'Шаблон "Few-Shot" — дай 2-3 примера и AI ще генерира в същия стил',
      'Шаблон "Reverse Engineering" — анализирай конкуренти и намери техните слаби места',
    ],
    tip: 'Ключов извод: Разликата между "напиши ми пост за Instagram" и професионален prompt е 10x в качеството. Ще имаш точните шаблони.',
  },
  {
    id: 3,
    title: 'Кой AI инструмент за какво — точната матрица',
    tag: 'Урок 3',
    points: [
      'ChatGPT (GPT-4o): Най-добър за креативни текстове, brainstorming, customer personas',
      'Claude (Sonnet/Opus): Най-добър за дълги документи, анализи, техническо писане',
      'Gemini (Google): Най-добър за SEO съдържание, Google интеграции, фактологични проверки',
      'Perplexity: За research и competitor analysis с реални източници',
    ],
    tip: 'Ключов извод: Никой не печели пари само с един AI инструмент. Комбинацията е ключът. Ще имаш точната матрица кой за какво.',
  },
  {
    id: 4,
    title: 'Твоят AI дневен workflow',
    tag: 'Урок 4',
    points: [
      'Сутрешен ритуал (15 мин): AI ти генерира дневен план и приоритети',
      'Създаване (60-90 мин): AI асистира при писане, дизайн, код — ти командваш',
      'Редакция (30 мин): AI проверява граматика, SEO, четливост',
      'Анализ (15 мин): AI обобщава деня и предлага подобрения за утре',
    ],
    tip: 'Ключов извод: Това не е теория. Това е точният ежедневен процес на хора, които работят професионално с AI. Ще го имаш стъпка по стъпка.',
  },
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
                <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: C.success }}>Ключов insight</span>
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
            { value: '4', label: 'Интерактивни урока', icon: 'ri-book-open-line' },
            { value: '~15 мин', label: 'Време за четене', icon: 'ri-time-line' },
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
              <span style={{ color: C.success }}>Модул 1?</span>
            </h3>
            <p className="text-sm max-w-lg mx-auto leading-relaxed mb-2" style={{ color: C.textMuted }}>
              Напълно безплатно. Без регистрация.
            </p>
            <p className="text-xs max-w-md mx-auto leading-relaxed mb-6" style={{ color: C.textDim }}>
              Премини през 4-те урока директно тук, на страницата.
              Всеки урок отнема ~3-4 минути. След последния — реши дали искаш да продължиш.
            </p>
            <button
              onClick={handleStart}
              className="px-10 py-4 text-sm font-bold transition-all whitespace-nowrap inline-flex items-center gap-2 cursor-pointer"
              style={{ background: C.success, color: '#0a0a0a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#33e06e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.success; }}
            >
              <i className="ri-rocket-line" style={{ fontSize: '16px' }} />
              Започни Модул 1 безплатно
            </button>
            <p className="text-xs mt-4" style={{ color: C.textDim }}>
              Без кредитна карта и без автоматично плащане. 4 урока тук на страницата.
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