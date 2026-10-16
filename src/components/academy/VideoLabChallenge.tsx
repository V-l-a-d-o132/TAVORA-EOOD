import { VIDEO_LAB_CHALLENGES } from '@/data/video-lab-challenges';
import type { VideoLabKind } from './VideoDecisionLab';

export type VideoRehearsalState = Record<string, { choice: string; checked: string }>;
export default function VideoLabChallenge({ kind, state, onChange, onPreview }: {
  kind: VideoLabKind; state: VideoRehearsalState; onChange: (id: string, value: { choice: string; checked: string }) => void; onPreview: (variant: string) => void;
}) {
  const cases = VIDEO_LAB_CHALLENGES[kind];
  const first = cases[0], firstState = state[first.id];
  const firstPassed = firstState?.checked === firstState?.choice && first.options.some(option => option.id === firstState?.choice && option.meetsGoal);
  return <section aria-label="Приложи показаното в нов случай" className="my-8 rounded-2xl border academy-border-strong p-4 sm:p-6">
    <h2 className="text-xl font-semibold academy-text">Сега решението е твое</h2>
    <p className="mt-3 text-sm leading-7 academy-body">Два измислени случая с различно задание. Избери действие, провери основанието и го свържи с демонстрацията. Това е упражнение без XP; проверките по курса остават в уроците.</p>
    <div className="mt-5 space-y-5">{cases.map((study, index) => {
      if (index === 1 && !firstPassed) return <p key={study.id} className="rounded-xl border academy-border academy-tint p-4 text-sm leading-6 academy-muted">След обосновано решение на първия случай ще получиш ново условие.</p>;
      const answer = state[study.id] || { choice: '', checked: '' }, selected = study.options.find(option => option.id === answer.choice), checked = !!selected && answer.checked === selected.id;
      return <div key={study.id} className="rounded-xl border academy-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wider academy-accent">{index === 0 ? 'Първо задание' : 'Променено задание'}</p>
        <p className="mt-3 leading-7 academy-body">{study.context}</p>
        <fieldset className="mt-4"><legend className="mb-3 font-semibold academy-text">{study.question}</legend><div className="space-y-3">{study.options.map(option => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg border academy-border p-3 text-sm leading-6 academy-body">
          <input type="radio" name={study.id} value={option.id} checked={option.id === answer.choice} onChange={() => onChange(study.id, { choice: option.id, checked: '' })} className="mt-1 h-4 w-4 shrink-0 accent-red-600" /><span>{option.label}</span>
        </label>)}</div></fieldset>
        <div className="mt-4 flex flex-wrap gap-3"><button type="button" disabled={!selected} onClick={() => onChange(study.id, { ...answer, checked: answer.choice })} className="rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">Провери основанието</button>
          {checked && selected.preview && <button type="button" onClick={() => onPreview(selected.preview!)} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Виж свързания вариант в демонстрацията</button>}
        </div>
        {checked && <div role="status" className={`mt-4 rounded-xl border p-4 text-sm leading-7 ${selected.meetsGoal ? 'academy-success-border academy-success-bg academy-success' : 'academy-warning-border academy-warning-bg academy-warning'}`}><p className="font-semibold">{selected.meetsGoal ? 'Решението следва заданието.' : 'Прегледай какво изисква заданието.'}</p><p className="mt-2">{selected.note}</p></div>}
      </div>;
    })}</div>
  </section>;
}
