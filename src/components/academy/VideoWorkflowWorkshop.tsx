import { useState } from 'react';
import { INITIAL_WORKFLOW, VIDEO_WORKFLOW_STAGES, WORKFLOW_CHOICES, updateVideoWorkflow, videoWorkflowDossier, videoWorkflowReview, type WorkflowStage } from '@/data/video-workflow-project';
import { videoClientSrt } from '@/data/video-client-project';

const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-select p-3 text-sm academy-text';
const save = (name: string, text: string, type = 'text/plain;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export default function VideoWorkflowWorkshop() {
  const [stage, setStage] = useState<WorkflowStage>(() => {
    const candidate = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('workflow');
    return VIDEO_WORKFLOW_STAGES.find(s => s[0] === candidate)?.[0] || 'plan';
  });
  const [state, setState] = useState({ ...INITIAL_WORKFLOW });
  const review = videoWorkflowReview(state), active = VIDEO_WORKFLOW_STAGES.find(s => s[0] === stage)!;
  return <section id="client-workflow" aria-label="Работен процес V-1" className="my-8 scroll-mt-6 rounded-2xl border academy-border-strong p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-wider academy-accent">V-1 · Модули 6–10</p>
    <h2 className="mt-3 text-2xl font-semibold academy-text">Какво оставяш за следващата стъпка?</h2>
    <p className="mt-3 text-sm leading-7 academy-body">Промени условията на измислената поръчка „Кафе пауза“ и проследи какво спира работата. Кадрите и субтитрите са предоставени. Подготовката, снимането и архивът са учебна симулация; изборът не проверява твоето устройство.</p>
    <div role="group" aria-label="Етапи на работния процес" className="mt-5 grid gap-2 sm:grid-cols-2">{VIDEO_WORKFLOW_STAGES.map(([id, label]) => <button key={id} type="button" aria-pressed={stage === id} onClick={() => setStage(id)} className={`rounded-xl border p-3 text-left text-sm font-semibold ${stage === id ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border academy-body'}`}>{label}</button>)}</div>
    <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <p>{active[3]}</p>
      {WORKFLOW_CHOICES.filter(c => c.stage === stage).map(c => <label key={c.key} className="block academy-text">{c.label}<select className={selectClass} value={state[c.key]} onChange={e => setState(s => updateVideoWorkflow(s, c.key, e.target.value))}>{c.options.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>)}
      {stage === 'plan' && <p>Базовият договор е за монтаж от предоставен материал. Новите снимки са отделна предложена работа, която изисква съгласуване.</p>}
      {stage === 'shoot' && <p>Това са дадени наблюдения в задачата. Те не променят предоставения MP4 и не означават, че ти си заснел нов дубъл.</p>}
      {stage === 'archive' && <><ul className="list-disc space-y-1 pl-5"><li>01_originals — непроменени източници</li><li>02_project — проект и опис</li><li>03_work — временни файлове и прокси</li><li>04_delivery — конкретна версия за предаване</li></ul><p>Тази подредба сама по себе си не прави резервни копия. При реален тест възстановявай в отделна папка, без да триеш единствения оригинал.</p></>}
      {stage === 'edit' && <><video key={state.edit} controls playsInline muted preload="metadata" src={`/academy-labs/perfect-video/first-client/${state.edit}.mp4`} aria-label="Монтажен износ V-1" className="mx-auto max-h-96 w-full rounded-xl bg-black" /><a href={`/academy-labs/perfect-video/first-client/${state.edit}.mp4`} download className="inline-block font-semibold academy-accent underline underline-offset-4">Изтегли този MP4</a><p>Действителни учебни износи: 16 сек., 360 × 640, без звук. Износ 25 fps от източник 15 fps. Това не е пълна клиентска доставка с нови снимки и озвучаване.</p></>}
      {stage === 'deliver' && <><pre aria-label="SRT за предаване" className="whitespace-pre-wrap break-words rounded-xl border academy-border p-3 text-sm academy-body">{videoClientSrt(state.caption)}</pre><button type="button" onClick={() => save(`V1_${state.caption}.srt`, videoClientSrt(state.caption), 'application/x-subrip;charset=utf-8')} className="rounded-xl border academy-border-strong px-4 py-3 academy-text">Изтегли този SRT</button><p aria-label="Разчет за монтажа">{review.hours} ч. × 20 € + 20 € = {review.cost} € разход. Цена {review.price} €. Разлика {review.difference} € преди непосочени общи разходи и данъци. Разчетът е само за монтаж от готов материал, без снимачната добавка.</p><p>Промяна на монтажа, субтитрите или обхвата връща версията за преглед.</p></>}
      <a className="inline-block font-semibold academy-accent underline underline-offset-4" href={`/module/s02-m${active[2].slice(2, 4)}?lesson=${active[2]}`}>Отвори началния урок за този етап</a>
      <div role="status" aria-label="Проверка на работния процес" className="rounded-xl border academy-border p-4"><p className="font-semibold academy-text">{review.issues.length ? 'Остава за решаване' : 'Условията в избрания учебен вариант са съвместими'}</p>{review.issues.length > 0 && <ul className="mt-2 list-disc space-y-2 pl-5">{review.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>}<p className="mt-3">Това е разбор на показания пример. Независимите проверявани случаи са в края на модулите; тук не се записва оценка.</p></div>
      <button type="button" onClick={() => save('V1_raboten_proces.txt', videoWorkflowDossier(state))} className="rounded-xl academy-primary px-4 py-3 font-semibold text-white">Изтегли избраното досие</button>
    </div>
  </section>;
}
