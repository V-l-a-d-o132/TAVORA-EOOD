import ThemeSelector from '@/components/academy/ThemeSelector';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SILK_PRACTICE_CASES, SILK_START_QUESTIONS, SILK_START_TERMS } from '@/data/silk-road-start';
import { SILK_PLAN_FIELDS, buildSilkPrototype, buildSilkWorkbook, checkSilkPlan, emptySilkPlan, type SilkCheck, type SilkPagePlan } from '@/lib/silk-road-practice';
import { readSilkLabDraft, saveSilkLabDraft } from '@/lib/silk-lab-draft';
import inquiries from '@/data/silk-road-packet/inquiries.csv?raw';
import advertUrl from '@/data/silk-road-packet/old-advert.svg?url';
import voiceUrl from '@/data/silk-road-packet/voicemail.wav?url';
import transcript from '@/data/silk-road-packet/voicemail-transcript.txt?raw';

const fieldClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-raised px-4 py-3 academy-text focus:outline-none focus:ring-2 focus:ring-red-400';
const buttonClass = 'rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white hover:academy-primary-hover focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-default disabled:opacity-40';
const linkClass = 'academy-accent underline underline-offset-4 hover:academy-accent';

export default function SilkRoadStartPage() {
  const [goal, setGoal] = useState('website');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [diagnosed, setDiagnosed] = useState(false);
  const [initialDraft] = useState(readSilkLabDraft);
  const [caseIndex, setCaseIndex] = useState(initialDraft.caseIndex);
  const [plans, setPlans] = useState(initialDraft.plans);
  const [storageReady, setStorageReady] = useState(true);
  const [checks, setChecks] = useState<SilkCheck[] | null>(null);
  const [executed, setExecuted] = useState<SilkCheck[] | null>(null);
  const [verified, setVerified] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [height, setHeight] = useState(1250);
  const frame = useRef<HTMLIFrameElement>(null);
  const pending = useRef<string | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const study = SILK_PRACTICE_CASES[caseIndex];
  const plan = plans[study.id];
  const prototype = useMemo(() => buildSilkPrototype(study, plan), [study, plan]);
  const passed = checks?.every(item => item.passed) && executed?.every(item => item.passed);

  useEffect(() => { setStorageReady(saveSilkLabDraft({ caseIndex, plans })); }, [caseIndex, plans]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (data?.type === 'tavora-silk-prototype-height' && typeof data.height === 'number' && Number.isFinite(data.height) && data.height >= 300 && data.height <= 12000) setHeight(data.height);
      if (data?.type !== 'tavora-silk-check-result' || data.requestId !== pending.current || !pending.current) return;
      if (timeout.current) clearTimeout(timeout.current);
      pending.current = null;
      setBusy(false);
      const ids = ['received', 'repeated', 'missing', 'failure'];
      const valid = Array.isArray(data.results) && data.results.length === ids.length && ids.every((id, index) => data.results[index]?.id === id && typeof data.results[index]?.passed === 'boolean' && typeof data.results[index]?.label === 'string' && typeof data.results[index]?.help === 'string');
      if (!valid || data.error) { setError('Прототипът не върна пълна проверка. Презареди упражнението и опитай отново.'); return; }
      setExecuted(data.results);
      if (checkSilkPlan(study, plan).every(item => item.passed) && data.results.every((item: SilkCheck) => item.passed)) setVerified(previous => [...new Set([...previous, study.id])]);
    };
    window.addEventListener('message', receive);
    return () => { window.removeEventListener('message', receive); if (timeout.current) clearTimeout(timeout.current); };
  }, [study, plan]);

  const change = (key: keyof SilkPagePlan, value: string) => {
    pending.current = null; if (timeout.current) clearTimeout(timeout.current);
    setBusy(false); setChecks(null); setExecuted(null); setError('');
    setVerified(previous => previous.filter(id => id !== study.id));
    setPlans(previous => ({ ...previous, [study.id]: { ...previous[study.id], [key]: value } }));
  };

  const run = () => {
    if (!frame.current?.contentWindow) return;
    setChecks(checkSilkPlan(study, plan)); setExecuted(null); setError(''); setBusy(true);
    const requestId = crypto.randomUUID(); pending.current = requestId;
    frame.current.contentWindow.postMessage({ type: 'tavora-silk-check', requestId }, '*');
    timeout.current = setTimeout(() => { if (pending.current !== requestId) return; pending.current = null; setBusy(false); setError('Проверката не получи отговор. Изчакай зареждането на прототипа и опитай отново.'); }, 10000);
  };

  const chooseCase = (index: number) => {
    pending.current = null; if (timeout.current) clearTimeout(timeout.current);
    setBusy(false); setCaseIndex(index); setChecks(null); setExecuted(null); setError('');
  };

  const resetPlan = () => {
    pending.current = null; if (timeout.current) clearTimeout(timeout.current);
    setBusy(false); setChecks(null); setExecuted(null); setError('');
    setVerified(previous => previous.filter(id => id !== study.id));
    setPlans(previous => ({ ...previous, [study.id]: emptySilkPlan() }));
  };

  const downloadWorkbook = () => {
    const url = URL.createObjectURL(new Blob([buildSilkWorkbook(study, plan)], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `tavora-${study.id}-lab.html`;
    document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const renderChecks = (items: SilkCheck[]) => <ul className="space-y-3">{items.map(item => <li key={item.id} className={`rounded-xl border p-4 ${item.passed ? 'academy-success-border academy-success-bg' : 'academy-warning-border academy-warning-bg'}`}><p className="font-medium">{item.passed ? 'Преминато' : 'Нужна е поправка'}: {item.label}</p>{!item.passed && <p className="mt-2 text-sm leading-6 academy-body">{item.help}</p>}</li>)}</ul>;

  return <main className="min-h-screen academy-bg academy-text">
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12"><div className="mb-4 flex justify-end"><ThemeSelector /></div>
      <Link to="/kurs" className={`text-sm ${linkClass}`}>Обратно към Академията</Link>
      <Link to="/academy-tools/silk-road" className={`ml-5 inline-block text-sm ${linkClass}`}>Инструменти и подготовка на изображения</Link>
      <header className="mb-10 mt-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[.15em] academy-accent">Пътят на коприната · начален маршрут</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">Започни с една полезна задача</h1>
        <p className="mt-5 text-lg leading-8 academy-body">Ще сравниш няколко източника, ще подготвиш страница за конкретна услуга и ще провериш дали запитването се получава правилно. После ще приложиш наученото към друг бизнес.</p>
        <p className="mt-4 text-sm leading-7 academy-muted">Първият опит работи без покупка, карта, външен AI акаунт или човешки оценител. Всички бизнеси и данни са измислени. Работиш с готови материали и избори на тази страница — и на телефон. Не качваш файлове и не пишеш свободни отговори.</p>
      </header>
      <nav aria-label="Начален маршрут" className="mb-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">{[['start', '1. Откъде започваш'], ['packet', '2. Провери материалите'], ['project', '3. Подготви прототип'], ['result', '4. Изпитай резултата']].map(([id, label]) => <a key={id} href={`#${id}`} className={linkClass}>{label}</a>)}</nav>

      <section id="start" className="scroll-mt-6 border-t academy-border pt-8">
        <h2 className="text-2xl font-semibold">Откъде започваш</h2><p className="mt-3 max-w-3xl leading-7 academy-body">Избери цел. Отговорите по-долу помагат да намериш нужната основа. Те не са изпит и не променят резултатите ти в курса.</p>
        <label className="mt-5 block max-w-xl">За какво искаш да използваш наученото?<select value={goal} onChange={event => setGoal(event.target.value)} className={fieldClass}><option value="website">Искам да създавам страници и дигитални услуги.</option><option value="content">Искам да подготвям съдържание и предложения.</option><option value="business">Искам да подобря конкретен процес в свой бизнес.</option><option value="team">Искам да изпълнявам задания като част от екип.</option></select></label>
        <div className="mt-7 space-y-6">{SILK_START_QUESTIONS.map(question => <fieldset key={question.id} className="rounded-2xl border academy-border p-5"><legend className="px-2 font-medium leading-7">{question.question}</legend><div className="space-y-3">{question.options.map(([value, label]) => <label key={value} className="flex gap-3 leading-7"><input className="mt-1.5 h-4 w-4 shrink-0 accent-red-500" type="radio" name={question.id} value={value} checked={answers[question.id] === value} onChange={() => { setAnswers(previous => ({ ...previous, [question.id]: value })); setDiagnosed(false); }} />{label}</label>)}</div>{diagnosed && <p className={`mt-4 text-sm leading-6 ${answers[question.id] === question.answer ? 'academy-success' : 'academy-warning'}`}>{answers[question.id] === question.answer ? 'Обоснован избор. ' : 'Прегледай принципа. '}{question.help}</p>}</fieldset>)}</div>
        <button className={`mt-5 ${buttonClass}`} type="button" onClick={() => setDiagnosed(true)}>Виж откъде да продължиш</button>
        {diagnosed && <div role="status" className="mt-5 rounded-xl border academy-accent-border p-5 leading-7"><p>{SILK_START_QUESTIONS.every(question => answers[question.id] === question.answer) ? 'Имаш добра начална ориентация. Продължи към материалите и прототипа.' : 'Започни с обясненията по-долу и модул 1. После повтори въпросите и продължи към задачата.'}</p><p className="mt-2 academy-body">{goal === 'content' ? 'След общата задача използвай модул 4 за съдържание и модул 6 за ясно предложение.' : goal === 'business' ? 'Използвай модули 6 и 9, за да провериш действието и измерването. Автоматизация добавяй след работещ ръчен процес.' : goal === 'team' ? 'Използвай модул 7 за обхват и предаване на работа. Пази източниците и резултатите от проверката.' : 'Продължи с модули 1 и 2; след това свържи действието с модули 6, 7 и 8.'}</p><Link className={`mt-3 inline-block ${linkClass}`} to="/module/s01-m01?lesson=0">Отвори първия урок</Link></div>}
        <details className="mt-6 rounded-xl border academy-border p-5"><summary className="cursor-pointer font-semibold">Основните понятия с прости думи</summary><dl className="mt-5 grid gap-5 sm:grid-cols-2">{SILK_START_TERMS.map(([term, description]) => <div key={term}><dt className="font-semibold academy-text">{term}</dt><dd className="mt-1 text-sm leading-7 academy-body">{description}</dd></div>)}</dl></details>
      </section>

      <section id="packet" className="mt-12 scroll-mt-6 border-t academy-border pt-8">
        <h2 className="text-2xl font-semibold">Провери материалите</h2>
        <p className="mt-3 leading-7 academy-body">Сравни актуалните условия, старата обява и въпроса от посетителя. В таблицата има повторен номер. Всички данни са учебни и са предоставени тук.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">{SILK_PRACTICE_CASES.map(item => <section key={item.id} className="rounded-xl border academy-border p-5">
          <h3 className="font-semibold">{item.name}</h3><p className="mt-2 text-xs academy-muted">Утвърдени учебни условия · 03.10.2026</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 academy-body">{item.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
        </section>)}</div>
        <figure className="mt-6"><img src={advertUrl} alt="Стара учебна обява за диагностика на велосипед за 20 евро, изтекла на 30 септември 2026 г." className="w-full max-w-xl rounded-xl" /><figcaption className="mt-2 text-sm academy-muted">Старата обява не отменя актуалните условия.</figcaption></figure>
        <div className="mt-6 overflow-x-auto rounded-xl border academy-border" role="region" aria-label="Осем учебни запитвания" tabIndex={0}>
          <table className="w-full min-w-[42rem] text-left text-sm"><caption className="p-3 text-left font-semibold">Осем реда с учебни запитвания</caption>
            <thead><tr>{['Номер', 'Контакт', 'Въпрос'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead>
            <tbody>{inquiries.trim().split('\n').slice(1).map((line, index) => { const cells = line.split(','); return <tr key={index} className="border-t academy-border"><td className="p-3">{cells[0]}</td><td className="p-3">{cells[3]}</td><td className="p-3">{cells[5]}</td></tr>; })}</tbody>
          </table>
        </div>
        <audio controls preload="none" src={voiceUrl} aria-label="Синтетичен учебен запис" className="mt-5 w-full max-w-xl" />
        <details className="mt-4 rounded-xl border academy-border p-4"><summary className="cursor-pointer">Текстова алтернатива на аудиото</summary><p className="mt-3 whitespace-pre-line text-sm leading-7 academy-body">{transcript}</p></details>
      </section>

      <section id="project" className="mt-12 scroll-mt-6 border-t academy-border pt-8">
        <h2 className="text-2xl font-semibold">Подготви прототип</h2><p className="mt-3 leading-7 academy-body">Текущ случай: <strong className="academy-text">{study.name}</strong>. {study.question}</p>
        <p className="mt-3 text-sm leading-7 academy-muted">Изборите ти променят страницата и поведението на формата. Първо направи собствен опит. След проверката ще видиш конкретната поправка.</p>
        <p aria-live="polite" className="mt-3 text-sm leading-6 academy-muted">{!storageReady ? 'Браузърът не позволява запазване. Работата продължава в тази страница; свали тетрадката преди затваряне.' : initialDraft.restored ? 'Възстановени са последните учебни избори. Изпитай прототипа отново; запазена чернова не означава премината проверка.' : 'Плановете за двата случая се пазят в този браузър. Резултатите от проверката са за тази сесия и не дават XP.'}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {SILK_PLAN_FIELDS.map(field => <label key={field.key}>{field.label}<select value={plan[field.key]} onChange={event => change(field.key, event.target.value)} className={fieldClass}><option value="">{field.placeholder}</option>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>)}
        </div>
        <div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={resetPlan} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-body">Изчисти плана за този случай</button><button type="button" disabled={busy} onClick={downloadWorkbook} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Изтегли работеща тетрадка · HTML</button></div>
        <p className="mt-3 text-xs leading-6 academy-muted">Тетрадката съдържа условията, избрания план, работещата форма и проверки. Отваря се като един HTML файл без интернет. Можеш да променяш предоставените избори и да изпитваш резултата отново.</p>
        <details className="mt-7 rounded-2xl border academy-border p-4" open><summary className="cursor-pointer font-semibold">Твоята страница: пробвай формата</summary><iframe ref={frame} title="Твоят учебен прототип" srcDoc={prototype} sandbox="allow-scripts allow-forms" className="mt-4 block w-full rounded-xl border-0 bg-white" style={{ height }} /></details>
      </section>

      <section id="result" className="mt-12 scroll-mt-6 border-t academy-border pt-8">
        <h2 className="text-2xl font-semibold">Изпитай резултата</h2><p className="mt-3 max-w-3xl leading-7 academy-body">Проверката сверява условията и изпълнява действия върху същата страница: нормален вход, повторение, липсващ контакт и неуспех. Използва отделни измислени записи и изчиства временния списък преди всеки случай.</p>
        <button className={`mt-5 ${buttonClass}`} disabled={busy} type="button" onClick={run}>{busy ? 'Изпитване на прототипа…' : 'Провери моя прототип'}</button>
        {error && <p role="alert" className="mt-4 academy-warning">{error}</p>}
        {checks && <div className="mt-6"><h3 className="mb-3 font-semibold">Условия и обещания</h3>{renderChecks(checks)}</div>}
        {executed && <div className="mt-6"><h3 className="mb-3 font-semibold">Действително поведение в учебната среда</h3>{renderChecks(executed)}</div>}
        {passed && <p role="status" className="mt-5 rounded-xl border academy-success-border p-5 leading-7 academy-success">Прототипът покрива проверените условия за този случай. Приложи принципите към различния бизнес.</p>}
        {caseIndex === 0 && <button className={`mt-6 ${buttonClass}`} type="button" disabled={!passed} onClick={() => chooseCase(1)}>Приложи наученото към пекарната</button>}
        {caseIndex === 1 && <button type="button" className={`mt-6 block text-sm ${linkClass}`} onClick={() => chooseCase(0)}>Върни се към работилницата</button>}
        <p className="mt-5 text-sm leading-7 academy-muted">Проверени предоставени случаи в тази сесия: {verified.length}/2. Резултатът описва учебна работа в браузъра. За външна база, изпращане на имейл, плащане и клиентско предаване са необходими отделни проверки. Учебният журнал е временен за тази сесия.</p>
        <div className="mt-8 border-t academy-border pt-6"><p className="leading-7">Продължи в курса и премини проверките по същите принципи. При вход в акаунта резултатите се пазят към урока. Старото ти завършване и XP остават в историята. Новите версии имат отделни проверки.</p><div className="mt-3 flex flex-wrap gap-x-6 gap-y-3"><Link className={linkClass} to="/module/s01-m01?lesson=3">Модул 1: проверка на източник и обещание</Link><Link className={linkClass} to="/module/s01-m02?lesson=9">Модул 2: проверка преди публикуване</Link></div></div>
      </section>
    </div>
  </main>;
}
