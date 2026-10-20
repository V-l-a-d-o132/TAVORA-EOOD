import { useState } from 'react';
import { FINAL_WORKBENCHES, FINAL_MODEL_NOTE, FINAL_MODEL_RESET, FINAL_MODEL_RESULT, finalModelInitial, runFinalModel, type FinalWorkbenchId } from '@/lib/marketing-ai-final-workbenches';
export default function MarketingAiFinalWorkbench({ id }: { id: FinalWorkbenchId }) {
  const model = FINAL_WORKBENCHES[id];
  const [caseId, setCaseId] = useState<string>(model.cases[0].id);
  const [state, setState] = useState(() => finalModelInitial(id, model.cases[0].id));
  const [journal, setJournal] = useState<{ action: string; message: string }[]>([]);
  const row = model.cases.find(c => c.id === caseId)!;
  const reset = (next: string) => { setCaseId(next); setState(finalModelInitial(id, next)); setJournal([]); };
  return <section aria-label={model.title} className="min-w-0 rounded-2xl border academy-border-strong academy-tint p-4 sm:p-5">
    <h3 className="text-lg font-semibold academy-text">{model.title}</h3>
    <p className="mt-3 text-sm leading-7 academy-body">{model.intro}</p>
    <p className="mt-3 text-xs leading-6 academy-muted">{FINAL_MODEL_NOTE}</p>
    <label className="mt-5 block text-sm font-semibold academy-text">Готов случай<select value={caseId} onChange={e => reset(e.target.value)} className="mt-2 w-full min-w-0 rounded-xl border academy-border-strong academy-raised px-3 py-3 text-sm academy-text">{model.cases.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
    <p className="mt-4 rounded-xl border academy-border academy-raised p-4 text-sm leading-7 academy-body">{row.source}</p>
    <div role="group" aria-label="Действия в учебния модел" className="mt-4 flex flex-wrap gap-3">{model.actions.map(action => <button key={action.id} type="button" onClick={() => { const result = runFinalModel(id, caseId, action.id, state); if (result) { setState(result.state); setJournal(j => [...j.slice(-5), { action: action.label, message: result.message }]); } }} className="max-w-full whitespace-normal rounded-xl border academy-border-strong academy-raised px-4 py-3 text-left text-sm font-medium academy-text focus:outline-none focus:ring-2 focus:ring-red-300">{action.label}</button>)}</div>
    {journal.length > 0 && <div role="status" aria-label={FINAL_MODEL_RESULT} className="mt-5 rounded-xl border academy-border academy-raised p-4"><h4 className="text-sm font-semibold academy-text">{FINAL_MODEL_RESULT}</h4><ol className="mt-3 space-y-3 text-sm leading-7 academy-body">{journal.map((entry, i) => <li key={i}><strong className="academy-text">{entry.action}: </strong>{entry.message}</li>)}</ol></div>}
    <button type="button" onClick={() => reset(caseId)} className="mt-4 text-sm academy-accent underline underline-offset-4">{FINAL_MODEL_RESET}</button>
  </section>;
}
