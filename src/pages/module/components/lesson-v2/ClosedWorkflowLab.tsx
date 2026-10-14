import { useState } from 'react';
import { advanceWorkflow, startWorkflow, workflowActions, workflowScenarios, type WorkflowKind } from '@/lib/silk-road-workflows';

export default function ClosedWorkflowLab({ kind }: { kind: WorkflowKind }) {
  const [state, setState] = useState(() => startWorkflow(kind));
  return <div className="mt-6 rounded-2xl border academy-info-border academy-info-bg p-4 sm:p-6">
    <h3 className="font-semibold academy-text">Избери условие и проследи последиците</h3>
    <label className="mt-4 block text-sm academy-body">Учебен случай
      <select value={state.scenario} onChange={event => setState(startWorkflow(kind, event.target.value))}
        className="mt-2 w-full rounded-xl border academy-border-strong academy-raised p-3 academy-text">
        {workflowScenarios[kind].map(([id, label]) => <option key={id} value={id}>{label}</option>)}
      </select>
    </label>
    <div className="mt-4 flex flex-wrap gap-3">{workflowActions[kind].map(([action, label]) =>
      <button key={action} type="button" onClick={() => setState(previous => advanceWorkflow(previous, action))}
        className="rounded-xl border academy-info-border px-4 py-3 text-sm academy-info hover:academy-info-bg focus:outline-none focus:ring-2 focus:ring-sky-300">{label}</button>)}</div>
    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
      <div><dt className="academy-muted">Записи</dt><dd className="mt-1 text-xl academy-text">{state.records}</dd></div>
      {kind === 'request' ? <div><dt className="academy-muted">Последна заявка</dt><dd className="mt-1 academy-text">{state.notification ? 'Известена' : 'Неизвестена'} · {state.owner ? 'поета' : 'без отговорник'}</dd></div>
        : <div><dt className="academy-muted">{kind === 'checkout' ? 'Включени достъпи' : 'Публикации'}</dt><dd className="mt-1 text-xl academy-text">{state.effects}</dd></div>}
    </dl>
    <div className="mt-5" role="log" aria-live="polite" aria-label="Журнал на учебните действия"><ol className="list-decimal space-y-2 pl-5 text-sm leading-6 academy-body">
      {state.journal.map((entry, i) => <li key={`${i}-${entry}`}>{entry}</li>)}
    </ol></div>
    <button type="button" onClick={() => setState(startWorkflow(kind, state.scenario))} className="mt-4 text-sm academy-info underline underline-offset-4">Започни случая отначало</button>
    <p className="mt-4 text-xs leading-6 academy-muted">Само симулация в тази страница. Проверените решения в задачите се оценяват отделно.</p>
  </div>;
}
