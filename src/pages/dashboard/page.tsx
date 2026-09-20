import { useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import DashboardNav from './components/DashboardNav';
import { dispatchLevelUp } from '@/components/feature/LevelUpToast';

/* ─── Brand ─── */
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#141414',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  successDim: '#0a1f0a',
};

/* ─── Badges ─── */
const BADGES = [
  { id: 'first-lesson', name: 'Първи стъпки', icon: 'ri-footprint-line', desc: 'Завърши първи урок', condition: (c: number) => c >= 1 },
  { id: 'five-lessons', name: 'Начинаещ', icon: 'ri-seedling-line', desc: 'Завърши 5 урока', condition: (c: number) => c >= 5 },
  { id: 'ten-lessons', name: 'Колега', icon: 'ri-book-open-line', desc: 'Завърши 10 урока', condition: (c: number) => c >= 10 },
  { id: 'twenty-lessons', name: 'Ентусиаст', icon: 'ri-fire-line', desc: 'Завърши 20 урока', condition: (c: number) => c >= 20 },
  { id: 'first-quiz', name: 'Тестър', icon: 'ri-brain-line', desc: 'Направи първи тест', condition: (_c: number, q: number) => q >= 1 },
  { id: 'half-modules', name: 'На половината', icon: 'ri-trophy-line', desc: 'Завърши половината модули', condition: (_c: number, _q: number, m: number, total: number) => m >= total / 2 },
  { id: 'all-modules', name: 'Майстор', icon: 'ri-vip-crown-line', desc: 'Завърши всички модули', condition: (_c: number, _q: number, m: number, total: number) => m >= total },
];

