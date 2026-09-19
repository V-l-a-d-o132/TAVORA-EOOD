import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';

interface QuizItem {
  id: string;
  module_id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  order_index: number;
  created_at: string;
}

const DEFAULT_OPTIONS = ['', '', '', ''];

export default function QuizTab() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState('');
  const [filterLesson, setFilterLesson] = useState('');
  const [editing, setEditing] = useState<QuizItem | null>(null);
  const [form, setForm] = useState({
    module_id: '',
    lesson_id: '',
    question: '',
    options: [...DEFAULT_OPTIONS],
    correct_index: 0,
    explanation: '',
    order_index: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* Build module/lesson options from mock data */
  const allModules = LEARNING_SECTIONS.flatMap((s) =>
    s.modules.map((m) => ({
      moduleId: m.id,
      moduleTitle: m.title,
      sectionTitle: s.title,
      lessons: m.lessons,
    }))
  );

  const selectedModule = allModules.find((m) => m.moduleId === (editing ? editing.module_id : form.module_id));

  /* Load quizzes */
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('lesson_quizzes').select('*').order('order_index', { ascending: true });

    if (filterModule) {
      query = query.eq('module_id', filterModule);
    }
    if (filterLesson) {
      query = query.eq('lesson_id', filterLesson);
    }

    const { data, error: err } = await query;
    if (!err && data) {
      setQuizzes(
        data.map((d) => ({
          ...d,
          options: Array.isArray(d.options) ? d.options : JSON.parse(d.options || '[]'),
        }))
      );
    }
    setLoading(false);
  }, [filterModule, filterLesson]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  /* Reset form */
  const resetForm = () => {
    setForm({
      module_id: filterModule || '',
      lesson_id: filterLesson || '',
      question: '',
      options: [...DEFAULT_OPTIONS],
      correct_index: 0,
      explanation: '',
      order_index: quizzes.filter((q) => q.module_id === filterModule && q.lesson_id === filterLesson).length,
    });
    setEditing(null);
    setError(null);
  };

  /* Start editing */
  const startEdit = (item: QuizItem) => {
    setEditing(item);
    setForm({
      module_id: item.module_id,
      lesson_id: item.lesson_id,
      question: item.question,
      options: item.options.length >= 4 ? item.options : [...item.options, ...Array(4 - item.options.length).fill('')],
      correct_index: item.correct_index,
      explanation: item.explanation || '',
      order_index: item.order_index,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Save */
  const handleSave = async () => {
    if (!form.module_id || !form.lesson_id || !form.question.trim()) {
      setError('Моля попълни модул, урок и въпрос.');
      return;
    }
    if (form.options.some((o) => !o.trim())) {
      setError('Всички 4 опции трябва да са попълнени.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      module_id: form.module_id,
      lesson_id: form.lesson_id,
      question: form.question.trim(),
      options: form.options.map((o) => o.trim()),
      correct_index: form.correct_index,
      explanation: form.explanation.trim(),
      order_index: form.order_index,
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error: err } = await supabase.from('lesson_quizzes').update(payload).eq('id', editing.id);
      if (err) setError('Грешка при обновяване: ' + err.message);
    } else {
      const { error: err } = await supabase.from('lesson_quizzes').insert([payload]);
      if (err) setError('Грешка при запазване: ' + err.message);
    }

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
      resetForm();
      await fetchQuizzes();
    }

    setSaving(false);
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    await supabase.from('lesson_quizzes').delete().eq('id', id);
    setDeleteId(null);
    await fetchQuizzes();
  };

  /* Filtered display */
  const filteredQuizzes = quizzes;
  const quizCount = quizzes.length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Общо въпроси', value: quizCount, icon: 'ri-question-line' },
          { label: 'Модули с куиз', value: new Set(quizzes.map((q) => q.module_id)).size, icon: 'ri-folder-line' },
          { label: 'Уроци с куиз', value: new Set(quizzes.map((q) => `${q.module_id}-${q.lesson_id}`)).size, icon: 'ri-book-open-line' },
          { label: 'Средно/урок', value: quizCount > 0 ? Math.round(quizCount / (new Set(quizzes.map((q) => `${q.module_id}-${q.lesson_id}`)).size || 1)) : 0, icon: 'ri-bar-chart-line' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <select
          value={filterModule}
          onChange={(e) => {
            setFilterModule(e.target.value);
            setFilterLesson('');
          }}
          className="px-3 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
        >
          <option value="">Всички модули</option>
          {allModules.map((m) => (
            <option key={m.moduleId} value={m.moduleId}>
              {m.sectionTitle} — {m.moduleTitle}
            </option>
          ))}
        </select>
        <select
          value={filterLesson}
          onChange={(e) => setFilterLesson(e.target.value)}
          className="px-3 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
        >
          <option value="">Всички уроци</option>
          {filterModule &&
            allModules
              .find((m) => m.moduleId === filterModule)
              ?.lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
        </select>
        <button
          onClick={fetchQuizzes}
          className="px-4 py-2.5 text-sm bg-white border border-[#1C1C1E]/10 rounded-lg hover:bg-[#F7F6F3] transition-colors cursor-pointer"
        >
          <i className="ri-refresh-line mr-1" />
          Обнови
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-5 md:p-6 mb-5">
        <h3 className="text-sm font-medium text-[#1C1C1E] mb-4">
          {editing ? 'Редактирай въпрос' : 'Нов въпрос'}
        </h3>

        {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-xs text-green-600">Запазено!</div>}

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Модул *</label>
              <select
                value={form.module_id}
                onChange={(e) => setForm({ ...form, module_id: e.target.value, lesson_id: '' })}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
              >
                <option value="">Избери модул</option>
                {allModules.map((m) => (
                  <option key={m.moduleId} value={m.moduleId}>
                    {m.sectionTitle} — {m.moduleTitle}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Урок *</label>
              <select
                value={form.lesson_id}
                onChange={(e) => setForm({ ...form, lesson_id: e.target.value })}
                className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] cursor-pointer"
              >
                <option value="">Избери урок</option>
                {form.module_id &&
                  allModules
                    .find((m) => m.moduleId === form.module_id)
                    ?.lessons.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Въпрос *</label>
            <input
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Напиши въпроса..."
              className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {form.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <button
                  onClick={() => setForm({ ...form, correct_index: idx })}
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-all cursor-pointer ${
                    form.correct_index === idx
                      ? 'bg-[#1B4332] text-white ring-2 ring-[#1B4332]/20'
                      : 'bg-[#1C1C1E]/8 text-[#1C1C1E]/50 hover:bg-[#1C1C1E]/15'
                  }`}
                  title={form.correct_index === idx ? 'Верен отговор' : 'Маркирай като верен'}
                >
                  {String.fromCharCode(65 + idx)}
                </button>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...form.options];
                    newOpts[idx] = e.target.value;
                    setForm({ ...form, options: newOpts });
                  }}
                  placeholder={`Опция ${String.fromCharCode(65 + idx)}`}
                  className="flex-1 px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Обяснение</label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm({ ...form, explanation: e.target.value })}
              placeholder="Защо верният отговор е правилен..."
              rows={3}
              className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E] resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] text-[#1C1C1E]/60 mb-1.5">Ред</label>
              <input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
                className="w-20 px-3 py-2.5 text-sm bg-[#F7F6F3] border border-[#1C1C1E]/10 rounded-lg focus:outline-none focus:border-[#0A2540]/30 text-[#1C1C1E]"
              />
            </div>
            <div className="flex-1" />
            {editing && (
              <button
                onClick={resetForm}
                className="px-4 py-2.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer whitespace-nowrap"
              >
                Откажи
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#0A2540] text-white text-sm rounded-lg hover:bg-[#0A2540]/90 transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
            >
              {saving ? 'Запазване...' : success ? '✓ Запазено!' : editing ? 'Обнови' : 'Добави въпрос'}
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-12 text-center">
          <i className="ri-question-line text-[#1C1C1E]/20 text-3xl mb-3 block" />
          <p className="text-sm text-[#1C1C1E]/65">Няма въпроси. Добави първия!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuizzes.map((q) => {
            const mod = allModules.find((m) => m.moduleId === q.module_id);
            const lesson = mod?.lessons.find((l) => l.id === q.lesson_id);
            return (
              <div key={q.id} className="bg-white rounded-xl border border-[#1C1C1E]/8 p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540]/70">
                        {mod?.sectionTitle || q.module_id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1C1C1E]/8 text-[#1C1C1E]/65">
                        {lesson?.title || q.lesson_id}
                      </span>
                      <span className="text-[10px] text-[#1C1C1E]/40">#{q.order_index}</span>
                    </div>
                    <p className="text-sm font-medium text-[#1C1C1E] mb-3">{q.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                            idx === q.correct_index
                              ? 'bg-[#1B4332]/8 border border-[#1B4332]/20 text-[#1B4332]'
                              : 'bg-[#F7F6F3] border border-[#1C1C1E]/6 text-[#1C1C1E]/65'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              idx === q.correct_index ? 'bg-[#1B4332] text-white' : 'bg-[#1C1C1E]/10 text-[#1C1C1E]/50'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-[#1C1C1E]/50 mt-2 italic">{q.explanation}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(q)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/65 hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer"
                      title="Редактирай"
                    >
                      <i className="ri-edit-line text-sm" />
                    </button>
                    <button
                      onClick={() => setDeleteId(q.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1C1C1E]/10 text-[#1C1C1E]/70 hover:border-red-300 hover:text-red-500 transition-all cursor-pointer"
                      title="Изтрий"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl border border-[#1C1C1E]/8 p-6 max-w-sm w-full">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 mx-auto mb-4">
              <i className="ri-delete-bin-line text-red-500 text-lg" />
            </div>
            <h3 className="text-base font-medium text-[#1C1C1E] text-center mb-2">Изтрий въпрос?</h3>
            <p className="text-xs text-[#1C1C1E]/65 text-center mb-5">Това действие не може да бъде отменено.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-lg hover:border-[#0A2540]/25 transition-colors cursor-pointer"
              >
                Откажи
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}