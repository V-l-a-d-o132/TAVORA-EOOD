import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardNav from '@/pages/dashboard/components/DashboardNav';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import { useLearningProgress, type ResumeTarget } from '@/hooks/useLearningProgress';
import { formatPrice, getTierById } from '@/config/pricing';
import SearchModules from './SearchModules';
import MessageAdmin from './MessageAdmin';

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
};

export default function LearningPlatform() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const {
    modProgressMap,
    moduleProgressMap,
    sectionProgressMap,
    completedLessons,
    completedModules,
    totalLessons,
    totalModules,
    totalPoints,
    overallPercent,
    hasFullAccess,
    unlockedModules,
    resumeTarget,
    isLoading,
    error,
    refetch,
  } = useLearningProgress(user?.id);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Колега';
  const firstName = displayName.split(' ')[0];

  const isModuleUnlocked = (mod: (typeof LEARNING_SECTIONS)[0]['modules'][0]) => {
    if (!mod.isLocked) return true;
    if (hasFullAccess) return true;
    if (unlockedModules.includes(mod.id)) return true;
    return false;
  };

  const handleUnlock = (tier: string = 'premium') => {
    navigate(`/kurs/checkout?tier=${tier}`);
  };

  const getSectionTier = (sectionId: string): string => {
    if (sectionId === 'koprinena-pateka') return 'koprinena-pateka';
    if (sectionId === 'perfektno-video') return 'perfektno-video';
    if (sectionId === 'marketing-basics') return 'marketing-basics';
    return 'koprinena-pateka';
  };

  const getSectionPrice = (sectionId: string): string => {
    const tierId =
      sectionId === 'koprinena-pateka' ? 'silkRoad' :
      sectionId === 'perfektno-video' ? 'perfectVideo' :
      'marketingBasics';
    return formatPrice(getTierById(tierId)?.price || 0);
  };

  const goToModule = (mod: (typeof LEARNING_SECTIONS)[0]['modules'][0]) => {
    if (!isModuleUnlocked(mod)) return;
    navigate(`/module/${mod.id}`);
  };

  const activeSectionData = LEARNING_SECTIONS.find((s) => s.id === activeSection);
  const hasLockedModules = activeSectionData?.modules.some((m) => !isModuleUnlocked(m)) ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 animate-spin" style={{ borderColor: C.border, borderTopColor: C.accent, borderRadius: '50%' }} />
          <p className="text-sm" style={{ color: C.textMuted }}>Зареждаме платформата...</p>
        </div>
      </div>
    );
  }

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

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">

        {/* ─── Welcome Header ─── */}
        <div className="mb-10 stagger-children">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]" style={{ background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent }}>
                Академия TAVORA
              </span>
              {completedLessons > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}>
                  {completedLessons} урока завършени
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <SearchModules />
              {user && <MessageAdmin userId={user.id} />}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight" style={{ color: C.text }}>
            Добре дошъл, {firstName}
          </h1>
          <p className="text-sm md:text-base max-w-lg" style={{ color: C.textMuted }}>
            Продължи обучението си. Всяка стъпка те доближава до бизнес, който работи с AI.
          </p>
        </div>

        {/* ─── RESUME BANNER ─── */}
        {resumeTarget && completedLessons > 0 && (
          <div
            onClick={() => navigate(`/module/${resumeTarget.moduleId}?lesson=${resumeTarget.lessonIndex}`)}
            className="relative overflow-hidden p-5 mb-8 cursor-pointer group"
            style={{ background: C.accentDim, border: `1px solid ${C.accent}` }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: 'rgba(229,62,62,0.2)', border: `1px solid ${C.accent}` }}>
                  <i className="ri-play-fill text-lg" style={{ color: C.accent }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.accent }}>Продължи откъдето спря</p>
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

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { label: 'Общ прогрес', value: `${overallPercent}%`, icon: 'ri-pie-chart-line' },
            { label: 'Завършени модули', value: `${completedModules}/${totalModules}`, icon: 'ri-stack-line' },
            { label: 'Уроци прочетени', value: `${completedLessons}/${totalLessons}`, icon: 'ri-book-open-line' },
            { label: 'Точки', value: `${totalPoints}`, icon: 'ri-star-line' },
          ].map((stat, idx) => (
            <div key={stat.label} className="p-4 md:p-5 animate-fade-in" style={{ animationDelay: `${idx * 0.06}s`, background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-9 h-9 flex items-center justify-center" style={{ background: idx === 0 ? C.accentDim : C.bg, border: `1px solid ${idx === 0 ? C.accent : C.border}` }}>
                  <i className={`${stat.icon} text-sm`} style={{ color: idx === 0 ? C.accent : C.textDim }} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold tracking-tight mb-1" style={{ color: idx === 0 ? C.accent : C.text }}>
                {stat.value}
              </p>
              <p className="text-xs" style={{ color: C.textDim }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ─── Overall Progress Bar ─── */}
        <div className="p-5 md:p-6 mb-10" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: C.text }}>Твоят общ прогрес</h2>
              <p className="text-xs mt-0.5" style={{ color: C.textDim }}>
                {completedModules} от {totalModules} модула · {completedLessons} от {totalLessons} урока
              </p>
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ color: C.accent }}>
              {overallPercent}%
            </span>
          </div>
          <div className="w-full overflow-hidden" style={{ height: '4px', background: C.border }}>
            <div
              className="h-full transition-all duration-1000 ease-out"
              style={{ width: `${overallPercent}%`, background: C.accent }}
            />
          </div>
        </div>

        {/* ─── Sections Grid ─── */}
        {!activeSection && (
          <>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.textDim }}>Секции</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-10 stagger-children">
              {LEARNING_SECTIONS.map((section) => {
                const secProg = sectionProgressMap[section.id] || { completed: 0, total: section.modules.length };
                const secPercent = secProg.total > 0 ? Math.round((secProg.completed / secProg.total) * 100) : 0;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="relative p-5 md:p-6 text-left transition-all duration-200 group cursor-pointer"
                    style={{ background: C.surface, border: `1px solid ${C.border}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.surfaceHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-11 h-11 flex items-center justify-center" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                        <i className={`${section.icon} text-lg`} style={{ color: C.textDim }} />
                      </div>
                      <span className="text-xs font-medium" style={{ color: C.textDim }}>
                        {section.totalModules} модула
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-1 tracking-tight" style={{ color: C.text }}>
                      {section.title}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: C.textMuted }}>{section.subtitle}</p>
                    <p className="text-xs leading-relaxed mb-5" style={{ color: C.textDim }}>
                      {section.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs" style={{ color: C.textDim }}>{secProg.completed}/{secProg.total} модула</span>
                        <span className="text-xs font-bold" style={{ color: C.textMuted }}>{secPercent}%</span>
                      </div>
                      <div className="w-full overflow-hidden" style={{ height: '2px', background: C.border }}>
                        <div
                          className="h-full transition-all duration-700"
                          style={{ width: `${secPercent}%`, background: C.accent }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs" style={{ color: C.textDim }}>
                        <span className="flex items-center gap-1">
                          <i className="ri-book-open-line" />
                          {section.totalLessons} урока
                        </span>
                      </div>
                      <div
                        className="w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        style={{ background: C.accent, color: '#fff' }}
                      >
                        <i className="ri-arrow-right-line text-sm" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ─── Start Banner (only when no progress) ─── */}
            {completedLessons === 0 && (
              <div
                className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 cursor-pointer"
                style={{ background: C.accentDim, border: `1px solid ${C.accent}` }}
                onClick={() => navigate('/module/s01-m01')}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: 'rgba(229,62,62,0.2)', border: `1px solid ${C.accent}` }}>
                    <i className="ri-book-open-line text-xl" style={{ color: C.accent }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: C.text }}>Започни от първия модул</p>
                    <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>Пътят на коприната — Модул 01: AI Advantage</p>
                  </div>
                </div>
                <button
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold whitespace-nowrap"
                  style={{ background: C.accent, color: '#fff' }}
                >
                  Започни сега
                  <i className="ri-arrow-right-line" />
                </button>
              </div>
            )}
          </>
        )}

        {/* ─── Active Section Modules ─── */}
        {activeSectionData && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 px-4 py-2 text-sm transition-colors whitespace-nowrap"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                <i className="ri-arrow-left-line" />
                Всички раздели
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 flex items-center justify-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <i className={`${activeSectionData.icon} text-2xl`} style={{ color: C.textDim }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: C.text }}>{activeSectionData.title}</h2>
                <p className="text-sm" style={{ color: C.textMuted }}>{activeSectionData.subtitle}</p>
              </div>
            </div>

            {/* Section progress */}
            <div className="p-5 mb-6" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm" style={{ color: C.textMuted }}>Прогрес на раздела</span>
                <span className="text-sm font-bold" style={{ color: C.text }}>
                  {(sectionProgressMap[activeSectionData.id]?.completed || 0)}/{activeSectionData.totalModules} модула
                </span>
              </div>
              <div className="w-full overflow-hidden" style={{ height: '3px', background: C.border }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${activeSectionData.totalModules > 0
                      ? Math.round(((sectionProgressMap[activeSectionData.id]?.completed || 0) / activeSectionData.totalModules) * 100)
                      : 0}%`,
                    background: C.accent,
                  }}
                />
              </div>
            </div>

            {/* Locked banner */}
            {hasLockedModules && !hasFullAccess && activeSectionData && (
              <div className="p-5 mb-6" style={{ background: C.accentDim, border: `2px solid ${C.accent}` }}>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ border: `1px solid ${C.accent}` }}>
                    <i className="ri-lock-unlock-line" style={{ color: C.accent, fontSize: '18px' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: C.text }}>ОГРАНИЧЕН ДОСТЪП</p>
                    <p className="text-xs mt-1" style={{ color: C.textMuted }}>
                      {activeSectionData.id === 'koprinena-pateka' && `Модул 01 е безплатен. За всички останали — еднократно плащане ${getSectionPrice('koprinena-pateka')}.`}
                      {activeSectionData.id === 'perfektno-video' && `Пълен достъп до Перфектното Видео — 15 модула за еднократно плащане ${getSectionPrice('perfektno-video')}.`}
                      {activeSectionData.id === 'marketing-basics' && `Пълен достъп до Marketing Basics — 20 модула за еднократно плащане ${getSectionPrice('marketing-basics')}.`}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleUnlock(getSectionTier(activeSectionData.id))}
                    className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap flex-1"
                    style={{ background: C.accent, color: '#fff' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                  >
                    ОТКЛЮЧИ ЗА {getSectionPrice(activeSectionData.id)}{' '}
                    <i className="ri-arrow-right-line" style={{ fontSize: '13px' }} />
                  </button>
                  {activeSectionData.id !== 'premium-all' && (
                    <button
                      onClick={() => handleUnlock('premium-all')}
                      className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap"
                      style={{ border: `1px solid ${C.accent}`, color: C.accent, background: 'transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = C.accentDim; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      Пълен достъп ({formatPrice(249)})
                    </button>
                  )}
                </div>
                <p className="text-xs mt-3" style={{ color: C.textDim }}>Еднократно плащане · Доживотен достъп · 30 дни гаранция</p>
              </div>
            )}

            {/* Full access badge */}
            {hasFullAccess && (
              <div className="p-4 mb-6 flex items-center gap-3" style={{ background: '#0a1f0a', border: `1px solid #113311` }}>
                <div className="w-9 h-9 flex items-center justify-center" style={{ background: C.success, color: '#fff' }}>
                  <i className="ri-vip-crown-line text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>Пълен достъп активиран</p>
                  <p className="text-xs" style={{ color: C.textDim }}>Всички модули са отключени</p>
                </div>
              </div>
            )}

            {/* Modules list */}
            <div className="space-y-2">
              {activeSectionData.modules.map((mod) => {
                const modProg = moduleProgressMap[mod.id] || { completed: 0, total: mod.lessons.length };
                const modPercent = modProg.total > 0 ? Math.round((modProg.completed / modProg.total) * 100) : 0;
                const isDone = modProg.completed >= modProg.total && modProg.total > 0;
                const unlocked = isModuleUnlocked(mod);
                const hasFreeTag = mod.tag === 'FREE';

                return (
                  <div
                    key={mod.id}
                    onClick={() => goToModule(mod)}
                    className="p-4 md:p-5 transition-all duration-200 group"
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => { if (unlocked) { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.surfaceHover; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div
                          className="w-11 h-11 flex items-center justify-center shrink-0 text-sm font-bold"
                          style={{
                            background: isDone ? C.success : !unlocked ? C.border : modProg.completed > 0 ? C.accentDim : C.bg,
                            border: `1px solid ${isDone ? C.success : !unlocked ? C.borderHover : modProg.completed > 0 ? C.accent : C.border}`,
                            color: isDone ? '#fff' : !unlocked ? C.textDim : C.text,
                          }}
                        >
                          {isDone ? (
                            <i className="ri-check-line" />
                          ) : !unlocked ? (
                            <i className="ri-lock-line" />
                          ) : (
                            <span>{mod.number}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold leading-tight truncate" style={{ color: !unlocked ? C.textDim : C.text }}>
                              {mod.title}
                            </h3>
                            {!unlocked && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ background: C.accentDim, border: `1px solid ${C.accent}`, color: C.accent }}>
                                <i className="ri-lock-line" />
                                LOCKED
                              </span>
                            )}
                            {hasFreeTag && unlocked && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ background: '#0a1f0a', border: '1px solid #113311', color: C.success }}>
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: !unlocked ? C.textDim : C.textMuted }}>
                            {mod.subtitle}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: C.textDim }}>
                            <span className="flex items-center gap-1">
                              <i className="ri-time-line" />
                              {mod.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="ri-book-open-line" />
                              {mod.lessons.length} урока
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="ri-questionnaire-line" />
                              {mod.lessons.filter((l) => l.hasQuiz).length} теста
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {unlocked ? (
                          <div
                            className="w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            style={{ background: C.accent, color: '#fff' }}
                          >
                            <i className="ri-arrow-right-line text-sm" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 flex items-center justify-center" style={{ background: C.border }}>
                            <i className="ri-lock-line text-sm" style={{ color: C.textDim }} />
                          </div>
                        )}
                        <span className="text-xs font-medium" style={{ color: C.textDim }}>
                          {modProg.completed}/{modProg.total}
                        </span>
                      </div>
                    </div>

                    {/* Module progress bar */}
                    <div className="mt-4 pl-[60px]">
                      <div className="w-full overflow-hidden" style={{ height: '2px', background: C.border }}>
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${modPercent}%`,
                            background: isDone ? C.success : !unlocked ? C.borderHover : C.accent,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}