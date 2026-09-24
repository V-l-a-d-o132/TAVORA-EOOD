import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { BlockAttemptResult, JsonObject, LessonBlockV2 } from '@/lib/lesson-engine-v2';

interface Props {
  block: LessonBlockV2;
  lessonId: string;
  moduleId?: string;
  initialState?: JsonObject;
  completed: boolean;
  onStateChange: (state: JsonObject) => void;
  onSubmit: (payload: JsonObject) => Promise<BlockAttemptResult>;
}

const s = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const n = (value: unknown, fallback = 0) => typeof value === 'number' ? value : fallback;
const arr = (value: unknown): JsonObject[] => Array.isArray(value)
  ? value.filter((item): item is JsonObject => !!item && typeof item === 'object' && !Array.isArray(item))
  : [];
const strArr = (value: unknown): string[] => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === 'string')
  : [];
const obj = (value: unknown): JsonObject => value && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};

const fieldClass = 'w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20';
const choiceClass = 'w-full rounded-xl border border-white/10 bg-white/[0.035] p-4 text-left text-sm text-zinc-200 transition hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-red-500/50';

export default function LessonBlockRenderer({ block, lessonId, moduleId, initialState, completed, onStateChange, onSubmit }: Props) {
  const [state, setState] = useState<JsonObject>(initialState || {});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<BlockAttemptResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setState(initialState || {});
    setResult(null);
    setError('');
  }, [block.key, initialState]);

  const update = (next: JsonObject) => {
    setState(next);
    onStateChange(next);
  };

  const submit = async (payload = state) => {
    setBusy(true);
    setError('');
    try {
      const response = await onSubmit(payload);
      setResult(response);
      return response;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не успяхме да проверим отговора. Опитай отново.');
      return null;
    } finally {
      setBusy(false);
    }
  };

  const body = s(block.content.body);
  const options = arr(block.content.options);
  const feedback = result?.feedback;
  const isCorrect = result?.correct;
  const isSilkRoadFoundation = ['s01-m01', 's01-m02', 's01-m03', 's01-m04', 's01-m05', 's01-m06', 's01-m07', 's01-m08'].includes(moduleId || '');
  const stepLabel = !isSilkRoadFoundation ? 'Практическа стъпка'
    : block.type === 'quiz' ? 'Проверка на знанията'
    : block.type === 'objective' ? 'Цел на урока'
    : block.type === 'practical_response' ? 'Твоите бележки'
    : block.type === 'summary' ? 'Обобщение'
    : block.key === 'practice_brief' ? 'Практическа задача'
    : block.key === 'model_solution' ? 'Решен пример'
    : 'Учебен материал';

  const acknowledgement = (
    <button type="button" disabled={busy || completed} onClick={() => void submit({ acknowledged: true })}
      className="mt-6 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-default disabled:opacity-60">
      {completed ? 'Завършено' : busy ? 'Запазване…' : 'Разбрах и мога да го приложа'}
    </button>
  );

  const renderBlock = () => {
    switch (block.type) {
      case 'objective':
        return <><p className="text-xl leading-relaxed text-white">{body || s(block.content.objective)}</p>{acknowledgement}</>;
      case 'hook':
        return <><blockquote className="border-l-4 border-red-500 pl-5 text-lg leading-relaxed text-zinc-200">{body || s(block.content.problem)}</blockquote>{acknowledgement}</>;
      case 'concept':
      case 'rich_text':
        return <><p className="whitespace-pre-line text-base leading-7 text-zinc-200">{body}</p>{arr(block.content.points).length > 0 && <ul className="mt-5 space-y-3">{arr(block.content.points).map((point, index) => <li key={s(point.id, String(index))} className="flex gap-3 text-zinc-200"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />{s(point.text)}</li>)}</ul>}{acknowledgement}</>;
      case 'before_after': {
        const before = obj(block.content.before);
        const after = obj(block.content.after);
        return <><div className="grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-red-500/25 bg-red-950/20 p-5"><span className="text-xs font-bold uppercase tracking-[.2em] text-red-300">{s(before.label, 'Преди')}</span><p className="mt-3 leading-7 text-zinc-200">{s(before.text)}</p></section><section className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-5"><span className="text-xs font-bold uppercase tracking-[.2em] text-emerald-300">{s(after.label, 'След')}</span><p className="mt-3 leading-7 text-zinc-200">{s(after.text)}</p></section></div>{acknowledgement}</>;
      }
      case 'step_reveal': {
        const steps = arr(block.content.steps);
        const revealed = strArr(state.revealed);
        return <div className="space-y-3">{steps.map((step, index) => {
          const id = s(step.id, `step-${index}`);
          const open = revealed.includes(id);
          return <button key={id} type="button" aria-expanded={open} onClick={() => {
            const next = open ? revealed : [...revealed, id];
            update({ ...state, revealed: next });
            if (next.length === steps.length) void submit({ ...state, revealed: next });
          }} className={`${choiceClass} block`}><span className="flex items-center justify-between font-semibold text-white"><span>{index + 1}. {s(step.title)}</span><i aria-hidden className={open ? 'ri-subtract-line' : 'ri-add-line'} /></span>{open && <span className="mt-3 block leading-7 text-zinc-300">{s(step.text)}</span>}</button>;
        })}</div>;
      }
      case 'flip_cards': {
        const cards = arr(block.content.cards);
        const viewed = strArr(state.viewed);
        return <div className="grid gap-4 sm:grid-cols-2">{cards.map((card, index) => {
          const id = s(card.id, `card-${index}`);
          const flipped = viewed.includes(id);
          return <button key={id} type="button" aria-pressed={flipped} onClick={() => {
            const next = flipped ? viewed : [...viewed, id];
            update({ viewed: next });
            if (next.length === cards.length) void submit({ viewed: next });
          }} className="min-h-40 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 text-left focus:outline-none focus:ring-2 focus:ring-red-500/50"><span className="text-xs font-semibold uppercase tracking-[.18em] text-red-300">{flipped ? 'Обяснение' : 'Понятие'}</span><span className="mt-4 block text-lg font-semibold leading-7 text-white">{flipped ? s(card.back) : s(card.front)}</span><span className="mt-5 block text-xs text-zinc-500">Натисни, за да обърнеш картата</span></button>;
        })}</div>;
      }
      case 'sequence_sort': {
        const source = arr(block.content.items);
        const initialOrder = strArr(state.order);
        const order = initialOrder.length ? initialOrder : source.map((item, index) => s(item.id, String(index)));
        const byId = new Map(source.map((item, index) => [s(item.id, String(index)), item]));
        const move = (index: number, delta: number) => {
          const target = index + delta;
          if (target < 0 || target >= order.length) return;
          const next = [...order];
          [next[index], next[target]] = [next[target], next[index]];
          update({ order: next });
        };
        return <><ol className="space-y-3">{order.map((id, index) => <li key={id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-sm font-bold text-red-300">{index + 1}</span><span className="min-w-0 flex-1 text-sm text-zinc-200">{s(byId.get(id)?.text)}</span><button type="button" aria-label="Премести нагоре" disabled={index === 0} onClick={() => move(index, -1)} className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-25"><i className="ri-arrow-up-line" /></button><button type="button" aria-label="Премести надолу" disabled={index === order.length - 1} onClick={() => move(index, 1)} className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-25"><i className="ri-arrow-down-line" /></button></li>)}</ol><button type="button" onClick={() => void submit({ order })} disabled={busy} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Провери подредбата</button></>;
      }
      case 'matching': {
        const left = arr(block.content.left);
        const right = arr(block.content.right);
        const matches = obj(state.matches);
        return <><div className="space-y-4">{left.map((item, index) => {
          const id = s(item.id, String(index));
          return <label key={id} className="grid gap-2 rounded-xl border border-white/10 p-4 md:grid-cols-[1fr_1fr] md:items-center"><span className="text-sm font-medium text-zinc-200">{s(item.text)}</span><select aria-label={`Свържи ${s(item.text)}`} value={s(matches[id])} onChange={(event) => update({ matches: { ...matches, [id]: event.target.value } })} className={fieldClass}><option value="">Избери понятие</option>{right.map((candidate, rightIndex) => <option key={s(candidate.id, String(rightIndex))} value={s(candidate.id, String(rightIndex))}>{s(candidate.text)}</option>)}</select></label>;
        })}</div><button type="button" disabled={busy || Object.keys(matches).length < left.length} onClick={() => void submit({ matches })} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Провери връзките</button></>;
      }
      case 'image_hotspot': {
        const hotspots = arr(block.content.hotspots);
        const imageUrl = s(block.content.imageUrl);
        return <div><div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">{imageUrl ? <img src={imageUrl} alt={s(block.content.alt, 'Учебно изображение')} className="aspect-video w-full object-cover" /> : <div className="flex aspect-video items-center justify-center text-sm text-zinc-500">Изображението се подготвя</div>}{hotspots.map((spot, index) => <button key={s(spot.id, String(index))} type="button" aria-label={s(spot.label, `Зона ${index + 1}`)} onClick={() => void submit({ selected: s(spot.id, String(index)) })} className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300/50" style={{ left: `${n(spot.x, 50)}%`, top: `${n(spot.y, 50)}%` }}>{index + 1}</button>)}</div><p className="mt-3 text-sm text-zinc-400">{s(block.content.instruction, 'Избери правилната зона върху изображението.')}</p></div>;
      }
      case 'decision_tree':
      case 'scenario':
      case 'client_simulation':
        return <div><p className="mb-5 whitespace-pre-line text-base leading-7 text-zinc-200">{s(block.content.prompt, body)}</p><div className="space-y-3">{options.map((option, index) => {
          const id = s(option.id, String(index));
          return <button key={id} type="button" disabled={busy || !!result} onClick={() => { update({ selected: id }); void submit({ selected: id }); }} className={`${choiceClass} ${s(state.selected) === id ? 'border-red-400 bg-red-500/10' : ''}`}>{s(option.label)}</button>;
        })}</div></div>;
      case 'case_study':
      case 'example':
        return <><div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5"><p className="whitespace-pre-line leading-7 text-zinc-200">{body || s(block.content.case)}</p>{s(block.content.solution) && <div className="mt-5 border-t border-white/10 pt-4"><span className="text-xs font-bold uppercase tracking-widest text-amber-300">Решение</span><p className="mt-2 leading-7 text-zinc-300">{s(block.content.solution)}</p></div>}</div>{acknowledgement}</>;
      case 'calculator':
        return <form onSubmit={(event) => { event.preventDefault(); void submit({ value: s(state.value) }); }}><p className="mb-4 leading-7 text-zinc-200">{s(block.content.prompt, body)}</p><div className="flex items-center gap-3"><input inputMode="decimal" aria-label={s(block.content.label, 'Стойност')} value={s(state.value)} onChange={(event) => update({ value: event.target.value })} className={fieldClass} placeholder={s(block.content.placeholder, '0')} /><span className="text-sm text-zinc-400">{s(block.content.unit)}</span></div><button disabled={busy || !s(state.value)} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Изчисли и провери</button></form>;
      case 'prompt_builder': {
        const fields = arr(block.content.fields);
        const values = obj(state.fields);
        return <form onSubmit={(event) => { event.preventDefault(); void submit({ fields: values }); }}><div className="space-y-4">{fields.map((field, index) => {
          const id = s(field.id, String(index));
          return <label key={id} className="block"><span className="mb-2 block text-sm font-medium text-zinc-200">{s(field.label)}</span><textarea value={s(values[id])} onChange={(event) => update({ fields: { ...values, [id]: event.target.value } })} placeholder={s(field.placeholder)} rows={3} className={fieldClass} /></label>;
        })}</div><div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4"><span className="text-xs uppercase tracking-widest text-zinc-500">Твоят prompt</span><p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-200">{fields.map((field, index) => `${s(field.label)}: ${s(values[s(field.id, String(index))])}`).join('\n')}</p></div><button disabled={busy} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Запази prompt-а</button></form>;
      }
      case 'practical_response':
      case 'reflection':
      case 'homework':
        return <form onSubmit={(event) => { event.preventDefault(); void submit({ text: s(state.text) }); }}><p className="mb-4 whitespace-pre-line leading-7 text-zinc-200">{s(block.content.prompt, body)}</p><textarea value={s(state.text)} onChange={(event) => update({ text: event.target.value })} rows={6} className={fieldClass} placeholder={s(block.content.placeholder, 'Напиши конкретен отговор…')} /><div className="mt-2 flex justify-between text-xs text-zinc-500"><span>Автоматично запазване</span><span>{s(state.text).length} / минимум {n(block.content.minLength, 20)} знака</span></div><button disabled={busy} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Предай отговора</button></form>;
      case 'checklist': {
        const items = arr(block.content.items);
        const checked = strArr(state.checked);
        return <div className="space-y-3">{items.map((item, index) => {
          const id = s(item.id, String(index));
          const active = checked.includes(id);
          return <label key={id} className="flex cursor-pointer gap-3 rounded-xl border border-white/10 p-4 hover:border-white/25"><input type="checkbox" checked={active} onChange={() => {
            const next = active ? checked.filter((key) => key !== id) : [...checked, id];
            update({ checked: next });
            const required = items.filter((candidate) => candidate.required !== false);
            if (required.every((candidate, requiredIndex) => next.includes(s(candidate.id, String(requiredIndex))))) void submit({ checked: next });
          }} className="mt-0.5 h-5 w-5 accent-red-500" /><span className="text-sm leading-6 text-zinc-200">{s(item.text)}</span></label>;
        })}</div>;
      }
      case 'quiz': {
        const quizOptions = arr(block.content.options);
        return <div><p className="mb-5 text-lg font-semibold leading-7 text-white">{s(block.content.question, body)}</p><div className="space-y-3">{quizOptions.map((option, index) => {
          const id = s(option.id, String(index));
          return <button key={id} type="button" disabled={busy || !!result} onClick={() => { update({ answer: id }); void submit({ answer: id }); }} className={`${choiceClass} ${s(state.answer) === id ? 'border-red-400 bg-red-500/10' : ''}`}><span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-xs font-bold">{String.fromCharCode(65 + index)}</span>{s(option.label)}</button>;
        })}</div></div>;
      }
      case 'submission': {
        const upload = async (file: File) => {
          setBusy(true);
          setError('');
          try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('Влез в профила си, за да качиш файл.');
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
            const path = `${userData.user.id}/${lessonId}/${block.key}/${crypto.randomUUID()}-${safeName}`;
            const { error: uploadError } = await supabase.storage.from('academy-submissions').upload(path, file, { upsert: false });
            if (uploadError) throw uploadError;
            update({ kind: 'file', value: path, fileName: file.name });
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Качването не успя.');
          } finally { setBusy(false); }
        };
        return <div><p className="mb-4 leading-7 text-zinc-200">{s(block.content.prompt, body)}</p><label className="mb-4 block"><span className="mb-2 block text-sm font-medium text-zinc-200">Линк към задачата</span><input type="url" value={s(state.kind) === 'link' ? s(state.value) : ''} onChange={(event) => update({ kind: 'link', value: event.target.value })} className={fieldClass} placeholder="https://…" /></label><label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 p-5 text-sm text-zinc-300 hover:border-red-400"><i className="ri-upload-cloud-2-line text-xl" /><span>{s(state.fileName, 'Качи PDF, DOCX или изображение')}</span><input type="file" className="sr-only" accept=".pdf,.docx,.png,.jpg,.jpeg,.txt" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></label><button type="button" disabled={busy || !s(state.value)} onClick={() => void submit({ kind: s(state.kind), value: s(state.value) })} className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Предай задачата</button></div>;
      }
      case 'summary':
        return <><ul className="space-y-3">{strArr(block.content.takeaways).map((takeaway) => <li key={takeaway} className="flex gap-3 leading-7 text-zinc-200"><i className="ri-check-line mt-1 text-emerald-400" />{takeaway}</li>)}</ul><div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5"><span className="text-xs font-bold uppercase tracking-widest text-red-300">Следваща стъпка</span><p className="mt-2 leading-7 text-white">{s(block.content.nextStep, body)}</p></div>{acknowledgement}</>;
      default:
        return <><p className="leading-7 text-zinc-200">{body}</p>{acknowledgement}</>;
    }
  };

  const statusMessage = useMemo(() => {
    if (!result) return null;
    if (isCorrect === true) return { tone: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100', icon: 'ri-checkbox-circle-line', title: 'Точно така' };
    if (isCorrect === false) return { tone: 'border-amber-500/30 bg-amber-500/10 text-amber-100', icon: 'ri-error-warning-line', title: 'Опитай отново с тази насока' };
    return { tone: 'border-sky-500/30 bg-sky-500/10 text-sky-100', icon: 'ri-save-3-line', title: 'Запазено' };
  }, [isCorrect, result]);

  return <section aria-labelledby={`block-${block.key}`} className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#15171c] to-[#101216] p-5 shadow-2xl shadow-black/20 sm:p-7 md:p-9">
    <header className="mb-7 flex items-start justify-between gap-4"><div><span className="text-[11px] font-bold uppercase tracking-[.2em] text-red-300">{stepLabel}</span><h2 id={`block-${block.key}`} className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-[1.7rem]">{block.title}</h2></div>{(!isSilkRoadFoundation || block.points > 0) && <span aria-label={`${block.points} XP`} className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">+{block.points} XP</span>}</header>
    {renderBlock()}
    {error && <div role="alert" className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100"><i className="ri-error-warning-line mr-2" />{error}</div>}
    {statusMessage && <div role="status" aria-live="polite" className={`mt-5 rounded-xl border p-4 text-sm ${statusMessage.tone}`}><p className="font-semibold"><i className={`${statusMessage.icon} mr-2`} />{statusMessage.title}</p>{s(feedback?.explanation) && <p className="mt-2 leading-6 opacity-90">{s(feedback?.explanation)}</p>}{isCorrect === false && <button type="button" onClick={() => setResult(null)} className="mt-3 font-semibold underline underline-offset-4">Нов опит</button>}</div>}
  </section>;
}
