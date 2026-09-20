import { useCallback, useEffect, useMemo, useState } from 'react';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';
import {
  BLOCK_LABELS,
  LESSON_BLOCK_TYPES,
  createBlock,
  duplicateAdminLesson,
  getAdminLesson,
  listAdminLessons,
  previewAdminLesson,
  rollbackAdminLesson,
  saveAdminLesson,
  setAdminLessonStatus,
  type JsonObject,
  type LessonBlockType,
  type LessonBlockV2,
  type LessonListItem,
  type LessonV2,
} from '@/lib/lesson-engine-v2';
import LessonEngineV2 from '@/pages/module/components/lesson-v2/LessonEngineV2';

const modules = LEARNING_SECTIONS.flatMap((section) => section.modules.map((module) => ({
  id: module.id,
  title: `${section.title} → ${module.title}`,
  lessons: module.lessons,
})));

interface EditorState {
  id: string | null;
  moduleId: string;
  lessonId: string;
  title: string;
  subtitle: string;
  duration: string;
  objective: string;
  hook: string;
  estimatedMinutes: number;
  changeNote: string;
  blocks: LessonBlockV2[];
  status: LessonV2['status'];
  versionId: string | null;
}

const emptyEditor = (): EditorState => ({
  id: null, moduleId: '', lessonId: '', title: '', subtitle: '', duration: '20 мин',
  objective: '', hook: '', estimatedMinutes: 20, changeNote: '', blocks: [], status: 'draft', versionId: null,
});

function toEditor(lesson: LessonV2): EditorState {
  return {
    id: lesson.id, moduleId: lesson.moduleId, lessonId: lesson.lessonId, title: lesson.title,
    subtitle: lesson.subtitle, duration: lesson.duration, objective: lesson.objective, hook: lesson.hook,
    estimatedMinutes: lesson.estimatedMinutes, changeNote: '', blocks: lesson.blocks,
    status: lesson.status, versionId: lesson.versionId,
  };
}

