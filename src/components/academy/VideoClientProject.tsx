import { useState } from 'react';
import { VIDEO_CLIENT_PROJECT as project, VIDEO_CLIENT_ROUTE, videoClientEstimate, videoClientProposal, videoClientSrt } from '@/data/video-client-project';

const download = (name: string, content: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const tabs = ['Поръчката', 'Сглоби историята', 'Сметни работата', 'Предай резултата'] as const;
const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-select p-3 text-sm academy-text';

export default function VideoClientProject() {
  const [tab, setTab] = useState(0), [order, setOrder] = useState('process'), [caption, setCaption] = useState<'verified' | 'delivery'>('verified');
  const [extra, setExtra] = useState(false), [discount, setDiscount] = useState(false), [quote, setQuote] = useState(false), [review, setReview] = useState('pending');
  const estimate = videoClientEstimate(extra, discount, quote), base = '/academy-labs/perfect-video/first-client';
  return <section id="client-project" aria-label="Учебна поръчка V-1" className="my-8 scroll-mt-6 rounded-2xl border academy-border-strong p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-wider academy-accent">Учебен проект на TAVORA · V-1</p>
    <h2 className="mt-3 text-2xl font-semibold academy-text">От кратък клип до изпълнима услуга</h2>
    <p className="mt-3 text-sm leading-7 academy-body">„{project.name}“ е измислено кафене във {project.place}. Виж готова малка поръчка, смени монтажно решение и проследи цената на труда. Работиш с предоставени файлове и избори.</p>
    <div role="group" aria-label="Части на учебната поръчка" className="mt-5 grid gap-2 sm:grid-cols-2">{tabs.map((label, i) => <button key={label} type="button" aria-pressed={tab === i} onClick={() => setTab(i)} className={`rounded-xl border p-3 text-left text-sm font-semibold ${tab === i ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border academy-body'}`}>{i + 1}. {label}</button>)}</div>
    {tab === 0 && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <p>{project.brief}</p><p><strong className="academy-text">Какво продава изпълнителят: </strong>{project.scope}</p>
      <p>Еспресото за 2 € е предложението на учебното кафене. Цената за изработката на клипа е отделна — ще я разгледаш в „Сметни работата“.</p>
      <p><strong className="academy-text">Как помага ИИ: </strong>получаваш два сценария по брифа. Първият показва приготвяне и получаване на място; вторият добавя доставка за пет минути. Избираш изпълнимия вариант по дадените факти и редактираш останалото.</p>
      <details className="rounded-xl border academy-border p-4"><summary className="cursor-pointer font-semibold academy-text">Задание към ИИ и показан сценарий</summary><p className="mt-3">Задание: „По брифа V-1 предложи начало, действие и финал за 16 секунди. Използвай само видимото приготвяне, цена 2 € и получаване на място. Посочи липсващите сведения отделно.“</p><ol className="mt-3 list-decimal space-y-2 pl-5"><li>0–4 сек.: чашата преди приготвяне; „Време за кафе.“</li><li>4–8 сек.: видимото приготвяне; „Виж приготвянето на еспресото.“</li><li>8–12 сек.: резултатът; „Учебно предложение: еспресо за 2 €.“</li><li>12–16 сек.: задържане за финалния текст; „Получаване на място. Попитай в обекта.“</li></ol><p className="mt-3 text-xs academy-muted">Предоставен сценарий, подготвен с ИИ и редактиран за този учебен проект. Дефектният вариант за доставка е умишлено сравнение, а не измерена грешка на външен продукт.</p></details>
      <button type="button" onClick={() => setTab(1)} className="rounded-xl academy-primary px-4 py-3 font-semibold text-white">Виж двата монтажа</button>
    </div>}
    {tab === 1 && <div className="mt-5 space-y-4">
      <label className="block text-sm academy-text">Монтажна последователност<select className={selectClass} value={order} onChange={e => setOrder(e.target.value)}><option value="process">Изчакване → приготвяне → готово кафе → действие</option><option value="confusing">Готово кафе → празна чаша → приготвяне → действие</option></select></label>
      <video key={order} controls playsInline muted preload="metadata" src={`${base}/${order}.mp4`} poster="/academy-labs/perfect-video/practical/coffee-poster.jpg" aria-label="Действително монтиран учебен файл V-1" className="mx-auto max-h-[30rem] w-full rounded-xl bg-black" />
      <p className="text-sm leading-7 academy-body">{order === 'process' ? 'Действието се проследява от подготовката към резултата. Последната част дава място за следваща стъпка.' : 'Тази подредба сменя времевия ред. За бриф, който трябва да обясни процеса, върни причината преди резултата; подобен ред може да има друга творческа цел при друг бриф.'}</p>
      <label className="block text-sm academy-text">Текст за субтитрите<select className={selectClass} value={caption} onChange={e => setCaption(e.target.value as 'verified' | 'delivery')}><option value="verified">Цена 2 € и получаване на място</option><option value="delivery">Същата цена и доставка за 5 минути</option></select></label>
      <pre aria-label="Избрани субтитри V-1" className="whitespace-pre-wrap break-words rounded-xl border academy-border p-4 text-sm leading-7 academy-body">{videoClientSrt(caption)}</pre>
      <p role="status" className="text-sm leading-7 academy-body">{caption === 'verified' ? 'Текстът пази предоставените условия. Свери времената с избрания монтаж.' : 'За доставка и пет минути няма предоставен факт. ИИ вариантът се връща за редакция.'}</p>
      <div className="flex flex-wrap gap-3"><a href={`${base}/${order}.mp4`} download={`tavora-v1-${order}.mp4`} className="rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white">Изтегли показания MP4</a><button type="button" onClick={() => download(`tavora-v1-${caption}.srt`, videoClientSrt(caption), 'application/x-subrip;charset=utf-8')} className="rounded-xl border academy-border-strong px-4 py-3 text-sm academy-text">Изтегли избрания SRT</button></div>
      <p className="text-xs leading-6 academy-muted">Два предварително монтирани файла от разрешен предоставен запис; изборът сменя действителния MP4. Субтитрите са отделен SRT, а не вградени в MP4. Малкият учебен износ 360 × 640 px е за сравнение, не договорен стандарт за клиентска доставка. Не се извиква външен ИИ и не се качва файл.</p>
    </div>}
    {tab === 2 && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <p>Това е разчет за монтаж от готов материал. Всички суми са учебни, а не пазарна тарифа. Работата по заснемане се оценява отделно.</p>
      <ul className="list-disc space-y-1 pl-5">{project.work.map(([label, hours]) => <li key={label}>{label}: {hours.toLocaleString('bg-BG')} ч.</li>)}</ul>
      <div className="flex flex-wrap gap-3"><button type="button" aria-pressed={extra} onClick={() => setExtra(!extra)} className="rounded-xl border academy-border-strong px-4 py-3 academy-text">{extra ? 'Премахни' : 'Добави'} втори кръг корекции · +2 ч.</button><button type="button" aria-pressed={discount} onClick={() => setDiscount(!discount)} className="rounded-xl border academy-border-strong px-4 py-3 academy-text">{discount ? 'Премахни' : 'Добави'} отстъпка · 20 €</button></div>
      {extra && <button type="button" aria-pressed={quote} onClick={() => setQuote(!quote)} className="rounded-xl border academy-border-strong px-4 py-3 academy-text">{quote ? 'Премахни отделната оценка' : 'Предложи +40 € за втория кръг'}</button>}
      <div role="status" aria-label="Разчет на учебната поръчка" className="rounded-xl border academy-border p-4">
        <p>Труд: {estimate.hours} ч. × 20 € = {estimate.labor} €.</p><p>Външен разход: 20 €. Общо моделиран разход: {estimate.cost} €.</p><p>Учебна цена: {estimate.price} €. Разлика: <strong className="academy-text">{estimate.difference} €</strong> преди непосочени общи разходи и данъци.</p>
      </div>
      <p>{extra && quote ? 'Новата оценка включва още 40 € за допълнителната работа. Тя е предложение за съгласуване, а не автоматично приета от клиента цена.' : extra ? 'Още два часа изчерпват първоначалната разлика при цена 160 €. Преди да приемеш новия кръг, уточни обхвата, срока и новата оценка с клиента.' : 'Петте часа включват и разговора, прегледа и предаването. Получената сума не е равна на печалбата.'}</p>
      <p>При по-малък бюджет предложи по-малък съгласуван обхват. Пази проверката на действителния файл. ИИ може да ускори подбор и чернова; отчиташ времето за преглед и поправки.</p>
    </div>}
    {tab === 3 && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <p>Пример за разговор: „За този материал предлагам един клип и отделни субтитри с един кръг корекции. Преди старт ще потвърдим точните условия, одобряващия и срока.“</p>
      <label className="block academy-text">Получено състояние на проекта<select className={selectClass} value={review} onChange={e => setReview(e.target.value)}><option value="pending">Има чернова; клиентът още не е прегледал</option><option value="change">Клиентът иска доставка за 5 минути, но няма потвърдени условия</option><option value="accepted">Учебният журнал потвърждава правилния файл и приемането</option></select></label>
      <p role="status">{review === 'accepted' ? 'По дадения учебен журнал може да се отбележи приет резултат и да се предадат точно тези файлове. Това е статус в симулацията.' : review === 'change' ? 'Уточни доставката, преди да я добавиш. Новият обхват и срок се съгласуват; поръчката още не е приета.' : 'Покажи черновата и поискай преглед по условията. Изпратено предложение и приета работа са различни етапи.'}</p>
      <p>При предаване: одобрен MP4, проверени SRT и корица, версия и кратък списък на тестовете. Отваряш самия файл от начало до край и проверяваш текста и звука.</p>
      <button type="button" onClick={() => download('tavora-v1-uchebno-predlozhenie.txt', videoClientProposal(extra, discount, quote), 'text/plain;charset=utf-8')} className="rounded-xl academy-primary px-4 py-3 font-semibold text-white">Изтегли учебното предложение и разчета</button>
      <p className="text-xs leading-6 academy-muted">Файлът е неизпратен образец. Съдържа избрания разчет от предишната част и отбелязва поисканите допълнителни корекции.</p>
    </div>}
    <details className="mt-6 border-t academy-border pt-4"><summary className="cursor-pointer text-sm font-semibold academy-text">Как поръчката се развива през 15-те модула</summary><ol className="mt-4 space-y-3 text-sm leading-6 academy-body">{VIDEO_CLIENT_ROUTE.map(([title, result], i) => <li key={title}><a className="font-semibold academy-accent underline underline-offset-4" href={`/module/s02-m${String(i + 1).padStart(2, '0')}`}>{i + 1}. {title}</a><p>{result}</p></li>)}</ol></details>
    <p className="mt-5 text-xs leading-6 academy-muted">Работилницата е показан учебен проект без XP и запис на изпитен резултат. Независимите задачи и изпити се решават в платените уроци. Изборите остават в текущата сесия; изтеглянията са на твоето устройство.</p>
  </section>;
}
