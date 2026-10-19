import { useEffect, useMemo, useState } from 'react';
import type { BlockAttemptResult, JsonObject, LessonBlockV2 } from '@/lib/lesson-engine-v2';
import { lessonBlockPresentation } from '@/lib/lesson-presentation';
import LessonRichText from './LessonRichText';
import LessonGlossary from './LessonGlossary';
import LessonOutcomes from './LessonOutcomes';
import { visibleGlossaryText } from '@/lib/academy-glossary';
import { lessonOptionOrder, usesShuffledChoices } from '@/lib/lesson-option-order';
import ClosedPracticeStudio from '@/components/academy/ClosedPracticeStudio';
import { parseClosedStudio } from '@/lib/closed-practice-studio';

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

const fieldClass = 'w-full rounded-xl border academy-border-strong academy-raised px-4 py-3 text-sm academy-text outline-none transition focus:academy-accent-border focus:ring-2 focus:ring-red-500/20';
const choiceClass = 'w-full rounded-xl border academy-border academy-tint p-4 text-left text-sm academy-body transition hover:academy-border-strong focus:outline-none focus:ring-2 focus:ring-red-500/50';

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
  const closedStudio = useMemo(() => block.type === 'matching' ? parseClosedStudio(block.content) : null, [block.type, block.content]);
  const options = useMemo(() => {
    const choices = arr(block.content.options);
    return usesShuffledChoices(moduleId) && ['quiz', 'scenario'].includes(block.type)
      ? lessonOptionOrder(choices, `${lessonId}/${block.id}`) : choices;
  }, [block.content.options, block.id, block.type, lessonId, moduleId]);
  const feedback = result?.feedback;
  const isCorrect = result?.correct;
  const { label: stepLabel } = lessonBlockPresentation(block);

  const acknowledgement = (
    <button type="button" disabled={busy || completed} onClick={() => void submit({ acknowledged: true })}
      className="mt-6 rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white transition hover:academy-primary-hover focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-default disabled:opacity-60">
      {completed ? 'Прочетено' : busy ? 'Запазване…' : 'Прочетох'}
    </button>
  );

  const renderBlock = () => {
    switch (block.type) {
      case 'objective':
        return <><LessonOutcomes content={{ ...block.content, body: body || s(block.content.objective) }} />{acknowledgement}</>;
      case 'hook':
        return <><blockquote className="border-l-4 academy-accent-border pl-5 text-lg leading-relaxed academy-body">{body || s(block.content.problem)}</blockquote>{acknowledgement}</>;
      case 'concept':
      case 'rich_text':
        return <><LessonRichText content={block.content} allowCode={moduleId?.startsWith('s01-')} allowVideoLab={moduleId?.startsWith('s02-')} allowMarketingAi={moduleId?.startsWith('s03-')} />{acknowledgement}</>;
      case 'before_after': {
        const before = obj(block.content.before);
        const after = obj(block.content.after);
        return <><div className="grid gap-4 md:grid-cols-2"><section className="rounded-2xl border academy-accent-border academy-accent-bg p-5"><span className="text-xs font-bold uppercase tracking-[.2em] academy-accent">{s(before.label, 'Преди')}</span><p className="mt-3 leading-7 academy-body">{s(before.text)}</p></section><section className="rounded-2xl border academy-success-border academy-success-bg p-5"><span className="text-xs font-bold uppercase tracking-[.2em] academy-success">{s(after.label, 'След')}</span><p className="mt-3 leading-7 academy-body">{s(after.text)}</p></section></div>{acknowledgement}</>;
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
          }} className={`${choiceClass} block`}><span className="flex items-center justify-between font-semibold academy-text"><span>{index + 1}. {s(step.title)}</span><i aria-hidden className={open ? 'ri-subtract-line' : 'ri-add-line'} /></span>{open && <span className="mt-3 block leading-7 academy-body">{s(step.text)}</span>}</button>;
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
          }} className="min-h-40 rounded-2xl border academy-border bg-gradient-to-br from-[var(--academy-tint)] to-transparent p-6 text-left focus:outline-none focus:ring-2 focus:ring-red-500/50"><span className="text-xs font-semibold uppercase tracking-[.18em] academy-accent">{block.key === 'model_solution' ? (flipped ? 'Примерно решение' : 'Сравни работата си') : (flipped ? 'Обяснение' : 'Понятие')}</span><span className="mt-4 block text-lg font-semibold leading-7 academy-text">{flipped ? s(card.back) : s(card.front)}</span><span className="mt-5 block text-xs academy-subtle">Натисни, за да обърнеш картата</span></button>;
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
        return <><ol className="space-y-3">{order.map((id, index) => <li key={id} className="flex items-center gap-3 rounded-xl border academy-border academy-tint p-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full academy-accent-bg text-sm font-bold academy-accent">{index + 1}</span><span className="min-w-0 flex-1 text-sm academy-body">{s(byId.get(id)?.text)}</span><button type="button" aria-label="Премести нагоре" disabled={index === 0} onClick={() => move(index, -1)} className="rounded-lg p-2 hover:academy-tint-strong disabled:opacity-25"><i className="ri-arrow-up-line" /></button><button type="button" aria-label="Премести надолу" disabled={index === order.length - 1} onClick={() => move(index, 1)} className="rounded-lg p-2 hover:academy-tint-strong disabled:opacity-25"><i className="ri-arrow-down-line" /></button></li>)}</ol><button type="button" onClick={() => void submit({ order })} disabled={busy} className="mt-5 rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Провери подредбата</button></>;
      }
      case 'matching': {
        if (closedStudio) return <ClosedPracticeStudio studio={closedStudio} state={state} busy={busy} completed={completed} onChange={update} onSubmit={payload => void submit(payload)} />;
        const left = arr(block.content.left);
        const candidates = arr(block.content.right);
        const right = moduleId?.startsWith('s01-') || (['s02-m01', 's02-m02', 's02-m03'].includes(moduleId || '') && block.key.startsWith('checkpoint_video_'))
          ? lessonOptionOrder(candidates, `${lessonId}/${block.id}/matching`) : candidates;
        const matches = obj(state.matches);
        return <>{body && <p className="mb-5 whitespace-pre-line text-base leading-7 academy-body">{body}</p>}<div className="space-y-4">{left.map((item, index) => {
          const id = s(item.id, String(index));
          return <label key={id} className="grid gap-2 rounded-xl border academy-border p-4 md:grid-cols-[1fr_1fr] md:items-center"><span className="text-sm font-medium academy-body">{s(item.text)}</span><select aria-label={`Свържи ${s(item.text)}`} value={s(matches[id])} onChange={(event) => update({ matches: { ...matches, [id]: event.target.value } })} className={fieldClass}><option value="">Избери понятие</option>{right.map((candidate, rightIndex) => <option key={s(candidate.id, String(rightIndex))} value={s(candidate.id, String(rightIndex))}>{s(candidate.text)}</option>)}</select></label>;
        })}</div><button type="button" disabled={busy || Object.keys(matches).length < left.length} onClick={() => void submit({ matches })} className="mt-5 rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-40">Провери връзките</button></>;
      }
      case 'image_hotspot': {
        const hotspots = arr(block.content.hotspots);
        const imageUrl = s(block.content.imageUrl);
        return <div><div className="relative overflow-hidden rounded-2xl border academy-border academy-raised">{imageUrl ? <img loading="lazy" decoding="async" width={1600} height={900} src={imageUrl} alt={s(block.content.alt, 'Учебно изображение')} className="aspect-video w-full object-cover" /> : <div className="flex aspect-video items-center justify-center text-sm academy-subtle">Изображението се подготвя</div>}{hotspots.map((spot, index) => <button key={s(spot.id, String(index))} type="button" aria-label={s(spot.label, `Зона ${index + 1}`)} onClick={() => void submit({ selected: s(spot.id, String(index)) })} className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 academy-border-strong academy-primary font-bold text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300/50" style={{ left: `${n(spot.x, 50)}%`, top: `${n(spot.y, 50)}%` }}>{index + 1}</button>)}</div><p className="mt-3 text-sm academy-muted">{s(block.content.instruction, 'Избери правилната зона върху изображението.')}</p></div>;
      }
      case 'decision_tree':
      case 'scenario':
      case 'client_simulation':
        return <div><p className="mb-5 whitespace-pre-line text-base leading-7 academy-body">{s(block.content.prompt, body)}</p><div className="space-y-3">{options.map((option, index) => {
          const id = s(option.id, String(index));
          return <button key={id} type="button" aria-pressed={s(state.selected) === id} disabled={busy || completed || feedback?.complete === true} onClick={() => { update({ selected: id }); void submit({ selected: id }); }} className={`${choiceClass} ${s(state.selected) === id ? 'academy-accent-border academy-accent-bg' : ''}`}>{s(option.label)}</button>;
        })}</div></div>;
      case 'case_study':
      case 'example':
        return <><div className="rounded-2xl border academy-warning-border academy-warning-bg p-5"><p className="whitespace-pre-line leading-7 academy-body">{body || s(block.content.case)}</p>{s(block.content.solution) && <div className="mt-5 border-t academy-border pt-4"><span className="text-xs font-bold uppercase tracking-widest academy-warning">Решение</span><p className={`mt-2 leading-7 academy-body${moduleId?.startsWith('s01-') ? ' whitespace-pre-line' : ''}`}>{s(block.content.solution)}</p></div>}</div>{acknowledgement}</>;
      case 'checklist': {
        const items = arr(block.content.items);
        const checked = strArr(state.checked);
        return <div className="space-y-3">{items.map((item, index) => {
          const id = s(item.id, String(index));
          const active = checked.includes(id);
          return <label key={id} className="flex cursor-pointer gap-3 rounded-xl border academy-border p-4 hover:academy-border-strong"><input type="checkbox" checked={active} onChange={() => {
            const next = active ? checked.filter((key) => key !== id) : [...checked, id];
            update({ checked: next });
            const required = items.filter((candidate) => candidate.required !== false);
            if (required.every((candidate, requiredIndex) => next.includes(s(candidate.id, String(requiredIndex))))) void submit({ checked: next });
          }} className="mt-0.5 h-5 w-5 accent-red-500" /><span className="text-sm leading-6 academy-body">{s(item.text)}</span></label>;
        })}</div>;
      }
      case 'quiz': {
        const quizOptions = options;
        return <div><p className="mb-5 text-lg font-semibold leading-7 academy-text">{s(block.content.question, body)}</p><div className="space-y-3">{quizOptions.map((option, index) => {
          const id = s(option.id, String(index));
          return <button key={id} type="button" aria-pressed={s(state.answer) === id} disabled={busy || completed || feedback?.complete === true} onClick={() => { update({ answer: id }); void submit({ answer: id }); }} className={`${choiceClass} ${s(state.answer) === id ? 'academy-accent-border academy-accent-bg' : ''}`}><span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border academy-border-strong text-xs font-bold">{String.fromCharCode(65 + index)}</span>{s(option.label)}</button>;
        })}</div></div>;
      }
      case 'course_exam': {
        const questions = arr(block.content.questions);
        const answers = obj(state.answers);
        const answered = questions.filter((question) => typeof answers[s(question.id)] === 'string').length;
        const weakModules = strArr(feedback?.weakModules).filter((moduleId) => /^s\d{2}-m\d{2}$/.test(moduleId));
        const reviewMap = obj(block.content.reviewMap);
        const reviewNumbers = obj(block.content.reviewNumbers);
        const groupResults = arr(feedback?.groupResults);
        const minimumGroupPercent = n(block.content.minimumGroupPercent);
        return <div>
          <p className="mb-4 leading-7 academy-body">{s(block.content.introduction)}</p>
          <p className="mb-6 rounded-xl border academy-border academy-tint p-4 text-sm academy-body">Отговорени: {answered} от {questions.length}. Нужно е поне {n(block.content.minimumPercent, 80)}% в един пълен опит.{minimumGroupPercent > 0 && ` Изискват се и поне ${minimumGroupPercent}% във всяка тематична група.`}</p>
          <div className="space-y-8">{questions.map((question, index) => {
            const questionId = s(question.id, `q${index + 1}`);
            return <fieldset key={questionId} className="rounded-2xl border academy-border p-4 sm:p-5">
              <legend className="px-2 text-base font-semibold leading-7 academy-text">{index + 1}. {s(question.prompt)}</legend>
              <div className="mt-3 space-y-3">{(usesShuffledChoices(moduleId)
                ? lessonOptionOrder(arr(question.options), `${lessonId}/${block.id}/${questionId}/exam`)
                : arr(question.options)).map((option, optionIndex) => {
                const optionId = s(option.id, String(optionIndex));
                return <label key={optionId} className={`${choiceClass} flex cursor-pointer items-start gap-3 ${answers[questionId] === optionId ? 'academy-accent-border academy-accent-bg' : ''}`}>
                  <input type="radio" name={`${block.id}-${questionId}`} value={optionId} checked={answers[questionId] === optionId} disabled={busy || completed} onChange={() => update({ answers: { ...answers, [questionId]: optionId } })} className="mt-1 h-4 w-4 shrink-0 accent-red-500" />
                  <span>{s(option.label)}</span>
                </label>;
              })}</div>
            </fieldset>;
          })}</div>
          <button type="button" disabled={busy || completed || answered !== questions.length} onClick={() => void submit({ answers })} className="mt-7 rounded-xl academy-primary px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? 'Оценяване…' : 'Предай целия изпит'}</button>
          {result && <div className="mt-5 rounded-xl border academy-border-strong p-4 text-sm academy-body">
            <strong>Резултат: {n(feedback?.scorePercent)}%</strong><span className="ml-2">({n(feedback?.correctCount)} от {n(feedback?.totalQuestions)})</span>
            {groupResults.length > 0 && <ul aria-label="Резултати по тематични групи" className="mt-4 space-y-3">{groupResults.map((group, index) =>
              <li key={index} className={`rounded-lg border p-3 ${group.passed === true ? 'academy-success-border academy-success' : 'academy-warning-border academy-warning'}`}>
                <span className="block font-medium">{s(group.label)}</span>
                <span>{n(group.correctCount)}/{n(group.totalQuestions)} · {n(group.scorePercent)}% · {group.passed === true ? 'покрит минимум' : `нужни са поне ${n(group.minimumPercent)}%`}</span>
              </li>)}</ul>}
            {feedback?.criticalPassed === false && <p className="mt-4 academy-warning">{moduleId === 's02-m15' ? 'Има непокрито критично решение за звук, достоверност или права.' : 'Има непокрито критично решение за плащане, достъп или публикуване.'} Прегледай посочените теми, дори общият процент да е достатъчен.</p>}
            {weakModules.length > 0 && <div className="mt-4"><p className="font-medium">Теми за повторение:</p><ul className="mt-2 space-y-2">{weakModules.map((moduleId) =>
              <li key={moduleId}><a href={`/module/${moduleId}`} className="underline underline-offset-4 hover:academy-text">Модул {String(n(reviewNumbers[moduleId], Number(moduleId.slice(-2)))).padStart(2, '0')}{s(reviewMap[moduleId]) ? ` · ${s(reviewMap[moduleId])}` : ''}</a></li>)}</ul></div>}
          </div>}
        </div>;
      }
      case 'calculator':
      case 'prompt_builder':
      case 'practical_response':
      case 'reflection':
      case 'homework':
      case 'submission':
        return <p className="leading-7 academy-body">Този стар тип задача е спрян. Използвай актуалната версия на урока с предоставени материали и затворени избори.</p>;
      case 'summary':
        return <><ul className="space-y-3">{strArr(block.content.takeaways).map((takeaway) => <li key={takeaway} className="flex gap-3 leading-7 academy-body"><i className="ri-check-line mt-1 academy-success" />{takeaway}</li>)}</ul>{(!moduleId?.startsWith('s01-') || s(block.content.nextStep, body)) && <div className="mt-6 rounded-2xl border academy-accent-border academy-accent-bg p-5"><span className="text-xs font-bold uppercase tracking-widest academy-accent">Следваща стъпка</span><p className="mt-2 leading-7 academy-text">{s(block.content.nextStep, body)}</p></div>}{acknowledgement}</>;
      default:
        return <><p className="leading-7 academy-body">{body}</p>{acknowledgement}</>;
    }
  };

  const statusMessage = useMemo(() => {
    if (!result) return null;
    if (isCorrect === true) return { tone: 'academy-success-border academy-success-bg academy-success', icon: 'ri-checkbox-circle-line', title: 'Точно така' };
    if (isCorrect === false) return { tone: 'academy-warning-border academy-warning-bg academy-warning', icon: 'ri-error-warning-line', title: 'Опитай отново с тази насока' };
    return { tone: 'academy-info-border academy-info-bg academy-info', icon: 'ri-save-3-line', title: 'Запазено' };
  }, [isCorrect, result]);

  return <section aria-labelledby={`block-${block.key}`} className={`min-w-0 break-words rounded-3xl border academy-border bg-gradient-to-b from-[var(--academy-gradient-start)] to-[var(--academy-gradient-end)] p-5 shadow-2xl academy-shadow ${block.type === 'objective' ? 'sm:p-6 md:p-7' : 'sm:p-7 md:p-9'}`}>
    <header className="mb-5 flex items-start justify-between gap-4"><div className="min-w-0"><span className="text-[11px] font-bold uppercase tracking-[.2em] academy-accent">{stepLabel}</span><h2 id={`block-${block.key}`} className="mt-2 text-2xl font-semibold leading-tight academy-text sm:text-[1.7rem]">{block.title}</h2></div>{block.points > 0 && <span aria-label={`${block.points} XP`} className="shrink-0 rounded-full border academy-warning-border academy-warning-bg px-3 py-1 text-xs font-semibold academy-warning">+{block.points} XP</span>}</header>
    {block.type !== 'objective' && <LessonGlossary text={visibleGlossaryText(block.title, block.content)} />}
    {renderBlock()}
    {error && <div role="alert" className="mt-5 rounded-xl border academy-accent-border academy-accent-bg p-4 text-sm academy-error"><i className="ri-error-warning-line mr-2" />{error}</div>}
    {statusMessage && <div role="status" aria-live="polite" className={`mt-5 rounded-xl border p-4 text-sm ${statusMessage.tone}`}><p className="font-semibold"><i className={`${statusMessage.icon} mr-2`} />{statusMessage.title}</p>{s(feedback?.explanation) && <p className="mt-2 leading-6 opacity-90">{s(feedback?.explanation)}</p>}
      {!!arr(feedback?.details).length && <ul aria-label="Разбор на решенията" className="mt-4 space-y-3">{arr(feedback?.details).map((detail, index) => <li key={index} className="rounded-lg border academy-border academy-raised p-3 academy-body">
        <p className="font-semibold academy-text">{s(detail.label)}</p><p className="mt-1 text-xs font-semibold">{detail.correct === true ? 'По условията на случая' : 'Нуждае се от поправка'}</p><p className="mt-2 leading-6">{s(detail.note)}</p>
      </li>)}</ul>}{isCorrect === false && <button type="button" onClick={() => setResult(null)} className="mt-3 font-semibold underline underline-offset-4">Нов опит</button>}</div>}
  </section>;
}
