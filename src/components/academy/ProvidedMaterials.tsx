import { useEffect, useRef, useState } from 'react';
import { applyToolAction, initialToolLab, materialContrast, type ProvidedMaterials as Materials, type ToolAction } from '@/lib/provided-materials';

function ToolQueue() {
  const [state, setState] = useState(initialToolLab);
  const actions: [ToolAction, string][] = [['read', 'Прочети О-2'], ['create', 'Създай D-41'], ['inspect', 'Провери D-41'], ['repeat', 'Повтори със същия ключ'], ['send', 'Опитай изпращане']];
  return <section className="mt-5 space-y-3 rounded-xl border academy-border p-4" aria-label="Учебна опашка за чернови">
    <p className="font-semibold academy-text">Извикай ограничен инструмент</p>
    <p className="text-sm leading-6 academy-body">Изпълни операция, провери отговора и опитай повторение. Това е местен модел на опашка с един запис; няма връзка с клиентска система.</p>
    <div className="flex flex-wrap gap-2">{actions.map(([action, label]) => <button key={action} type="button" onClick={() => setState(current => applyToolAction(current, action))} className="rounded-lg border academy-border-strong px-3 py-2 text-sm academy-text focus:outline-none focus:ring-2 focus:ring-sky-300">{label}</button>)}</div>
    <ol aria-live="polite" aria-label="Журнал на извикванията" className="space-y-2 break-words text-sm leading-6 academy-body">{state.messages.map((message, index) => <li key={index}><code>{message}</code></li>)}</ol>
    <button type="button" onClick={() => setState(initialToolLab())} className="text-sm underline academy-muted">Изчисти учебната опашка</button>
  </section>;
}

export default function ProvidedMaterials({ materials }: { materials: Materials }) {
  const [selected, setSelected] = useState(0);
  const item = materials.items[Math.min(selected, materials.items.length - 1)];
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => { player.current?.pause(); }, [selected]);
  const clip = item.variant === 'opening' ? [0, 5] : item.variant === 'action' ? [8, 16] : [25, 31];
  return <section aria-label={materials.title || 'Предоставени материали'} className="my-5 min-w-0 rounded-2xl border academy-border-strong p-4 sm:p-5">
    <h3 className="text-base font-semibold academy-text">{materials.title || 'Предоставени материали'}</h3>
    <p className="mt-2 whitespace-pre-line text-sm leading-6 academy-body">{materials.instruction}</p>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Избери материал">{materials.items.map((choice, index) => <button key={index} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 ${selected === index ? 'academy-info-border academy-info-bg academy-text' : 'academy-border academy-body'}`}>{choice.label}</button>)}</div>
    <article aria-label={item.label} className="mt-4 min-w-0 space-y-4">
      {item.view === 'phone' ? <div className="mx-auto max-w-[300px] rounded-2xl border academy-border-strong p-4 academy-raised"><p className="mb-3 text-xs academy-muted">Учебен екран · 300 px</p><div className={item.variant === 'cropped' ? 'h-20 overflow-hidden' : ''}><p className={`whitespace-pre-line break-words academy-text ${item.variant === 'small' ? 'text-[11px] leading-4' : 'text-base leading-7'}`}>{item.body}</p></div></div>
        : item.body && <p className="whitespace-pre-line break-words text-sm leading-7 academy-body">{item.body}</p>}
      {item.view === 'contrast' && <><div className="rounded-lg p-4 text-base" style={{ color: item.foreground, background: item.background }}>Цена след диагностика. Часът се потвърждава от техник.</div><p className="text-sm academy-body">{item.foreground} върху {item.background} · изчислен контраст <strong>{materialContrast(item.foreground, item.background).toFixed(2)}:1</strong>. За обичайния текст сравняваме с 4,5:1.</p></>}
      {item.view === 'clip' && <><video ref={player} key={selected} controls playsInline preload="metadata" muted src="/academy-labs/perfect-video/practical/coffee-machine.mp4" poster="/academy-labs/perfect-video/practical/coffee-poster.jpg" onLoadedMetadata={() => { if (player.current) player.current.currentTime = clip[0]; }} onTimeUpdate={() => { if (player.current && player.current.currentTime >= clip[1]) player.current.pause(); }} aria-label={`Учебен фрагмент: ${item.label}`} className="aspect-video w-full rounded-xl bg-black" /><p className="text-xs leading-5 academy-muted">Разглеждай {clip[0]}–{clip[1]} сек. от предоставения запис. При нужда използвай лентата за време. Описанието на видимото действие е в текста над записа.</p></>}
      {item.code && <pre tabIndex={0} className="overflow-x-auto rounded-lg border academy-border academy-raised p-4 text-sm leading-6 academy-text" aria-label="Предоставен код или журнал"><code>{item.code}</code></pre>}
      {!!item.rows.length && <div role="region" aria-label={`Таблица: ${item.label}`} tabIndex={0} className="overflow-x-auto rounded-lg border academy-border"><table className="w-full min-w-[25rem] border-collapse text-left text-sm"><thead><tr>{item.columns.map((column, i) => <th key={i} scope="col" className="academy-tint px-3 py-3 font-semibold academy-text">{column}</th>)}</tr></thead><tbody>{item.rows.map((row, i) => <tr key={i} className="border-t academy-border">{row.map((cell, j) => <td key={j} className="px-3 py-3 align-top leading-6 academy-body">{cell}</td>)}</tr>)}</tbody></table></div>}
    </article>
    {materials.toolLab && <ToolQueue />}
    <p className="mt-4 text-xs leading-5 academy-muted">Предоставен учебен материал. Разглеждането му не е оценка; решенията се проверяват в задачата. Не въвеждаш собствени данни.</p>
  </section>;
}
