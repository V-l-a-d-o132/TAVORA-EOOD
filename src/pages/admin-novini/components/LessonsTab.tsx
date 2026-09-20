import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import type { LessonSlide, LessonData } from '@/lib/academy-content';

interface LessonRecord {
  id: string;
  module_id: string;
  lesson_id: string;
  title: string;
  subtitle: string;
  duration: string;
  slides: LessonSlide[];
  created_at: string;
}

type SlideType = 'title' | 'content' | 'comparison' | 'framework' | 'interactive' | 'checkpoint' | 'summary' | 'checklist';

const SLIDE_TYPES: { value: SlideType; label: string; icon: string }[] = [
  { value: 'title', label: 'Заглавен слайд', icon: 'ri-layout-top-line' },
  { value: 'content', label: 'Съдържание', icon: 'ri-file-text-line' },
  { value: 'comparison', label: 'Сравнение', icon: 'ri-scales-line' },
  { value: 'framework', label: 'Framework', icon: 'ri-stack-line' },
  { value: 'interactive', label: 'Интерактивен', icon: 'ri-edit-line' },
  { value: 'checkpoint', label: 'Проверка', icon: 'ri-question-answer-line' },
  { value: 'summary', label: 'Обобщение', icon: 'ri-flag-line' },
  { value: 'checklist', label: 'Чеклист', icon: 'ri-checkbox-multiple-line' },
];

