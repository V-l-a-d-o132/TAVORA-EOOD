import { resumeTargetRoute } from '@/lib/learning-resume';
import { LEARNING_BADGES, learningLevel, learningStreak } from '@/lib/learning-milestones';
import { useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import DashboardNav from './components/DashboardNav';
import { dispatchLevelUp } from '@/components/feature/LevelUpToast';

const CARD = 'rounded-2xl border border-white/10 bg-[#111111]';
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    completedLessons, completedModules, totalLessons, totalModules,
    totalPoints, totalQuizCount, totalPracticeCount, allDates,
    resumeTarget, isLoading, error, refetch,
  } = useLearningProgress(user?.id);

  const firstName = useMemo(() => {
    const name = user?.user_metadata?.full_name;
    return (typeof name === 'string' && name.trim() ? name.trim() : user?.email?.split('@')[0] || 'Колега').split(/\s+/)[0];
  }, [user]);

  const overallPercent = totalLessons > 0 ? Math.round(100 * completedLessons / totalLessons) : 0;
  const streak = learningStreak(allDates);
  const levelInfo = learningLevel(totalPoints);
  const earnedBadges = LEARNING_BADGES.filter(badge =>
    badge.condition(completedLessons, totalQuizCount, completedModules, totalModules));
  const nextBadge = LEARNING_BADGES.find(badge => !earnedBadges.includes(badge));

  // Loading existing XP or switching accounts is not a new level-up.
  const previousLevelRef = useRef<{ userId: string; level: number } | null>(null);
  useEffect(() => {
    if (isLoading || error || !user) return;
    const previous = previousLevelRef.current;
    if (previous?.userId === user.id && levelInfo.level > previous.level) {
      dispatchLevelUp(levelInfo.level, totalPoints);
    }
    previousLevelRef.current = { userId: user.id, level: levelInfo.level };
  }, [levelInfo.level, totalPoints, isLoading, error, user]);

  if (error) {
    return <div className="min-h-screen bg-[#0a0a0a] text-white">
      <DashboardNav />
      <main className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center">
        <div className={CARD + ' mb-4 grid h-16 w-16 place-items-center text-zinc-400'}>
          <i className="ri-error-warning-line text-2xl" aria-hidden />
        </div>
        <h1 className="mb-2 text-lg font-semibold">Не можахме да заредим напредъка ти</h1>
        <p className="mb-6 text-sm text-zinc-400">Провери връзката си и опитай отново.</p>
        <button type="button" onClick={refetch} className={FOCUS + ' rounded-xl bg-[#e53e3e] px-6 py-3 text-sm font-semibold transition-colors hover:bg-[#ff5555]'}>
          Опитай пак
        </button>
      </main>
    </div>;
  }

  const stats = [
    { label: 'Модули', value: completedModules, total: totalModules, icon: 'ri-stack-line', caption: 'завършени', progress: totalModules > 0 ? Math.round(100 * completedModules / totalModules) : 0 },
    { label: 'Уроци', value: completedLessons, total: totalLessons, icon: 'ri-book-open-line', caption: 'завършени', progress: overallPercent },
    { label: 'Решени проверки', value: totalQuizCount, total: null, icon: 'ri-checkbox-circle-line', caption: 'въпроси и изпити', progress: null },
    { label: 'Практически задачи', value: totalPracticeCount, total: null, icon: 'ri-puzzle-line', caption: 'успешно решени', progress: null },
  ];

  return <div className="min-h-screen bg-[#0a0a0a] text-white">
    <DashboardNav />
    <main className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10" aria-busy={isLoading}>
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-400/20 bg-red-500/10 text-base font-bold text-red-300" aria-hidden>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-zinc-400">Твоят напредък</p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight md:text-3xl">{firstName}</h1>
          </div>
        </div>
        {totalModules > 0 && completedModules === totalModules && !isLoading && (
          <span className="flex items-center gap-2 self-start rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm text-green-300">
            <i className="ri-trophy-line" aria-hidden />Всички модули са завършени
          </span>
        )}
      </div>

      <section aria-label="Ниво и точки" className={CARD + ' mb-4 p-5 md:p-6'}>
        {isLoading ? (
          <div className="flex items-center gap-5 motion-safe:animate-pulse" role="status" aria-label="Зареждане на напредъка">
            <div className="h-20 w-20 shrink-0 rounded-full bg-white/5" aria-hidden />
            <div className="w-full space-y-4" aria-hidden>
              <div className="h-4 w-2/3 rounded bg-white/5" /><div className="h-2 w-full rounded bg-white/5" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-4 sm:block">
              <div className="relative h-20 w-20 shrink-0" aria-label={'Ниво ' + levelInfo.level}>
                <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80" aria-hidden>
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#27272a" strokeWidth="5" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e53e3e" strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - levelInfo.progress / 100)} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold tabular-nums">{levelInfo.level}</span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400">Ниво</span>
                </div>
              </div>
              <p className="text-sm text-zinc-400 sm:hidden">Точки от учебните стъпки.</p>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 font-semibold tabular-nums"><i className="ri-star-line text-red-400" aria-hidden />{totalPoints} XP</span>
                <span className="flex items-center gap-1.5 text-zinc-300"><i className="ri-fire-line text-red-400" aria-hidden />{streak} {streak === 1 ? 'ден' : 'дни'} поред</span>
                <span className="flex items-center gap-1.5 text-zinc-300"><i className="ri-award-line text-zinc-400" aria-hidden />{earnedBadges.length} {earnedBadges.length === 1 ? 'значка' : 'значки'}</span>
              </div>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
                <span className="text-zinc-400">{levelInfo.maxed ? 'Достигна ниво 10' : 'До ниво ' + (levelInfo.level + 1)}</span>
                <span className="font-medium tabular-nums text-zinc-300">{levelInfo.maxed ? 'Максимално ниво' : levelInfo.current + ' / ' + levelInfo.required + ' XP'}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-label="XP в текущото ниво"
                aria-valuemin={0} aria-valuemax={levelInfo.maxed ? 100 : levelInfo.required} aria-valuenow={levelInfo.maxed ? 100 : levelInfo.current}
                aria-valuetext={levelInfo.maxed ? 'Максимално ниво' : 'Остават ' + levelInfo.remaining + ' XP до ниво ' + (levelInfo.level + 1)}>
                <div className="h-full rounded-full bg-[#e53e3e] transition-[width] duration-700 motion-reduce:transition-none" style={{ width: levelInfo.progress + '%' }} />
              </div>
              {!levelInfo.maxed && <p className="mt-2 text-xs text-zinc-400">Остават {levelInfo.remaining} XP до следващото ниво.</p>}
            </div>
          </div>
        )}
      </section>

      <details className="mb-6 text-sm text-zinc-400">
        <summary className={FOCUS + ' min-h-11 cursor-pointer rounded-lg py-3 text-zinc-300 hover:text-white'}>Как се смятат точките и напредъкът?</summary>
        <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed sm:text-sm">
          <p>XP идват от завършените стъпки в актуалните версии на трите курса. Повтарянето на същата стъпка не носи допълнителни XP. Лентата показва точките в текущото ниво; процентът на теста е отделен резултат.</p>
          <p>„Решени проверки“ брои вярно решените въпроси и преминатите изпити. Един изпит се брои като една проверка. „Практически задачи“ брои успешно решените казуси, подреждания и други проверявани задачи. Всяка задължителна задача се брои веднъж, независимо от броя опити.</p>
          <p>Поредицата от дни отчита прочетена стъпка или предаден отговор по българско време. Няколко действия в един ден се броят за един ден. Поредица, стигнала до вчера, остава активна днес; само отваряне на урок не добавя ден.</p>
          <p>„Продължи“ отваря последно посетения достъпен урок. Вътре се възстановяват запазената стъпка и отговори. За друго устройство са нужни същият профил и успешна синхронизация.</p>
          <p>Новата версия на урока има собствен напредък. Предишните резултати остават в историята и дните с реална работа се запазват. Значките показват учебни етапи в текущите версии.</p>
        </div>
      </details>

      {resumeTarget && !isLoading && (
        <Link to={resumeTargetRoute(resumeTarget)} aria-label={'Продължи: ' + resumeTarget.lessonTitle}
          className={FOCUS + ' group mb-6 flex flex-col gap-4 rounded-2xl border border-red-400/30 bg-gradient-to-br from-[#201313] to-[#141111] p-5 transition-colors hover:border-red-400/60 sm:flex-row sm:items-center sm:justify-between md:p-6'}>
          <div className="flex min-w-0 items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-400"><i className="ri-play-fill text-lg" aria-hidden /></div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-medium text-red-300">Продължи откъдето спря</p>
              <h2 className="break-words text-base font-semibold leading-snug">{resumeTarget.lessonTitle}</h2>
              <p className="mt-1 text-xs text-zinc-400">{resumeTarget.sectionTitle}</p>
            </div>
          </div>
          <span className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e53e3e] px-5 py-2.5 text-sm font-semibold group-hover:bg-[#ff5555]">
            Продължи<i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden />
          </span>
        </Link>
      )}

      <section aria-label="Учебни резултати" className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {isLoading ? [1, 2, 3, 4].map(index => (
          <div key={index} className={CARD + ' space-y-3 p-4 motion-safe:animate-pulse'} aria-hidden>
            <div className="h-9 w-9 rounded-lg bg-white/5" /><div className="h-6 w-16 rounded bg-white/5" /><div className="h-3 w-20 rounded bg-white/5" />
          </div>
        )) : stats.map(stat => (
          <div key={stat.label} className={CARD + ' flex flex-col p-4'}>
            <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-zinc-400"><i className={stat.icon} aria-hidden /></div>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{stat.value}{stat.total !== null && <span className="text-base font-normal text-zinc-400"> / {stat.total}</span>}</p>
            <h2 className="mt-1 text-sm font-medium leading-snug text-zinc-200">{stat.label}</h2>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-zinc-400">{stat.caption}</p>
            {stat.progress !== null && <div className="mt-auto h-1 overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-label={'Завършени ' + stat.label.toLowerCase()} aria-valuemin={0} aria-valuemax={stat.total!} aria-valuenow={stat.value}>
              <div className="h-full rounded-full bg-[#e53e3e]" style={{ width: stat.progress + '%' }} />
            </div>}
          </div>
        ))}
      </section>

      {!isLoading && (
        <section aria-label="Значки" className={CARD + ' mb-6 p-4 md:p-5'}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">Твоите значки</h2>
            <p className="text-xs text-zinc-400">{earnedBadges.length} от {LEARNING_BADGES.length}</p>
          </div>
          {earnedBadges.length > 0 ? <div className="mt-3 flex flex-wrap gap-2">
            {earnedBadges.map(badge => <span key={badge.id} title={badge.desc} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300">
              <i className={badge.icon + ' text-red-400'} aria-hidden />{badge.name}
            </span>)}
          </div> : <p className="mt-2 text-xs text-zinc-400">Още няма спечелени значки.</p>}
          {nextBadge && <p className="mt-3 text-xs text-zinc-400">Следваща: <span className="text-zinc-300">{nextBadge.name}</span> · {nextBadge.desc}.</p>}
        </section>
      )}

      {!isLoading && (
        <Link to="/kurs" className={FOCUS + ' ' + CARD + ' group flex flex-col gap-4 p-5 transition-colors hover:border-white/25 hover:bg-[#141414] sm:flex-row sm:items-center sm:justify-between md:p-6'}>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5 text-zinc-400"><i className="ri-stack-line text-lg" aria-hidden /></div>
            <div>
              <h2 className="text-base font-semibold">Към всички модули</h2>
              <p className="mt-1 text-xs text-zinc-400">Избери курс, модул или конкретен урок.</p>
            </div>
          </div>
          <span className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium group-hover:bg-white/5">
            Отвори модулите<i className="ri-arrow-right-line" aria-hidden />
          </span>
        </Link>
      )}
    </main>
  </div>;
}
