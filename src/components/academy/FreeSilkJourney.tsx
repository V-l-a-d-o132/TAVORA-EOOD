import { Link } from 'react-router-dom';
import { useState } from 'react';
import { buildCheckoutUrl, formatPrice, getTierById } from '@/config/pricing';
import { FREE_SILK_LESSONS, freeSilkDeviceSummary } from '@/lib/free-silk-progress';
import { restoreFreeSilkToAccount } from '@/lib/restore-free-silk';
import type { LessonProgressV2 } from '@/lib/lesson-engine-v2';

const steps = [
  { title: 'Избери полезна задача', result: 'Раздели фактите, липсващото и позволеното действие.' },
  { title: 'Сглоби ясна страница', result: 'Използвай ИИ за чернова и запази условията на услугата.' },
  { title: 'Сметни цялата работа', result: 'Сравни подготовка, поправки и проверен резултат.' },
  { title: 'Провери и предай', result: 'Проследи заявката и избери ясен обхват за предаване.' },
];

export function FreeSilkAccountRestore({ onProgress, onFinished }: { onProgress:(lesson:string,progress:LessonProgressV2)=>void; onFinished:()=>void }) {
  const [available]=useState(()=>freeSilkDeviceSummary().xp>0);
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[done,setDone]=useState(false);
  if(!available)return null;
  return <section aria-label="Запази безплатната практика в профила" className="rounded-2xl border academy-border academy-surface p-5 text-sm leading-7 academy-body">
    <p>В този браузър има решения от практиката без профил. Можеш да ги провериш отново и да запазиш преминатото в акаунта си.</p>
    <button type="button" disabled={busy||done} className="mt-3 rounded-xl academy-primary px-5 py-3 font-semibold text-white disabled:opacity-50" onClick={async()=>{setBusy(true);setMessage('');try{const r=await restoreFreeSilkToAccount(onProgress);setDone(r.needsReview.length===0);setMessage(r.needsReview.length?'Запазихме потвърденото. Част от решенията изискват нов опит в съответния урок.':r.restored?'Преминатите решения са проверени и запазени в профила.':'Няма решения от текущите версии за пренасяне.');onFinished();}catch{setMessage('Проверката прекъсна. Можеш да опиташ отново; потвърденото в профила остава.');}finally{setBusy(false);}}}>{done?'Практиката е запазена':busy?'Проверяване и запазване…':'Провери и запази в профила'}</button>
    {message&&<p role="status" className="mt-3">{message}</p>}
  </section>;
}

export function FreeSilkJourney({ completedLessons, activeLessonId, guest }: { completedLessons: string[]; activeLessonId: string; guest: boolean }) {
  const count = FREE_SILK_LESSONS.filter(id => completedLessons.includes(id)).length;
  return <section aria-label="Твоята първа работна задача" className="rounded-2xl border academy-border academy-surface p-5 academy-body">
    <p className="text-xs font-semibold uppercase tracking-wider academy-accent">Безплатен модул · 4 урока</p>
    <h2 className="mt-2 text-xl font-semibold academy-text">От нуждата на бизнеса до проверен учебен прототип</h2>
    <p className="mt-3 text-sm leading-7">Работиш с предоставеното велоателие „Педал“. Избираш, виждаш какво подготвяш и променяш решението при ново условие. Нужни са само тези уроци — без външен акаунт или качване на файл.</p>
    <Link to="/academy-labs/silk-road/start#project" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline academy-text">Пробвай учебната страница</Link>
    <details className="mt-4">
      <summary className="cursor-pointer text-sm font-semibold academy-text">Твоят маршрут: {count} от 4 урока преминати{guest ? ' на това устройство' : ''}</summary>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">{steps.map((step, i) => <li key={step.title} className="rounded-xl border academy-border academy-tint p-4" aria-current={FREE_SILK_LESSONS[i] === activeLessonId ? 'step' : undefined}>
        <Link to={`/module/s01-m01?lesson=${FREE_SILK_LESSONS[i]}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold academy-text">{completedLessons.includes(FREE_SILK_LESSONS[i]) ? <i className="ri-check-line academy-success" aria-label="Преминат" /> : <span>{i + 1}.</span>}{step.title}</Link>
        <p className="mt-1 text-sm leading-6">{step.result}</p>
      </li>)}</ol>
    </details>
    {guest && <p className="mt-3 text-xs leading-5 academy-muted">Можеш да упражняваш без регистрация. Този напредък остава в браузъра; той не е запис в профил или сертификат.</p>}
  </section>;
}

export function FreeSilkBridge({ canContinue }: { canContinue: boolean }) {
  const course = getTierById('silkRoad');
  return <section aria-label="След безплатния модул" className="space-y-5 rounded-2xl border academy-accent-border academy-card-gradient p-5 academy-body sm:p-7">
    <div><p className="text-xs font-semibold uppercase tracking-wider academy-accent">Четирите учебни урока са преминати</p>
      <h2 className="mt-2 text-2xl font-semibold academy-text">Свърза нуждата, страницата и проверката.</h2>
      <p className="mt-3 text-sm leading-7">Избра полезна услуга, сглоби учебна страница, сравни цялото време за работа и провери как се предава резултатът. В модул 2 развиваш страницата: четимост, изображения, мобилна версия и приемане по конкретни проверки.</p>
    </div>
    <p className="text-sm leading-7"><Link to="/academy-labs/silk-road/start#project" className="underline">Отвори прототипа и работния файл</Link>. Проверки в лабораторията и проверки в уроците са отделни действия.</p>
    {canContinue ? <Link to="/module/s01-m02" className="inline-flex min-h-11 items-center justify-center rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white">Продължи към модул 2: сайтът</Link> : <>
      <p className="text-sm leading-7">Курсът „Пътят на коприната“ включва {course?.moduleCount} модула и {course?.lessonCount} урока. {course && <strong className="academy-text">Цена: {formatPrice(course.price)}.</strong>}</p>
      <div className="flex flex-wrap gap-3">
        <Link to={buildCheckoutUrl('silkRoad')} className="inline-flex min-h-11 items-center justify-center rounded-xl academy-primary px-5 py-3 text-sm font-semibold text-white">Към покупка на пълния курс{course ? ` · ${formatPrice(course.price)}` : ''}</Link>
        <Link to="/kurs/ai-business-blueprint" className="inline-flex min-h-11 items-center rounded-xl border academy-border-strong px-5 py-3 text-sm font-semibold academy-text">Виж цялата програма</Link>
      </div>
      <p className="text-xs leading-6 academy-muted">Можеш да се върнеш към безплатните решения по всяко време. Преди покупка прегледай <Link to="/terms" className="underline">условията за достъп</Link>.</p>
    </>}
    <details className="rounded-xl border academy-border academy-raised p-4 text-sm leading-7">
      <summary className="cursor-pointer font-semibold academy-text">Как продължава работата в курса</summary>
      <p className="mt-3">В модул 2 подреждаш учебна страница, пазиш условията четими на телефон и проверяваш дали заявката действително е получена. След това свързваш съдържание, търсене, канали, измерване и автоматизация. Финалният модул събира обхвата, цената и приемането на услуга.</p>
      <p className="mt-3">Работиш с предоставени случаи и затворени избори; не е нужен собствен бизнес или платен инструмент за задачите. Проверките бяха по предоставени случаи; те не удостоверяват извършена клиентска услуга.</p>
    </details>
    <Link to="/module/s01-m01?lesson=l01-01" className="inline-flex min-h-11 items-center text-sm font-medium underline academy-text">Върни се към задачите от началото</Link>
  </section>;
}
