import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { CHECKLIST_TOPICS, type ChecklistTopic } from '@/mocks/checklist-data';

interface ChecklistViewerProps {
  moduleId: string;
  userId?: string;
}

export default function ChecklistViewer({ moduleId, userId }: ChecklistViewerProps) {
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loaded, setLoaded] = useState(false);
  const [celebration, setCelebration] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalItems = 100;
  const completedCount = completedItems.size;
  const progressPercent = Math.round((completedCount / totalItems) * 100);
  const completedTopics = CHECKLIST_TOPICS.filter(t =>
    t.items.every(i => completedItems.has(i.globalIndex))
  ).length;

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!userId) { setLoaded(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('checklist_progress')
          .select('item_id')
          .eq('user_id', userId)
          .eq('module_id', moduleId)
          .eq('completed', true);
        if (cancelled || !data) return;
        const ids = new Set<number>();
        data.forEach((r: { item_id: number }) => { if (r.item_id) ids.add(r.item_id); });
        setCompletedItems(ids);
      } catch { /* ignore */ }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [userId, moduleId]);

  // Debounced save to Supabase
  const persistToSupabase = useCallback((itemId: number, completed: boolean) => {
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await supabase.from('checklist_progress').upsert({
          user_id: userId,
          module_id: moduleId,
          topic_id: Math.ceil(itemId / 10),
          item_id: itemId,
          completed,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id,item_id' });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('idle');
      }
    }, 400);
  }, [userId, moduleId]);

  const toggleItem = useCallback((itemId: number) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        persistToSupabase(itemId, false);
        return next;
      } else {
        next.add(itemId);
        persistToSupabase(itemId, true);
        // Check if all 100 completed
        if (next.size === totalItems) {
          setCelebration(true);
          setTimeout(() => setCelebration(false), 5000);
        }
        return next;
      }
    });
  }, [persistToSupabase]);

  const resetAll = useCallback(() => {
    if (!userId) return;
    setCompletedItems(new Set());
    setSaveStatus('saving');
    (async () => {
      try {
        await supabase.from('checklist_progress')
          .delete()
          .eq('user_id', userId)
          .eq('module_id', moduleId);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('idle');
      }
    })();
  }, [userId, moduleId]);

  const toggleTopic = useCallback((topicId: number) => {
    setExpandedTopic(prev => prev === topicId ? null : topicId);
  }, []);

  if (!loaded) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-background-300" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />
        </div>
        <p className="text-base text-foreground-500">Зареждаме прогреса...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Celebration overlay */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-background-50/80" />
          <div className="relative text-center animate-bounce">
            <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-2xl">
              <i className="ri-trophy-line text-white text-5xl" />
            </div>
            <p className="mt-6 text-3xl font-bold text-foreground-900">100/100</p>
            <p className="text-lg text-foreground-600 mt-2">Ти си машина! Чеклистът е завършен!</p>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground-900">Промптиране и работа с AI</h2>
            <p className="text-sm text-foreground-500 mt-1">10 теми · 100 точки · Чеклист 01</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saving' && (
              <span className="text-xs text-foreground-400 flex items-center gap-1.5">
                <i className="ri-loader-4-line animate-spin" />Запис...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-primary-600 flex items-center gap-1.5 font-medium">
                <i className="ri-check-line" />Запазено
              </span>
            )}
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-background-100 border border-background-300 rounded-xl text-sm font-medium text-foreground-500 hover:bg-background-200 hover:text-foreground-700 transition-all whitespace-nowrap"
            >
              <i className="ri-restart-line" />
              Нулирай
            </button>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-background-100 border border-background-200 rounded-2xl p-6">
          <div className="grid grid-cols-3 gap-6 mb-5">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-500">{completedCount}</p>
              <p className="text-xs text-foreground-500 mt-1.5 font-medium uppercase tracking-wider">Завършени</p>
              <p className="text-xs text-foreground-400">от 100</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground-900">{progressPercent}%</p>
              <p className="text-xs text-foreground-500 mt-1.5 font-medium uppercase tracking-wider">Прогрес</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent-500">{completedTopics}</p>
              <p className="text-xs text-foreground-500 mt-1.5 font-medium uppercase tracking-wider">Теми</p>
              <p className="text-xs text-foreground-400">от 10</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="relative w-full h-3 bg-background-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {CHECKLIST_TOPICS.map((topic) => {
          const topicCompleted = topic.items.filter(i => completedItems.has(i.globalIndex)).length;
          const topicPercent = Math.round((topicCompleted / 10) * 100);
          const isExpanded = expandedTopic === topic.id;
          const isFullyDone = topicCompleted === 10;

          return (
            <div
              key={topic.id}
              className="bg-background-50 border border-background-200 rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* Topic Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left group"
              >
                {/* Number badge */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isFullyDone
                      ? 'bg-primary-500 text-white'
                      : topicCompleted > 0
                      ? 'bg-primary-100 text-primary-600 border-2 border-primary-300'
                      : 'bg-background-100 text-foreground-400 border-2 border-background-300'
                  }`}
                  style={!isFullyDone && topicCompleted === 0 ? {} : isFullyDone ? {} : { borderColor: topic.color + '40' }}
                >
                  {isFullyDone ? (
                    <i className="ri-check-line text-xl" />
                  ) : (
                    <span className="text-sm font-bold">{topic.number}</span>
                  )}
                </div>

                {/* Title & progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: topic.color + '18' }}>
                      <i className={`${topic.icon} text-sm`} style={{ color: topic.color }} />
                    </div>
                    <h3 className="text-base font-semibold text-foreground-900">{topic.title}</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-background-200 rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${topicPercent}%`, backgroundColor: topic.color }}
                      />
                    </div>
                    <span className="text-xs text-foreground-400 font-medium whitespace-nowrap">
                      {topicCompleted}/10
                    </span>
                  </div>
                </div>

                {/* Expand icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isExpanded ? 'bg-background-200 rotate-180' : 'bg-background-100'
                }`}>
                  <i className="ri-arrow-down-s-line text-foreground-500 text-lg" />
                </div>
              </button>

              {/* Expanded items */}
              <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${
                  isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-5 pt-1 space-y-1">
                  {topic.items.map((item) => {
                    const isDone = completedItems.has(item.globalIndex);
                    return (
                      <button
                        key={item.globalIndex}
                        onClick={() => toggleItem(item.globalIndex)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                          isDone
                            ? 'bg-primary-50 border border-primary-200'
                            : 'bg-background-50 border border-transparent hover:bg-background-100 hover:border-background-300'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isDone
                              ? 'bg-primary-500 text-white scale-100'
                              : 'bg-background-200 text-transparent scale-90 group-hover:scale-100 group-hover:bg-background-300'
                          }`}
                          style={!isDone ? {} : {}}
                        >
                          <i className={`ri-check-line text-sm transition-all ${isDone ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold w-6 shrink-0 ${isDone ? 'text-primary-400' : 'text-foreground-300'}`}>
                              {String(item.localIndex).padStart(2, '0')}
                            </span>
                            <span className={`text-sm font-semibold transition-colors ${isDone ? 'text-primary-700 line-through decoration-primary-300' : 'text-foreground-800'}`}>
                              {item.title}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ml-8 transition-colors ${isDone ? 'text-foreground-300 line-through decoration-foreground-200' : 'text-foreground-400'}`}>
                            {item.description}
                          </p>
                        </div>

                        {/* Pulse dot for unchecked */}
                        {!isDone && (
                          <div className="w-2 h-2 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: topic.color }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-foreground-400">
          Прогресът се пази автоматично · Чеклист 01 от 10 · 2026
        </p>
      </div>
    </div>
  );
}