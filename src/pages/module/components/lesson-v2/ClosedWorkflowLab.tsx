import { useState } from 'react';
import { advanceWorkflow, startWorkflow, workflowActions, workflowScenarios, type WorkflowKind } from '@/lib/silk-road-workflows';

export default function ClosedWorkflowLab({ kind }: { kind: WorkflowKind }) {
  const [state, setState] = useState(() => startWorkflow(kind));
  return <div className="mt-6 rounded-2xl border border-sky-300/25 bg-sky-950/20 p-4 sm:p-6">
    <h3 className="font-semibold text-white">Избери условие и проследи последиците</h3>
    <label className="mt-4 block text-sm text-zinc-200">Учебен случай
      <select value={state.scenario} onChange={event => setState(startWorkflow(kind, event.target.value))}
        className="mt-2 w-full rounded-xl border border-white/20 bg-[#17191e] p-3 text-white">
        {workflowScenarios[kind].map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </label>
    <div className="mt-4 flex flex-wrap gap-3">{workflowActions[kind].map(([action, label]) =>
      <button key={action} type="button" onClick={() => setState(previous => advanceWorkflow(previous, action))}
        className="rounded-xl border border-sky-200/30 px-4 py-3 text-sm text-sky-100 hover:bg-sky-300/10 focus:outline-none focus:ring-2 focus:ring-sky-300">{label}</button>)}</div>
    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div><dt className="text-zinc-400">Записи</dt><dd className="mt-1 text-xl text-white">{state.records}</dd></div>
      {kind === 'request' ? <div><dt className="text-zinc-400">Последна заявка</dt><dd className="mt-1 text-white">{state.notification ? 'Известена' : 'Неизвестена'} · {state.owner ? 'поета' : 'без отговорник'}</dd></div>
        : <div><dt className="text-zinc-400">{kind === 'checkout' ? 'Включени достъпи' : 'Публикации'}</dt><dd className="mt-1 text-xl text-white">{state.effects}</dd></div>}
    </dl>
    <div className="mt-5" role="log" aria-live="polite" aria-label="Журнал на учебните действия"><ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-200">
      {state.journal.map((entry, i) => <li key={`${i}-${entry}`}>{entry}</li>)}
    </ol></div>
    <button type="button" onClick={() => setState(startWorkflow(kind, state.scenario))} className="mt-4 text-sm text-sky-200 underline underline-offset-4">Започни случая отначало</button>
    <p className="mt-4 text-xs leading-6 text-zinc-400">Само симулация в тази страница. Проверените решения в задачите се оценяват отделно.</p>
  </div>;
}