export default function LessonsTab() {
  const [items, setItems] = useState<LessonListItem[]>([]);
  const [filterModule, setFilterModule] = useState('');
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  const [editor, setEditor] = useState<EditorState>(emptyEditor);
  const [details, setDetails] = useState<LessonV2 | null>(null);
  const [preview, setPreview] = useState<LessonV2 | null>(null);
  const [newBlockType, setNewBlockType] = useState<LessonBlockType>('concept');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try { setItems(await listAdminLessons()); }
    catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Уроците не могат да бъдат заредени.' }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadList(); }, [loadList]);

  const filtered = useMemo(() => filterModule ? items.filter((item) => item.moduleId === filterModule) : items, [filterModule, items]);
  const selectedModule = modules.find((module) => module.id === editor.moduleId);
  const validationErrors = details?.validation?.errors || [];

  const openLesson = async (id: string, versionId?: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const lesson = await getAdminLesson(id, versionId);
      if (!lesson) throw new Error('Урокът не е намерен.');
      setDetails(lesson);
      setEditor(toEditor(lesson));
      setMode('edit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Урокът не може да бъде отворен.' }); }
    finally { setLoading(false); }
  };

  const updateBlock = (index: number, patch: Partial<LessonBlockV2>) => setEditor((current) => ({
    ...current,
    blocks: current.blocks.map((block, blockIndex) => blockIndex === index ? { ...block, ...patch } : block),
  }));

  const moveBlock = (index: number, delta: number) => setEditor((current) => {
    const target = index + delta;
    if (target < 0 || target >= current.blocks.length) return current;
    const blocks = [...current.blocks];
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    return { ...current, blocks: blocks.map((block, position) => ({ ...block, position })) };
  });

  const save = async () => {
    if (!editor.moduleId || !editor.lessonId || !editor.title.trim()) {
      setMessage({ tone: 'error', text: 'Модулът, ID на урока и заглавието са задължителни.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const lesson = await saveAdminLesson({ ...editor, blocks: editor.blocks, changeNote: editor.changeNote || 'Редакция през Lesson Engine V2' });
      if (!lesson) throw new Error('Запазването не върна версия.');
      setDetails(lesson);
      setEditor(toEditor(lesson));
      setMessage({ tone: 'ok', text: `Draft версия ${lesson.version} е запазена. Публикуването е отделна стъпка.` });
      await loadList();
    } catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Запазването не успя.' }); }
    finally { setSaving(false); }
  };

  const changeStatus = async (status: LessonV2['status']) => {
    if (!editor.id || !editor.versionId) return;
    setSaving(true);
    setMessage(null);
    try {
      const lesson = await setAdminLessonStatus(editor.id, status, editor.versionId);
      if (!lesson) throw new Error('Промяната на статуса не успя.');
      setDetails(lesson);
      setEditor(toEditor(lesson));
      setMessage({ tone: 'ok', text: status === 'published' ? 'Версията е публикувана за обучаемите.' : `Статусът е променен на ${status}.` });
      await loadList();
    } catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Статусът не може да бъде променен.' }); }
    finally { setSaving(false); }
  };

  const showPreview = async () => {
    if (!editor.id || !editor.versionId) {
      setMessage({ tone: 'error', text: 'Първо запази draft версията, после отвори preview.' });
      return;
    }
    try {
      const lesson = await previewAdminLesson(editor.id, editor.versionId);
      if (lesson) setPreview(lesson);
    } catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Preview не може да бъде зареден.' }); }
  };

  const duplicate = async () => {
    if (!editor.id) return;
    const lessonKey = `${editor.lessonId}-copy`;
    try {
      const lesson = await duplicateAdminLesson(editor.id, editor.moduleId, lessonKey);
      if (lesson) { setDetails(lesson); setEditor(toEditor(lesson)); setMessage({ tone: 'ok', text: `Създаден е draft ${lessonKey}.` }); await loadList(); }
    } catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Дублирането не успя.' }); }
  };

  const rollback = async (versionId: string) => {
    if (!editor.id || !window.confirm('Да публикуваме ново копие на избраната стара версия? Историята се запазва.')) return;
    try {
      const lesson = await rollbackAdminLesson(editor.id, versionId);
      if (lesson) { setDetails(lesson); setEditor(toEditor(lesson)); setMessage({ tone: 'ok', text: `Публикувана е rollback версия ${lesson.version}.` }); await loadList(); }
    } catch (cause) { setMessage({ tone: 'error', text: cause instanceof Error ? cause.message : 'Rollback не успя.' }); }
  };

  return <div className="space-y-5">
    {message && <div role="status" className={`rounded-xl border p-4 text-sm ${message.tone === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-700'}`}>{message.text}</div>}

    {mode === 'list' ? <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Всички уроци" value={items.length} icon="ri-book-open-line" />
        <Stat label="Публикувани" value={items.filter((item) => item.status === 'published').length} icon="ri-global-line" />
        <Stat label="За преглед" value={items.filter((item) => item.status === 'review').length} icon="ri-eye-line" />
        <Stat label="Нужда от работа" value={items.filter((item) => (item.validation?.errors?.length || 0) > 0).length} icon="ri-error-warning-line" />
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-black/5 bg-white p-4 sm:flex-row">
        <select value={filterModule} onChange={(event) => setFilterModule(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-black/10 px-3 py-2.5 text-sm"><option value="">Всички модули</option>{modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select>
        <button type="button" onClick={() => { setEditor(emptyEditor()); setDetails(null); setMode('edit'); }} className="rounded-lg bg-[#0A2540] px-4 py-2.5 text-sm font-semibold text-white"><i className="ri-add-line mr-2" />Нов урок</button>
        <button type="button" onClick={() => void loadList()} className="rounded-lg border border-black/10 px-4 py-2.5 text-sm"><i className="ri-refresh-line mr-2" />Обнови</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-black/5 bg-white">
        {loading ? <div className="p-10 text-center text-sm text-black/50">Зареждане…</div> : filtered.length === 0 ? <div className="p-10 text-center text-sm text-black/50">Няма уроци в този филтър.</div> : filtered.map((item) => <button type="button" key={item.id} onClick={() => void openLesson(item.id)} className="grid w-full gap-3 border-b border-black/5 p-4 text-left transition last:border-0 hover:bg-[#F7F6F3] md:grid-cols-[110px_1fr_auto] md:items-center"><div><span className="rounded-full bg-[#0A2540]/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0A2540]">{item.moduleId}</span><p className="mt-2 text-xs text-black/45">{item.lessonId}</p></div><div><h3 className="text-sm font-semibold text-[#1C1C1E]">{item.title}</h3><div className="mt-2 flex flex-wrap gap-2 text-[10px] text-black/50"><span>{item.blockCount} блока</span><span>v{item.version}</span>{item.hasInteraction && <span>интерактивност</span>}{item.hasQuiz && <span>quiz</span>}{item.hasAssignment && <span>задача</span>}</div></div><div className="flex items-center gap-2"><StatusBadge status={item.status} />{(item.validation?.errors?.length || 0) > 0 && <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700">{item.validation.errors.length} грешки</span>}<i className="ri-arrow-right-s-line text-black/35" /></div></button>)}
      </div>
    </> : <>
      <div className="sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-black/5 bg-white/95 p-3 shadow-sm backdrop-blur">
        <button type="button" onClick={() => { setMode('list'); setMessage(null); }} className="rounded-lg border border-black/10 px-3 py-2 text-xs"><i className="ri-arrow-left-line mr-1" />Списък</button>
        <StatusBadge status={editor.status} />
        {editor.versionId && <span className="text-xs text-black/45">Версия {details?.version}</span>}
        <span className="flex-1" />
        <button type="button" onClick={() => void showPreview()} className="rounded-lg border border-black/10 px-3 py-2 text-xs"><i className="ri-eye-line mr-1" />Preview</button>
        {editor.id && <button type="button" onClick={() => void duplicate()} className="rounded-lg border border-black/10 px-3 py-2 text-xs"><i className="ri-file-copy-line mr-1" />Дублирай</button>}
        <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg bg-[#0A2540] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">{saving ? 'Запазване…' : 'Запази нов draft'}</button>
      </div>

      <section className="rounded-xl border border-black/5 bg-white p-5">
        <h2 className="mb-5 text-sm font-semibold">Идентичност и учебна логика</h2>
        <div className="grid gap-4 md:grid-cols-2"><Field label="Модул"><select value={editor.moduleId} onChange={(event) => setEditor((value) => ({ ...value, moduleId: event.target.value, lessonId: '' }))} className="admin-input"><option value="">Избери</option>{modules.map((module) => <option key={module.id} value={module.id}>{module.title}</option>)}</select></Field><Field label="Урок ID"><select value={editor.lessonId} onChange={(event) => { const lesson = selectedModule?.lessons.find((item) => item.id === event.target.value); setEditor((value) => ({ ...value, lessonId: event.target.value, title: value.title || lesson?.title || '', duration: value.duration || lesson?.duration || '20 мин' })); }} className="admin-input"><option value="">Избери или въведи долу</option>{selectedModule?.lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.id} — {lesson.title}</option>)}</select><input aria-label="Ръчен lesson ID" value={editor.lessonId} onChange={(event) => setEditor((value) => ({ ...value, lessonId: event.target.value }))} className="admin-input mt-2" placeholder="lesson-id" /></Field><Field label="Заглавие"><input value={editor.title} onChange={(event) => setEditor((value) => ({ ...value, title: event.target.value }))} className="admin-input" /></Field><Field label="Подзаглавие"><input value={editor.subtitle} onChange={(event) => setEditor((value) => ({ ...value, subtitle: event.target.value }))} className="admin-input" /></Field><Field label="Продължителност"><input value={editor.duration} onChange={(event) => setEditor((value) => ({ ...value, duration: event.target.value }))} className="admin-input" /></Field><Field label="Минути"><input type="number" min={1} max={600} value={editor.estimatedMinutes} onChange={(event) => setEditor((value) => ({ ...value, estimatedMinutes: Number(event.target.value) }))} className="admin-input" /></Field><Field label="След този урок ще можеш да…"><textarea value={editor.objective} onChange={(event) => setEditor((value) => ({ ...value, objective: event.target.value }))} rows={3} className="admin-input" /></Field><Field label="Hook: реалният проблем"><textarea value={editor.hook} onChange={(event) => setEditor((value) => ({ ...value, hook: event.target.value }))} rows={3} className="admin-input" /></Field></div>
        <Field label="Бележка за версията"><input value={editor.changeNote} onChange={(event) => setEditor((value) => ({ ...value, changeNote: event.target.value }))} className="admin-input" placeholder="Какво и защо е променено" /></Field>
      </section>

      <section className="rounded-xl border border-black/5 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2"><div className="mr-auto"><h2 className="text-sm font-semibold">Учебни блокове</h2><p className="mt-1 text-xs text-black/45">Подреждането тук е редът за обучаемия. Ключовете за оценяване остават server-side.</p></div><select value={newBlockType} onChange={(event) => setNewBlockType(event.target.value as LessonBlockType)} className="rounded-lg border border-black/10 px-3 py-2 text-xs">{LESSON_BLOCK_TYPES.map((type) => <option key={type} value={type}>{BLOCK_LABELS[type]}</option>)}</select><button type="button" onClick={() => setEditor((value) => ({ ...value, blocks: [...value.blocks, createBlock(newBlockType, value.blocks.length)] }))} className="rounded-lg bg-[#1B4332] px-3 py-2 text-xs font-semibold text-white"><i className="ri-add-line mr-1" />Добави</button></div>
        {editor.blocks.length === 0 ? <div className="rounded-xl border border-dashed border-black/15 p-10 text-center text-sm text-black/45">Добави цел, съдържание, смислена интеракция, проверка, задача и обобщение.</div> : <div className="space-y-4">{editor.blocks.map((block, index) => <BlockEditor key={block.key} block={block} index={index} total={editor.blocks.length} onChange={(patch) => updateBlock(index, patch)} onMove={(delta) => moveBlock(index, delta)} onRemove={() => setEditor((value) => ({ ...value, blocks: value.blocks.filter((_, blockIndex) => blockIndex !== index).map((item, position) => ({ ...item, position })) }))} />)}</div>}
      </section>

      {details && <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-black/5 bg-white p-5"><h2 className="text-sm font-semibold">Публикуване и качество</h2><div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={saving || !editor.versionId} onClick={() => void changeStatus('review')} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800">Изпрати за review</button><button type="button" disabled={saving || validationErrors.length > 0 || !editor.versionId} onClick={() => void changeStatus('published')} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-35">Публикувай</button><button type="button" disabled={saving || !editor.versionId} onClick={() => void changeStatus('archived')} className="rounded-lg border border-black/10 px-3 py-2 text-xs">Архивирай</button></div><div className="mt-4 space-y-2">{validationErrors.length === 0 ? <p className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800">Няма блокиращи грешки.</p> : validationErrors.map((error) => <p key={error} className="rounded-lg bg-red-50 p-3 text-xs text-red-700"><i className="ri-error-warning-line mr-2" />{error}</p>)}</div></div><div className="rounded-xl border border-black/5 bg-white p-5"><h2 className="text-sm font-semibold">Версии и rollback</h2><div className="mt-4 max-h-64 space-y-2 overflow-auto">{details.versions?.map((version) => <div key={version.id} className="flex items-center gap-3 rounded-lg border border-black/5 p-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold">v{version.version} · {version.sourceKind}</p><p className="truncate text-[10px] text-black/45">{version.changeNote || 'Без бележка'} · {new Date(version.createdAt).toLocaleString('bg-BG')}</p></div><button type="button" onClick={() => void openLesson(details.id, version.id)} className="text-[10px] font-semibold text-blue-700">Отвори</button><button type="button" onClick={() => void rollback(version.id)} className="text-[10px] font-semibold text-amber-700">Rollback</button></div>)}</div></div></section>}

      {details?.audit && <section className="rounded-xl border border-black/5 bg-white p-5"><h2 className="text-sm font-semibold">Audit trail</h2><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="text-black/45"><tr><th className="pb-2">Действие</th><th className="pb-2">Кога</th><th className="pb-2">Кой</th><th className="pb-2">Детайли</th></tr></thead><tbody>{details.audit.map((entry, index) => <tr key={`${entry.createdAt}-${index}`} className="border-t border-black/5"><td className="py-2 font-semibold">{entry.action}</td><td className="py-2">{new Date(entry.createdAt).toLocaleString('bg-BG')}</td><td className="py-2 font-mono text-[10px]">{entry.actorId || 'migration'}</td><td className="max-w-xs truncate py-2 font-mono text-[10px]">{JSON.stringify(entry.details)}</td></tr>)}</tbody></table></div></section>}
    </>}

    {preview && <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/95 p-3 sm:p-8"><div className="mx-auto max-w-6xl"><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold text-white">Student preview · draft v{preview.version}</span><button type="button" onClick={() => setPreview(null)} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white"><i className="ri-close-line mr-1" />Затвори</button></div><LessonEngineV2 moduleId={preview.moduleId} lessonId={preview.lessonId} userId="admin-preview" lessonOverride={preview} previewMode /></div></div>}
  </div>;
}

function Stat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return <div className="rounded-xl border border-black/5 bg-white p-4"><div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-black/45"><i className={icon} />{label}</div><p className="mt-2 text-2xl font-light text-[#0A2540]">{value}</p></div>;
}

function StatusBadge({ status }: { status: LessonV2['status'] }) {
  const styles = { draft: 'bg-zinc-100 text-zinc-700', review: 'bg-blue-100 text-blue-700', published: 'bg-emerald-100 text-emerald-700', archived: 'bg-amber-100 text-amber-700' };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>{status}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="mb-4 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-black/50">{label}</span>{children}</label>;
}

function BlockEditor({ block, index, total, onChange, onMove, onRemove }: { block: LessonBlockV2; index: number; total: number; onChange: (patch: Partial<LessonBlockV2>) => void; onMove: (delta: number) => void; onRemove: () => void }) {
  return <details open className="rounded-xl border border-black/8 bg-[#FAFAF8]"><summary className="flex cursor-pointer list-none items-center gap-3 p-4"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A2540] text-xs font-bold text-white">{index + 1}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{block.title || BLOCK_LABELS[block.type]}</strong><span className="text-[10px] uppercase tracking-wider text-black/45">{BLOCK_LABELS[block.type]} · {block.key}</span></span><button type="button" aria-label="Нагоре" disabled={index === 0} onClick={(event) => { event.preventDefault(); onMove(-1); }} className="p-2 disabled:opacity-25"><i className="ri-arrow-up-line" /></button><button type="button" aria-label="Надолу" disabled={index === total - 1} onClick={(event) => { event.preventDefault(); onMove(1); }} className="p-2 disabled:opacity-25"><i className="ri-arrow-down-line" /></button><button type="button" aria-label="Премахни" onClick={(event) => { event.preventDefault(); onRemove(); }} className="p-2 text-red-600"><i className="ri-delete-bin-line" /></button></summary><div className="grid gap-4 border-t border-black/5 p-4 md:grid-cols-2"><Field label="Тип"><select value={block.type} onChange={(event) => onChange({ type: event.target.value as LessonBlockType })} className="admin-input">{LESSON_BLOCK_TYPES.map((type) => <option key={type} value={type}>{BLOCK_LABELS[type]}</option>)}</select></Field><Field label="Заглавие"><input value={block.title} onChange={(event) => onChange({ title: event.target.value })} className="admin-input" /></Field><Field label="XP точки"><input type="number" min={0} max={100} value={block.points} onChange={(event) => onChange({ points: Number(event.target.value) })} className="admin-input" /></Field><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={block.required} onChange={(event) => onChange({ required: event.target.checked })} />Задължителен за completion</label><JsonField label="Съдържание" value={block.content} onChange={(content) => onChange({ content })} /><JsonField label="Server evaluation (само админ)" value={block.evaluation || {}} onChange={(evaluation) => onChange({ evaluation })} /><JsonField label="Обратна връзка" value={block.feedback || {}} onChange={(feedback) => onChange({ feedback })} /><JsonField label="Scoring" value={block.scoring || {}} onChange={(scoring) => onChange({ scoring })} /></div></details>;
}

function JsonField({ label, value, onChange }: { label: string; value: JsonObject; onChange: (value: JsonObject) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [invalid, setInvalid] = useState(false);
  useEffect(() => { setText(JSON.stringify(value, null, 2)); setInvalid(false); }, [value]);
  return <Field label={label}><textarea value={text} onChange={(event) => {
    const next = event.target.value;
    setText(next);
    try { const parsed = JSON.parse(next); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(); onChange(parsed as JsonObject); setInvalid(false); }
    catch { setInvalid(true); }
  }} rows={9} spellCheck={false} className={`admin-input font-mono text-[11px] ${invalid ? 'border-red-400 bg-red-50' : ''}`} />{invalid && <span className="mt-1 block text-[10px] text-red-600">Невалиден JSON — няма да бъде записан.</span>}</Field>;
}