/* ─── Helpers ─── */
function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const checkDate = new Date(today);
  for (const d of sorted) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    if (date.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function calcLevel(points: number): { level: number; next: number; progress: number } {
  const thresholds = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000];
  let level = 1;
  for (let i = 1; i < thresholds.length; i++) {
    if (points >= thresholds[i]) level = i + 1;
  }
  const currentThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || currentThreshold + 500;
  const progress = Math.round(((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
  return { level, next: nextThreshold, progress };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    completedLessons,
    completedModules,
    totalLessons,
    totalModules,
    totalPoints,
    totalQuizCount,
    homeworkCount,
    allDates,
    resumeTarget,
    isLoading,
    error,
    refetch,
  } = useLearningProgress(user?.id);

  const firstName = useMemo(() => {
    const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Колега';
    return name.split(' ')[0];
  }, [user]);

  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const streak = calcStreak(allDates);
  const levelInfo = calcLevel(totalPoints);

  // Level tracking — dispatch toast when level increases
  const previousLevelRef = useRef(levelInfo.level);

  useEffect(() => {
    if (previousLevelRef.current > 0 && levelInfo.level > previousLevelRef.current) {
      dispatchLevelUp(levelInfo.level, totalPoints);
    }
    previousLevelRef.current = levelInfo.level;
  }, [levelInfo.level, totalPoints]);

  const earnedBadges = BADGES.filter((b) => {
    if (b.id === 'half-modules' || b.id === 'all-modules') {
      return b.condition(completedLessons, totalQuizCount, completedModules, totalModules);
    }
    if (b.id === 'first-quiz') {
      return b.condition(completedLessons, totalQuizCount, completedModules, totalModules);
    }
    return b.condition(completedLessons, totalQuizCount, completedModules, totalModules);
  });

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: C.bg }}>
        <DashboardNav />
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <i className="ri-error-warning-line text-2xl" style={{ color: C.textDim }} />
          </div>
          <p className="text-base font-medium mb-2" style={{ color: C.textMuted }}>Не можахме да заредим прогреса ти</p>
          <p className="text-sm mb-6" style={{ color: C.textDim }}>Провери връзката си и опитай отново</p>
          <button
            onClick={refetch}
            className="px-6 py-3 text-sm font-semibold transition-colors whitespace-nowrap"
            style={{ background: C.accent, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            Опитай пак
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <DashboardNav />

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* ─── Header ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <span className="text-white text-base font-bold">{firstName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider" style={{ color: C.textDim }}>Добре дошъл отново</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: C.text }}>{firstName}</h1>
            </div>
          </div>
          {completedModules === totalModules && !isLoading && (
            <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium" style={{ background: '#0a1f0a', border: '1px solid #113311', color: C.success }}>
              <i className="ri-trophy-line" />
              Всичко завършено!
            </span>
          )}
        </div>

        {/* ─── Level + XP bar ─── */}
        <div className="p-5 md:p-6 mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          {isLoading ? (
            <div className="flex flex-col sm:flex-row items-center gap-6 animate-pulse">
              <div className="w-20 h-20" style={{ background: C.border, borderRadius: '50%' }} />
              <div className="flex-1 w-full space-y-3">
                <div className="w-48 h-5 rounded" style={{ background: C.border }} />
                <div className="w-full h-3 rounded" style={{ background: C.border }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Level indicator */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke={C.border} strokeWidth="5" />
                  <circle
                    cx="40" cy="40" r="32"
                    fill="none"
                    stroke={C.accent}
                    strokeWidth="5"
                    strokeLinecap="square"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - levelInfo.progress / 100)}
                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold" style={{ color: C.text }}>{levelInfo.level}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: C.textDim }}>Ниво</span>
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: C.text }}>
                      <i className="ri-fire-line" style={{ color: C.accent }} />
                      {streak} дни поред
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: C.text }}>
                      <i className="ri-star-line" style={{ color: C.accent }} />
                      {totalPoints} точки
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold hidden sm:flex" style={{ color: C.text }}>
                      <i className="ri-award-line" style={{ color: C.textDim }} />
                      {earnedBadges.length} баджа
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: C.textDim }}>{totalPoints}/{levelInfo.next} XP</span>
                </div>
                <div className="relative w-full overflow-hidden" style={{ height: '4px', background: C.border }}>
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-700"
                    style={{ width: `${levelInfo.progress}%`, background: C.accent }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Continue / Resume banner ─── */}
        {resumeTarget && !isLoading && (
          <div
            onClick={() => navigate(`/module/${resumeTarget.moduleId}?lesson=${resumeTarget.lessonIndex}`)}
            className="relative overflow-hidden p-5 mb-6 cursor-pointer group"
            style={{ background: C.accentDim, border: `1px solid ${C.accent}` }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: 'rgba(229,62,62,0.2)', border: `1px solid ${C.accent}` }}>
                  <i className="ri-play-fill text-lg" style={{ color: C.accent }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.accent }}>Продължи обучението</p>
                  <p className="text-sm font-bold" style={{ color: C.text }}>
                    {resumeTarget.sectionTitle} — {resumeTarget.lessonTitle}
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-2 px-4 py-2 text-sm font-bold whitespace-nowrap transition-all group-hover:translate-x-1" style={{ background: C.accent, color: '#fff' }}>
                Продължи
                <i className="ri-arrow-right-line" />
              </span>
            </div>
          </div>
        )}

        {/* ─── Stats row ─── */}
        {!isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Модули', value: `${completedModules}/${totalModules}`, icon: 'ri-stack-line', progress: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0 },
              { label: 'Уроци', value: `${completedLessons}/${totalLessons}`, icon: 'ri-book-open-line', progress: overallPercent },
              { label: 'Тестове', value: `${totalQuizCount}`, icon: 'ri-brain-line', progress: Math.min(100, totalQuizCount * 10) },
              { label: 'Домашни', value: `${homeworkCount}`, icon: 'ri-file-edit-line', progress: Math.min(100, homeworkCount * 20) },
            ].map((stat) => (
              <div key={stat.label} className="p-4 transition-all" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-9 h-9 flex items-center justify-center mb-3" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <i className={`${stat.icon} text-sm`} style={{ color: C.textDim }} />
                </div>
                <p className="text-xl font-bold tracking-tight" style={{ color: C.text }}>{stat.value}</p>
                <p className="text-xs mt-0.5 mb-3" style={{ color: C.textDim }}>{stat.label}</p>
                <div className="overflow-hidden" style={{ height: '2px', background: C.border }}>
                  <div className="h-full transition-all duration-700" style={{ width: `${stat.progress}%`, background: C.accent }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 animate-pulse" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="w-9 h-9 mb-3" style={{ background: C.border }} />
                <div className="w-12 h-6 mb-1.5" style={{ background: C.border }} />
                <div className="w-20 h-3" style={{ background: C.border }} />
              </div>
            ))}
          </div>
        )}

        {/* ─── Badges ─── */}
        {!isLoading && earnedBadges.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-3" style={{ color: C.textDim }}>Баджове</p>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                  title={badge.desc}
                >
                  <i className={`${badge.icon} text-sm`} style={{ color: C.accent }} />
                  <span className="text-xs font-medium" style={{ color: C.textMuted }}>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── CTA to Modules ─── */}
        {!isLoading && (
          <Link
            to="/kurs"
            className="block p-6 md:p-8 cursor-pointer group transition-all duration-200"
            style={{ background: C.surface, border: `2px solid ${C.border}` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.surfaceHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <i className="ri-stack-line text-lg" style={{ color: C.textDim }} />
                </div>
                <div>
                  <p className="text-base font-bold tracking-tight" style={{ color: C.text }}>Към всички модули</p>
                  <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>
                    {completedLessons}/{totalLessons} урока · {completedModules}/{totalModules} модула завършени
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all group-hover:translate-x-1" style={{ background: C.accent, color: '#fff' }}>
                Към модулите
                <i className="ri-arrow-right-line" />
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