function emptySlide(type: SlideType, idx: number): LessonSlide {
  const base = { id: `new-${Date.now()}-${idx}`, type, title: '', subtitle: '' };
  switch (type) {
    case 'title': return { ...base, body: '' };
    case 'content': return { ...base, body: '', highlights: [''], examples: [{ label: '', text: '', highlight: '' }] };
    case 'comparison': return { ...base, leftSide: { label: '', content: '', verdict: 'bad' as const }, rightSide: { label: '', content: '', verdict: 'good' as const } };
    case 'framework': return { ...base, body: '', frameworkSteps: [{ number: 1, title: '', description: '', icon: 'ri-lightbulb-line', example: '' }] };
    case 'interactive': return { ...base, interactivePrompt: { scenario: '', task: '', hint: '', revealAnswer: '' } };
    case 'checkpoint': return { ...base, checkpoint: { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' } };
    case 'summary': return { ...base, keyTakeaways: [''], cta: '' };
    case 'checklist': return { ...base, checklistItems: [{ id: 1, text: '' }] };
  }
}

export default function LessonsTab() {
  const [records, setRecords] = useState<LessonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState('');
  const [filterLesson, setFilterLesson] = useState('');

  // Editor state
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubtitle, setEditingSubtitle] = useState('');
  const [editingDuration, setEditingDuration] = useState('20 мин');
  const [editingSlides, setEditingSlides] = useState<LessonSlide[]>([]);
  const [editMode, setEditMode] = useState<'list' | 'edit'>('list');
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // UI state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const importing = false;
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number | null>(null);

  // Gemini paste modal
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [geminiJsonText, setGeminiJsonText] = useState('');
  const [geminiModuleId, setGeminiModuleId] = useState('');
  const [geminiLessonId, setGeminiLessonId] = useState('');
  const [geminiSaving, setGeminiSaving] = useState(false);
  const [geminiMsg, setGeminiMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const allModules = LEARNING_SECTIONS.flatMap((s) =>
    s.modules.map((m) => ({
      moduleId: m.id,
      moduleTitle: m.title,
      sectionTitle: s.title,
      lessons: m.lessons,
    }))
  );

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('interactive_lessons').select('*').order('module_id', { ascending: true });

    if (filterModule) query = query.eq('module_id', filterModule);
    if (filterLesson) query = query.eq('lesson_id', filterLesson);

    const { data, error: err } = await query;
    if (!err && data) setRecords(data as LessonRecord[]);
    setLoading(false);
  }, [filterModule, filterLesson]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const startNew = () => {
    setSelectedModuleId(filterModule || '');
    setSelectedLessonId(filterLesson || '');
    setEditingTitle('');
    setEditingSubtitle('');
    setEditingDuration('20 мин');
    setEditingSlides([]);
    setEditingRecordId(null);
    setEditMode('edit');
    setError(null);
    setSuccess(null);
  };

  const startEdit = (record: LessonRecord) => {
    setSelectedModuleId(record.module_id);
    setSelectedLessonId(record.lesson_id);
    setEditingTitle(record.title);
    setEditingSubtitle(record.subtitle || '');
    setEditingDuration(record.duration || '20 мин');
    setEditingSlides(record.slides || []);
    setEditingRecordId(record.id);
    setEditMode('edit');
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addSlide = (type: SlideType) => {
    setEditingSlides((prev) => [...prev, emptySlide(type, prev.length)]);
  };

  const removeSlide = (idx: number) => {
    setEditingSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveSlide = (idx: number, direction: 'up' | 'down') => {
    setEditingSlides((prev) => {
      const next = [...prev];
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const updateSlide = (idx: number, updates: Partial<LessonSlide>) => {
    setEditingSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...updates } : s)));
  };

  const handleSave = async () => {
    if (!selectedModuleId || !selectedLessonId || !editingTitle.trim()) {
      setError('Моля попълни модул, урок и заглавие.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      module_id: selectedModuleId,
      lesson_id: selectedLessonId,
      title: editingTitle.trim(),
      subtitle: editingSubtitle.trim(),
      duration: editingDuration || '20 мин',
      slides: editingSlides,
      updated_at: new Date().toISOString(),
    };

    if (editingRecordId) {
      const { error: err } = await supabase.from('interactive_lessons').update(payload).eq('id', editingRecordId);
      if (err) { setError('Грешка при обновяване: ' + err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from('interactive_lessons').insert([payload]);
      if (err) { setError('Грешка при запазване: ' + err.message); setSaving(false); return; }
    }

    setSaving(false);
    setSuccess(editingRecordId ? 'Обновено!' : 'Създадено!');
    setTimeout(() => { setSuccess(null); setEditMode('list'); }, 1200);
    await fetchRecords();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('interactive_lessons').delete().eq('id', id);
    await fetchRecords();
  };

  // Import all mock lessons into Supabase
  const handleImportAll = () => {
    setError('Защитеният импорт се извършва чрез проверена миграция. Използвайте редактора за отделни уроци.');
  };

  // Gemini paste: parse JSON and save directly to DB
  const handleGeminiSave = async () => {
    setGeminiMsg(null);

    if (!geminiModuleId || !geminiLessonId) {
      setGeminiMsg({ type: 'error', text: 'Избери модул и урок.' });
      return;
    }

    let parsed: LessonSlide[];
    try {
      parsed = JSON.parse(geminiJsonText.trim());
    } catch {
      setGeminiMsg({ type: 'error', text: 'JSON-ът не е валиден. Провери дали си копирал целия масив от Gemini.' });
      return;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      setGeminiMsg({ type: 'error', text: 'Очаквах JSON масив със слайдове. Увери се, че Gemini ти е върнал масив (започва с [).' });
      return;
    }

    for (let i = 0; i < parsed.length; i++) {
      if (!parsed[i].type || !parsed[i].id) {
        setGeminiMsg({ type: 'error', text: `Слайд #${i + 1} няма type или id. Всеки слайд трябва да има тези полета.` });
        return;
      }
    }

    // Auto-detect title and subtitle from first slide
    const firstSlide = parsed[0];
    const autoTitle = firstSlide.title || 'Без заглавие';
    const autoSubtitle = firstSlide.subtitle || '';

    setGeminiSaving(true);

    const payload = {
      module_id: geminiModuleId,
      lesson_id: geminiLessonId,
      title: autoTitle,
      subtitle: autoSubtitle,
      duration: '25 мин',
      slides: parsed,
      updated_at: new Date().toISOString(),
    };

    // Upsert — update if exists, insert if not
    const { error: err } = await supabase.from('interactive_lessons').upsert(payload, { onConflict: 'module_id,lesson_id' });

    setGeminiSaving(false);

    if (err) {
      setGeminiMsg({ type: 'error', text: 'Грешка при запазване: ' + err.message });
    } else {
      setGeminiMsg({ type: 'success', text: `Готово! "${autoTitle}" е запазен (${parsed.length} слайда).` });
      setTimeout(() => { setShowGeminiModal(false); setGeminiMsg(null); }, 1500);
      await fetchRecords();
    }
  };

  const selectedModule = allModules.find((m) => m.moduleId === selectedModuleId);

  const filteredRecords = records;
  const recordCount = records.length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Записани урока', value: recordCount, icon: 'ri-slideshow-line' },
          { label: 'Модули с уроци', value: new Set(records.map((r) => r.module_id)).size, icon: 'ri-folder-line' },
          { label: 'Общо слайда', value: records.reduce((sum, r) => sum + (r.slides?.length || 0), 0), icon: 'ri-layout-line' },
          { label: 'Типове слайдове', value: new Set(records.flatMap((r) => (r.slides || []).map((s) => s.type))).size, icon: 'ri-shapes-line' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <i className={`${s.icon} text-[#0A2540]/65 text-sm`} />
              <span className="text-[10px] text-[#1C1C1E]/65 uppercase tracking-widest">{s.label}</span>
            </div>
            <div className="text-2xl font-light text-[#0A2540]">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <select
          value={filterModule}
          onChange={(e) => { setFilterModule(e.target.value); setFilterLesson(''); }}
          className="px-3 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
        >
          <option value="">Всички модули</option>
          {allModules.map((m) => (
            <option key={m.moduleId} value={m.moduleId}>{m.sectionTitle} → {m.moduleTitle}</option>
          ))}
        </select>
        {filterModule && (
          <select
            value={filterLesson}
            onChange={(e) => setFilterLesson(e.target.value)}
            className="px-3 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
          >
            <option value="">Всички уроци</option>
            {allModules.find((m) => m.moduleId === filterModule)?.lessons.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        )}
        <button
          onClick={startNew}
          className="px-4 py-2.5 bg-[#0A2540] text-white text-sm rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-1" />Нов урок
        </button>
        <button
          onClick={handleImportAll}
          disabled={importing}
          className="px-4 py-2.5 bg-white border border-[#1C1C1E]/10 text-sm rounded-lg hover:bg-[#F7F6F3] transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          <i className={`${importing ? 'ri-loader-4-line animate-spin' : 'ri-download-line'} mr-1`} />
          {importing ? 'Импортване...' : 'Импорт от Mock'}
        </button>
        <button
          onClick={() => {
            setShowGeminiModal(true);
            setGeminiJsonText('');
            setGeminiModuleId(filterModule || '');
            setGeminiLessonId(filterLesson || '');
            setGeminiMsg(null);
          }}
          className="px-4 py-2.5 bg-[#1B4332] text-white text-sm rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-magic-line mr-1" />Paste от Gemini
        </button>
        <button
          onClick={fetchRecords}
          className="px-4 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg hover:bg-[#F7F6F3] transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-refresh-line mr-1" />Обнови
        </button>
      </div>

      {/* Status messages */}
      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-600">{success}</div>}

      {/* ─── EDIT MODE ─── */}
      {editMode === 'edit' && (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-5 md:p-6 mb-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-medium text-[#1C1C1E]">
              {editingRecordId ? 'Редактирай урок' : 'Нов урок'}
            </h3>
            <button
              onClick={() => { setEditMode('list'); setSuccess(null); }}
              className="text-xs text-[#1C1C1E]/65 hover:text-[#0A2540] cursor-pointer px-3 py-1.5 border border-[#1C1C1E]/10 rounded-lg"
            >
              ← Обратно
            </button>
          </div>

          {/* Lesson metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Модул *</label>
              <select
                value={selectedModuleId}
                onChange={(e) => { setSelectedModuleId(e.target.value); setSelectedLessonId(''); }}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
              >
                <option value="">Избери модул</option>
                {allModules.map((m) => (
                  <option key={m.moduleId} value={m.moduleId}>{m.sectionTitle} → {m.moduleTitle}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Урок *</label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
              >
                <option value="">Избери урок</option>
                {selectedModule?.lessons.map((l) => (
                  <option key={l.id} value={l.id}>{l.title} ({l.duration})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Заглавие *</label>
              <input type="text" value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} placeholder="Заглавие на урока..." className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
            </div>
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Продължителност</label>
              <input type="text" value={editingDuration} onChange={(e) => setEditingDuration(e.target.value)} placeholder="25 мин" className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Подзаглавие</label>
            <input type="text" value={editingSubtitle} onChange={(e) => setEditingSubtitle(e.target.value)} placeholder="Подзаглавие..." className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
          </div>

          {/* Slides section */}
          <div className="border-t border-[#1C1C1E]/8 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-medium text-[#1C1C1E]/60 uppercase tracking-wider">
                Слайдове ({editingSlides.length})
              </h4>
            </div>

            {/* Hint for modules without mock data */}
            {selectedModuleId && !selectedModuleId.startsWith('s01-') && editingSlides.length === 0 && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="ri-lightbulb-line text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-1">Няма готови mock данни за тази секция</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Използвай бутоните по-долу, за да добавиш слайдове ръчно — избираш тип слайд и попълваш съдържанието.
                      След като запазиш, урокът ще се покаже в платформата.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide type selector */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {SLIDE_TYPES.map((st) => (
                <button
                  key={st.value}
                  onClick={() => addSlide(st.value)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg hover:border-[#0A2540]/30 hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className={`${st.icon} text-xs`} />
                  {st.label}
                </button>
              ))}
            </div>

            {/* Slide list */}
            {editingSlides.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-[#1C1C1E]/12 rounded-lg">
                <i className="ri-slideshow-line text-[#1C1C1E]/20 text-2xl mb-2 block" />
                <p className="text-xs text-[#1C1C1E]/50">Няма слайдове. Добави първия от менюто горе.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {editingSlides.map((slide, idx) => (
                  <SlideEditor
                    key={slide.id}
                    slide={slide}
                    idx={idx}
                    total={editingSlides.length}
                    onChange={(updates) => updateSlide(idx, updates)}
                    onRemove={() => removeSlide(idx)}
                    onMoveUp={() => moveSlide(idx, 'up')}
                    onMoveDown={() => moveSlide(idx, 'down')}
                    onPreview={() => setPreviewSlideIdx(idx)}
                  />
                ))}
              </div>
            )}

            {/* Save button */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-[#1C1C1E]/8">
              <button
                onClick={handleSave}
                disabled={saving || !editingTitle.trim() || !selectedModuleId || !selectedLessonId}
                className="px-6 py-2.5 bg-[#0A2540] text-white text-sm rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
              >
                {saving ? 'Запазване...' : 'Запази урока'}
              </button>
              <button
                onClick={() => { setEditMode('list'); setSuccess(null); }}
                className="px-6 py-2.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                Откажи
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── LIST MODE ─── */}
      {editMode === 'list' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
              <i className="ri-slideshow-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
              <p className="text-sm text-[#1C1C1E]/65 mb-4">Няма запазени уроци.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={startNew} className="px-4 py-2.5 bg-[#0A2540] text-white text-sm rounded-lg hover:bg-[#0A2540]/90 cursor-pointer whitespace-nowrap">
                  <i className="ri-add-line mr-1" />Създай първия
                </button>
                <button onClick={handleImportAll} disabled={importing} className="px-4 py-2.5 bg-white border border-[#1C1C1E]/10 text-sm rounded-lg hover:bg-[#F7F6F3] cursor-pointer whitespace-nowrap">
                  <i className="ri-download-line mr-1" />Импорт от Mock
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((r) => {
                const mod = allModules.find((m) => m.moduleId === r.module_id);
                return (
                  <div key={r.id} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4 md:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540]/70">
                            {mod?.sectionTitle || r.module_id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1C1E]/8 text-[#1C1C1E]/65">
                            {mod?.moduleTitle || r.module_id}
                          </span>
                          <span className="text-[10px] text-[#1C1C1E]/40">{r.duration}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332]">
                            {r.slides?.length || 0} слайда
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{r.title}</h4>
                        {r.subtitle && <p className="text-xs text-[#1C1C1E]/50 mb-2">{r.subtitle}</p>}
                        <div className="flex flex-wrap gap-1">
                          {r.slides?.slice(0, 5).map((s, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#F7F6F3] border border-[#1C1C1E]/6 text-[#1C1C1E]/50">
                              {SLIDE_TYPES.find((t) => t.value === s.type)?.label || s.type}
                            </span>
                          ))}
                          {(r.slides?.length || 0) > 5 && (
                            <span className="text-[9px] text-[#1C1C1E]/40">+{r.slides!.length - 5} още</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => startEdit(r)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer" title="Редактирай">
                          <i className="ri-edit-line text-sm" />
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/70 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer" title="Изтрий">
                          <i className="ri-delete-bin-line text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ─── GEMINI PASTE MODAL ─── */}
      {showGeminiModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowGeminiModal(false)}>
          <div
            className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-white rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-[#1C1C1E]">
                <i className="ri-magic-line mr-1.5 text-[#1B4332]" />
                Paste от Gemini
              </h2>
              <button
                onClick={() => setShowGeminiModal(false)}
                className="w-8 h-8 flex items-center justify-center border border-[#1C1C1E]/10 rounded-lg text-[#1C1C1E]/50 hover:text-[#0A2540] transition-colors cursor-pointer"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <p className="text-xs text-[#1C1C1E]/50 mb-5">
              1. Копирай JSON-a от Gemini → 2. Избери модул и урок → 3. Paste → 4. Запази. Това е.
            </p>

            {/* Module & Lesson pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Модул *</label>
                <select
                  value={geminiModuleId}
                  onChange={(e) => { setGeminiModuleId(e.target.value); setGeminiLessonId(''); }}
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
                >
                  <option value="">Избери модул</option>
                  {allModules.map((m) => (
                    <option key={m.moduleId} value={m.moduleId}>{m.sectionTitle} → {m.moduleTitle}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Урок *</label>
                <select
                  value={geminiLessonId}
                  onChange={(e) => setGeminiLessonId(e.target.value)}
                  disabled={!geminiModuleId}
                  className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Избери урок</option>
                  {allModules.find((m) => m.moduleId === geminiModuleId)?.lessons.map((l) => (
                    <option key={l.id} value={l.id}>{l.title} ({l.duration})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* JSON textarea */}
            <div className="mb-5">
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">
                Paste JSON от Gemini тук *
              </label>
              <textarea
                value={geminiJsonText}
                onChange={(e) => setGeminiJsonText(e.target.value)}
                placeholder={`[{"id":"s01m02l01-01","type":"title","title":"...","subtitle":"...","body":"..."}, ...]`}
                rows={12}
                className="w-full px-4 py-3 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#1B4332]/30 text-[#1C1C1E] resize-none font-mono placeholder:text-[#1C1C1E]/30"
              />
              <p className="text-[9px] text-[#1C1C1E]/35 mt-1">
                Заглавието и подзаглавието се взимат автоматично от първия слайд (type: title).
              </p>
            </div>

            {/* Status message */}
            {geminiMsg && (
              <div className={`mb-4 p-3 rounded-lg text-xs ${geminiMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                {geminiMsg.text}
              </div>
            )}

            {/* Save */}
            <button
              onClick={handleGeminiSave}
              disabled={geminiSaving || !geminiJsonText.trim() || !geminiModuleId || !geminiLessonId}
              className="w-full px-6 py-3 bg-[#1B4332] text-white text-sm rounded-lg hover:bg-[#1B4332]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {geminiSaving ? (
                <><i className="ri-loader-4-line animate-spin mr-2" />Запазване...</>
              ) : (
                <><i className="ri-save-line mr-2" />Запази урока в базата</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ─── PREVIEW MODAL ─── */}
      {previewSlideIdx !== null && editingSlides[previewSlideIdx] && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setPreviewSlideIdx(null)}>
          <div
            className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] px-2 py-1 bg-[#1a1a1a] text-[#a0a0a0]">
                {SLIDE_TYPES.find((t) => t.value === editingSlides[previewSlideIdx].type)?.label}
              </span>
              <button onClick={() => setPreviewSlideIdx(null)} className="w-8 h-8 flex items-center justify-center border border-[#2a2a2a] text-[#a0a0a0] hover:text-white transition-colors cursor-pointer">
                <i className="ri-close-line" />
              </button>
            </div>
            <PreviewSlideContent slide={editingSlides[previewSlideIdx]} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Slide Editor ─── */
function SlideEditor({
  slide,
  idx,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  onPreview,
}: {
  slide: LessonSlide;
  idx: number;
  total: number;
  onChange: (updates: Partial<LessonSlide>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onPreview: () => void;
}) {
  const typeLabel = SLIDE_TYPES.find((t) => t.value === slide.type)?.label || slide.type;

  return (
    <div className="border border-[#1C1C1E]/10 rounded-lg p-4 bg-[#F7F6F3]/50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-[#1C1C1E]/40 w-5">{idx + 1}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540]/70">{typeLabel}</span>
        <div className="flex-1" />
        <button onClick={onPreview} className="w-6 h-6 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#0A2540] transition-colors cursor-pointer" title="Преглед">
          <i className="ri-eye-line text-xs" />
        </button>
        <button onClick={onMoveUp} disabled={idx === 0} className="w-6 h-6 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#0A2540] transition-colors cursor-pointer disabled:opacity-25" title="Премести нагоре">
          <i className="ri-arrow-up-s-line text-xs" />
        </button>
        <button onClick={onMoveDown} disabled={idx === total - 1} className="w-6 h-6 flex items-center justify-center text-[#1C1C1E]/40 hover:text-[#0A2540] transition-colors cursor-pointer disabled:opacity-25" title="Премести надолу">
          <i className="ri-arrow-down-s-line text-xs" />
        </button>
        <button onClick={onRemove} className="w-6 h-6 flex items-center justify-center text-[#1C1C1E]/40 hover:text-red-500 transition-colors cursor-pointer" title="Изтрий слайд">
          <i className="ri-close-line text-xs" />
        </button>
      </div>

      {/* Common fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input
          type="text"
          value={slide.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Заглавие на слайда"
          className="px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]"
        />
        <input
          type="text"
          value={slide.subtitle || ''}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Подзаглавие"
          className="px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]"
        />
      </div>

      {/* Type-specific fields */}
      <SlideFields slide={slide} onChange={onChange} />
    </div>
  );
}

/* ─── Dynamic Fields per Slide Type ─── */
function SlideFields({ slide, onChange }: { slide: LessonSlide; onChange: (updates: Partial<LessonSlide>) => void }) {
  switch (slide.type) {
    case 'title':
      return (
        <textarea
          value={slide.body || ''}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder="Основен текст..."
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none"
        />
      );

    case 'content':
      return (
        <div className="space-y-3">
          <textarea value={slide.body || ''} onChange={(e) => onChange({ body: e.target.value })} placeholder="Основен текст..." rows={3} className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
          <ArrayField label="Highlights" items={slide.highlights || []} onChange={(v) => onChange({ highlights: v })} placeholder="Highlight..." />
          <NestedArrayField label="Примери" items={slide.examples || []} onChange={(v) => onChange({ examples: v.map(x => ({ label: x.label || '', text: x.text || '', highlight: x.highlight })) })} fields={['label', 'text', 'highlight']} placeholders={['Label', 'Текст', 'Highlight']} />
        </div>
      );

    case 'comparison':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-[#1C1C1E]/50 mb-1">Лява страна (негативна)</label>
            <input type="text" value={slide.leftSide?.label || ''} onChange={(e) => onChange({ leftSide: { ...slide.leftSide!, label: e.target.value } })} placeholder="Label" className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg mb-2 focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
            <textarea value={slide.leftSide?.content || ''} onChange={(e) => onChange({ leftSide: { ...slide.leftSide!, content: e.target.value } })} placeholder="Съдържание..." rows={4} className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
          </div>
          <div>
            <label className="block text-[10px] text-[#1C1C1E]/50 mb-1">Дясна страна (позитивна)</label>
            <input type="text" value={slide.rightSide?.label || ''} onChange={(e) => onChange({ rightSide: { ...slide.rightSide!, label: e.target.value } })} placeholder="Label" className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg mb-2 focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
            <textarea value={slide.rightSide?.content || ''} onChange={(e) => onChange({ rightSide: { ...slide.rightSide!, content: e.target.value } })} placeholder="Съдържание..." rows={4} className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
          </div>
        </div>
      );

    case 'framework':
      return (
        <div className="space-y-3">
          <textarea value={slide.body || ''} onChange={(e) => onChange({ body: e.target.value })} placeholder="Въведение..." rows={2} className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
          <div className="space-y-3">
            <label className="block text-[10px] text-[#1C1C1E]/50">Стъпки</label>
            {(slide.frameworkSteps || []).map((step, si) => (
              <div key={si} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white rounded-lg border border-[#1C1C1E]/8">
                <input type="number" value={step.number} onChange={(e) => { const s = [...(slide.frameworkSteps || [])]; s[si] = { ...s[si], number: parseInt(e.target.value) || si + 1 }; onChange({ frameworkSteps: s }); }} className="px-2 py-1.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded text-[#1C1C1E]" placeholder="#" />
                <input type="text" value={step.title} onChange={(e) => { const s = [...(slide.frameworkSteps || [])]; s[si] = { ...s[si], title: e.target.value }; onChange({ frameworkSteps: s }); }} className="px-2 py-1.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded text-[#1C1C1E]" placeholder="Заглавие" />
                <input type="text" value={step.icon} onChange={(e) => { const s = [...(slide.frameworkSteps || [])]; s[si] = { ...s[si], icon: e.target.value }; onChange({ frameworkSteps: s }); }} className="px-2 py-1.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded text-[#1C1C1E]" placeholder="icon-name" />
                <button onClick={() => { const s = (slide.frameworkSteps || []).filter((_, i) => i !== si); onChange({ frameworkSteps: s }); }} className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer">Премахни</button>
                <input type="text" value={step.description} onChange={(e) => { const s = [...(slide.frameworkSteps || [])]; s[si] = { ...s[si], description: e.target.value }; onChange({ frameworkSteps: s }); }} className="col-span-full px-2 py-1.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded text-[#1C1C1E]" placeholder="Описание" />
                <input type="text" value={step.example} onChange={(e) => { const s = [...(slide.frameworkSteps || [])]; s[si] = { ...s[si], example: e.target.value }; onChange({ frameworkSteps: s }); }} className="col-span-full px-2 py-1.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded text-[#1C1C1E]" placeholder="Пример" />
              </div>
            ))}
            <button onClick={() => { const s = [...(slide.frameworkSteps || []), { number: (slide.frameworkSteps || []).length + 1, title: '', description: '', icon: 'ri-lightbulb-line', example: '' }]; onChange({ frameworkSteps: s }); }} className="text-xs text-[#0A2540] hover:underline cursor-pointer">
              + Добави стъпка
            </button>
          </div>
        </div>
      );

    case 'interactive':
      return (
        <div className="space-y-2">
          {(['scenario', 'task', 'hint', 'revealAnswer'] as const).map((field) => (
            <div key={field}>
              <label className="block text-[10px] text-[#1C1C1E]/50 mb-0.5 capitalize">{field === 'revealAnswer' ? 'Примерен отговор' : field === 'scenario' ? 'Сценарий' : field === 'task' ? 'Задача' : 'Подсказка'}</label>
              <textarea
                value={slide.interactivePrompt?.[field] || ''}
                onChange={(e) => onChange({ interactivePrompt: { ...slide.interactivePrompt!, [field]: e.target.value } })}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none"
                placeholder={field === 'scenario' ? 'Опиши ситуацията...' : ''}
              />
            </div>
          ))}
        </div>
      );

    case 'checkpoint':
      return (
        <div className="space-y-3">
          <input type="text" value={slide.checkpoint?.question || ''} onChange={(e) => onChange({ checkpoint: { ...slide.checkpoint!, question: e.target.value } })} placeholder="Въпрос..." className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(slide.checkpoint?.options || ['', '', '', '']).map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <button
                  onClick={() => onChange({ checkpoint: { ...slide.checkpoint!, correctIndex: oi } })}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all cursor-pointer ${slide.checkpoint?.correctIndex === oi ? 'bg-[#1B4332] text-white ring-2 ring-[#1B4332]/20' : 'bg-[#1C1C1E]/8 text-[#1C1C1E]/50'}`}
                >
                  {String.fromCharCode(65 + oi)}
                </button>
                <input type="text" value={opt} onChange={(e) => { const o = [...(slide.checkpoint?.options || [])]; o[oi] = e.target.value; onChange({ checkpoint: { ...slide.checkpoint!, options: o } }); }} placeholder={`Опция ${String.fromCharCode(65 + oi)}`} className="flex-1 px-2 py-1.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
              </div>
            ))}
          </div>
          <textarea value={slide.checkpoint?.explanation || ''} onChange={(e) => onChange({ checkpoint: { ...slide.checkpoint!, explanation: e.target.value } })} placeholder="Обяснение..." rows={2} className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none" />
        </div>
      );

    case 'summary':
      return (
        <div className="space-y-3">
          <ArrayField label="Ключови изводи" items={slide.keyTakeaways || []} onChange={(v) => onChange({ keyTakeaways: v })} placeholder="Извод..." />
          <input type="text" value={slide.cta || ''} onChange={(e) => onChange({ cta: e.target.value })} placeholder="Call to Action..." className="w-full px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
        </div>
      );

    case 'checklist':
      return (
        <div className="space-y-2">
          <label className="block text-[10px] text-[#1C1C1E]/50">Чеклист точки</label>
          {(slide.checklistItems || []).map((item, ci) => (
            <div key={ci} className="flex items-center gap-2">
              <span className="text-[10px] text-[#1C1C1E]/40 w-6">{item.id}</span>
              <input type="text" value={item.text} onChange={(e) => { const items = [...(slide.checklistItems || [])]; items[ci] = { ...items[ci], text: e.target.value }; onChange({ checklistItems: items }); }} placeholder="Текст..." className="flex-1 px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
              <button onClick={() => { const items = (slide.checklistItems || []).filter((_, i) => i !== ci); onChange({ checklistItems: items }); }} className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer">✕</button>
            </div>
          ))}
          <button onClick={() => { const items = [...(slide.checklistItems || []), { id: (slide.checklistItems || []).length + 1, text: '' }]; onChange({ checklistItems: items }); }} className="text-xs text-[#0A2540] hover:underline cursor-pointer">
            + Добави точка
          </button>
        </div>
      );

    default:
      return null;
  }
}

/* ─── Reusable: Array of strings ─── */
function ArrayField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-[10px] text-[#1C1C1E]/50 mb-1">{label}</label>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={item} onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }} placeholder={placeholder} className="flex-1 px-3 py-2 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer shrink-0">✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => onChange([...items, ''])} className="text-xs text-[#0A2540] hover:underline cursor-pointer mt-1">+ Добави</button>
    </div>
  );
}

/* ─── Reusable: Array of objects ─── */
function NestedArrayField({ label, items, onChange, fields, placeholders }: { label: string; items: Record<string, string>[]; onChange: (v: Record<string, string>[]) => void; fields: string[]; placeholders: string[] }) {
  return (
    <div>
      <label className="block text-[10px] text-[#1C1C1E]/50 mb-1">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2 p-2 bg-white rounded-lg border border-[#1C1C1E]/8">
            <div className="flex-1 space-y-1">
              {fields.map((f, fi) => (
                <input key={f} type="text" value={item[f] || ''} onChange={(e) => { const next = [...items]; next[i] = { ...next[i], [f]: e.target.value }; onChange(next); }} placeholder={placeholders[fi] || f} className="w-full px-2 py-1.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded text-[#1C1C1E]" />
              ))}
            </div>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer shrink-0 mt-1">✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => { const empty: Record<string, string> = {}; fields.forEach((f) => { empty[f] = ''; }); onChange([...items, empty]); }} className="text-xs text-[#0A2540] hover:underline cursor-pointer mt-1">+ Добави</button>
    </div>
  );
}

/* ─── Preview (simplified dark-mode slide render) ─── */
function PreviewSlideContent({ slide }: { slide: LessonSlide }) {
  return (
    <div className="text-white">
      <h3 className="text-xl font-bold mb-2">{slide.title || 'Без заглавие'}</h3>
      {slide.subtitle && <p className="text-sm text-[#a0a0a0] mb-3">{slide.subtitle}</p>}
      {slide.body && <p className="text-sm text-[#a0a0a0] mb-3 whitespace-pre-line">{slide.body}</p>}
      {slide.highlights && slide.highlights.length > 0 && (
        <ul className="space-y-1 mb-3">
          {slide.highlights.map((h, i) => <li key={i} className="text-sm text-[#a0a0a0] flex gap-2"><span className="text-[#e53e3e]">•</span> {h}</li>)}
        </ul>
      )}
      {slide.checklistItems && slide.checklistItems.length > 0 && (
        <ul className="space-y-1">
          {slide.checklistItems.map((item) => <li key={item.id} className="text-sm text-[#a0a0a0] flex gap-2"><span className="text-[#666]">{item.id}.</span> {item.text || '...'}</li>)}
        </ul>
      )}
      {slide.frameworkSteps && slide.frameworkSteps.length > 0 && (
        <div className="space-y-2 mt-3">
          {slide.frameworkSteps.map((step, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="text-[#e53e3e] font-bold">{step.number}.</span>
              <span className="text-white font-medium">{step.title || '...'}</span>
              {step.description && <span className="text-[#a0a0a0]">— {step.description}</span>}
            </div>
          ))}
        </div>
      )}
      {slide.interactivePrompt && (
        <div className="mt-3 space-y-2 text-sm">
          {slide.interactivePrompt.scenario && <p className="text-[#a0a0a0]">📋 {slide.interactivePrompt.scenario}</p>}
          {slide.interactivePrompt.task && <p className="text-white">🎯 {slide.interactivePrompt.task}</p>}
        </div>
      )}
      {slide.checkpoint && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">{slide.checkpoint.question || '...'}</p>
          <div className="grid grid-cols-2 gap-1">
            {(slide.checkpoint.options || []).map((opt, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded ${i === slide.checkpoint!.correctIndex ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#1a1a1a] text-[#a0a0a0]'}`}>
                {String.fromCharCode(65 + i)}. {opt || '...'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
