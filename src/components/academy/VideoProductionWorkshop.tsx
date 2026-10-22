import { useState } from 'react';
import { PRODUCTION_STAGES, PRODUCTION_FRAMES, PRODUCTION_LIGHTS, PRODUCTION_SOUNDS, SHOOTING_WORK, videoProductionScript, videoProductionEstimate, videoProductionDossier,
  type ProductionStage, type ScriptVersion, type FrameVersion, type LightVersion, type SoundVersion } from '@/data/video-production-project';

const names = ['Сценарий', 'Камера и кадър', 'Светлина и цвят', 'Звук'] as const;
const selectClass = 'mt-2 w-full rounded-xl border academy-border-strong academy-select p-3 text-sm academy-text';

function LightPlan({ value }: { value: LightVersion }) {
  return <figure className="rounded-xl border academy-border p-3">
    <svg viewBox="0 0 520 270" role="img" aria-label={`Схема отгоре: ${PRODUCTION_LIGHTS[value].label}`} className="mx-auto w-full max-w-2xl academy-text">
      <rect x="15" y="12" width="490" height="240" rx="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 55V170" stroke="#3b82f6" strokeWidth="10" />
      <text x="45" y="50" fill="currentColor" fontSize="32">1</text>
      <path d="M40 90L230 105M40 145L230 125" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 5" />
      <circle cx="260" cy="116" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M288 108Q317 100 315 120Q311 137 289 128" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="250" y="181" fill="currentColor" fontSize="32">2</text>
      <rect x="232" y="207" width="55" height="25" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="305" y="231" fill="currentColor" fontSize="32">3</text>
      {value === 'bounce' && <g><path d="M419 75V156" stroke="currentColor" strokeWidth="9" /><path d="M410 92L300 107M410 140L300 125" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" /><text x="413" y="57" fill="currentColor" fontSize="32">4</text></g>}
      {value === 'mixed' && <g><circle cx="425" cy="82" r="17" fill="none" stroke="currentColor" strokeWidth="5" /><path d="M410 95L300 108M425 105L300 135" stroke="currentColor" strokeWidth="3" strokeDasharray="5 5" /><text x="413" y="48" fill="currentColor" fontSize="32">4</text></g>}
    </svg>
    <ol aria-label="Легенда на светлинния план" className="mt-3 grid gap-1 text-xs leading-6 academy-body sm:grid-cols-2"><li>1. Прозорец отляво</li><li>2. Предметът</li><li>3. Камерата</li>{value !== 'window' && <li>4. {value === 'bounce' ? 'Бял отражател' : 'Друга лампа'}</li>}</ol>
    <figcaption className="mt-2 text-xs leading-6 academy-muted">Схема на разположението. Не изчислява светлина, точен цвят или резултат от действително заснемане.</figcaption>
  </figure>;
}

export default function VideoProductionWorkshop() {
  const [stage, setStage] = useState<ProductionStage>(() => {
    const requested = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('stage');
    return PRODUCTION_STAGES.includes(requested as ProductionStage) ? requested as ProductionStage : 'script';
  });
  const [script, setScript] = useState<ScriptVersion>('process'), [frame, setFrame] = useState<FrameVersion>('wide');
  const [light, setLight] = useState<LightVersion>('window'), [sound, setSound] = useState<SoundVersion>('noise'), [shooting, setShooting] = useState(false);
  const estimate = videoProductionEstimate(shooting);
  const save = () => {
    const url = URL.createObjectURL(new Blob([videoProductionDossier({ script, frame, light, sound, shooting })], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'tavora-v1-snimachen-plan.txt'; document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section id="client-production" aria-label="V-1: сценарий, камера, светлина и звук" className="my-8 scroll-mt-6 rounded-2xl border academy-border-strong p-4 sm:p-6">
    <p className="text-xs font-semibold uppercase tracking-wider academy-accent">Продължи V-1 · модули 2–5</p>
    <h2 className="mt-3 text-2xl font-semibold academy-text">Подготви това, което после ще монтираш</h2>
    <p className="mt-3 text-sm leading-7 academy-body">Продължаваш с измисленото „Кафе пауза“. Сравни сценарен план, действителни изрези, светлинно разположение и звукови файлове. Всеки избор остава в тази сесия.</p>
    <p className="mt-3 text-sm leading-7 academy-body">Първоначалната поръчка е монтаж от предоставен материал. Новото заснемане по-долу е отделно предложение за съгласуване; не е включено автоматично в учебните 160 €.</p>
    <div role="group" aria-label="Етапи на подготовката V-1" className="mt-5 grid gap-2 sm:grid-cols-2">{PRODUCTION_STAGES.map((key, i) => <button key={key} type="button" aria-pressed={stage === key} onClick={() => setStage(key)} className={`rounded-xl border p-3 text-left text-sm font-semibold ${stage === key ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border academy-body'}`}>{i + 2}. {names[i]}</button>)}</div>
    {stage === 'script' && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <label className="block academy-text">Сценарна версия<select value={script} onChange={e => setScript(e.target.value as ScriptVersion)} className={selectClass}><option value="process">Обясни процеса от подготовката до резултата</option><option value="result">Започни с резултата и върни към процеса</option><option value="delivery">Добави доставка и срок без потвърждение</option></select></label>
      <ol aria-label="Избран сценарен план" className="space-y-3">{videoProductionScript(script).map(s => <li key={s.time} className="rounded-xl border academy-border p-4"><p className="font-semibold academy-text">{s.time} · {s.picture}</p><p className="mt-1">{s.text}</p><p className="mt-2 text-xs leading-6 academy-muted">Основание: {s.source}.</p></li>)}</ol>
      <p role="status">{script === 'delivery' ? 'Тази версия добавя непотвърдени условия. Върни текста за уточнение преди предаване.' : script === 'result' ? 'Началото с резултата е друга гледна точка. Нужен е разбираем преход назад; фактите и условията остават същите.' : 'Редът поддържа обяснението на процеса. Приготвянето е монтажно съкратено, а не обещано време за обслужване.'}</p>
      <p className="text-xs leading-6 academy-muted">Това променя текстовия сценарен план, а не MP4 от предишната работилница. За реална публикация липсващият адрес се уточнява с клиента.</p>
      <details className="rounded-xl border academy-border p-4"><summary className="cursor-pointer font-semibold academy-text">Показан начин да използваш ИИ</summary><p className="mt-3">Задание: „По брифа предложи две начала и четири сцени за 16 секунди. За всяка посочи нужен кадър, реплика и източник на условието. Не добавяй доставка, адрес или срок. Отдели наличните кадри от нужните нови.“</p><p className="mt-3">Проверка: сравни всяка сцена с действителните файлове и всяко условие с брифа. Вариантите тук са подготвени учебни примери с ИИ и редакция, а не жив отговор от външен акаунт.</p></details>
    </div>}
    {stage === 'camera' && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <label className="block academy-text">Действителен файл за кадъра<select value={frame} onChange={e => setFrame(e.target.value as FrameVersion)} className={selectClass}>{Object.entries(PRODUCTION_FRAMES).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
      <video key={frame} controls playsInline muted preload="metadata" src={`/academy-labs/perfect-video/ai/${frame}.mp4`} aria-label="Предоставен кадър за сравнение V-1" className="mx-auto max-h-[28rem] w-full rounded-xl bg-black" />
      <p role="status">{PRODUCTION_FRAMES[frame].dimensions} · 15 кадъра/секунда · 9 секунди · без аудиописта. {PRODUCTION_FRAMES[frame].note}</p>
      <a href={`/academy-labs/perfect-video/ai/${frame}.mp4`} download={`tavora-v1-kadar-${frame}.mp4`} className="inline-block rounded-xl academy-primary px-4 py-3 font-semibold text-white">Изтегли избрания кадър</a>
      <p>План за нов запис: проба за фокус, светлина и звук; нормално движение на 25 кадъра/секунда като учебна отправна точка; затвор според действието и конкретните лампи. Ако устройството не позволява контрол, отбелязваш ограничението и проверяваш записа.</p>
      <p>25-кадровият износ на стар материал не означава, че оригиналът е заснет на 25. Малките предоставени файлове са за сравнение; не са обещан клиентски стандарт.</p>
      <p>Когато изрезът губи решаващо действие, сравни друг наличен план или предложи отделен вертикален дубъл. Генерирана ръка не доказва какво действително е направил човекът.</p>
    </div>}
    {stage === 'light' && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <label className="block academy-text">Светлинен план<select value={light} onChange={e => setLight(e.target.value as LightVersion)} className={selectClass}>{Object.entries(PRODUCTION_LIGHTS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
      <LightPlan value={light} /><p role="status">{PRODUCTION_LIGHTS[light].note}</p>
      <ol className="list-decimal space-y-2 pl-5"><li>Провери дали чашата, ръката и важният надпис остават четими.</li><li>При отражение смени подходящо ъгъла и направи нова проба. Пази прохода и безопасните позиции на техниката.</li><li>Установи входния профил. Log, HLG и стандартен запис не са взаимозаменяеми; не избирай LUT само по контраст.</li><li>Провери една ясна цветна верига, после умерена визия и действителния износ.</li></ol>
      <p>Видео waveform измерва нивата в картината; аудио вълната показва звукова амплитуда във времето. За цвета използвай подходящите графики заедно с изображението и избраната цветна верига.</p>
    </div>}
    {stage === 'sound' && <div className="mt-5 space-y-4 text-sm leading-7 academy-body">
      <p>Контролната реплика е синтетична: „Първо провери звука. Доближи микрофона и чуй дали думите се разбират.“ Тя не е глас на клиента и не е готов текст за неговата реклама.</p>
      <label className="block academy-text">Звуков вариант<select value={sound} onChange={e => setSound(e.target.value as SoundVersion)} className={selectClass}>{Object.entries(PRODUCTION_SOUNDS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
      <div className="rounded-xl border academy-border p-4"><p className="mb-2 font-semibold academy-text">{PRODUCTION_SOUNDS[sound].referenceLabel}</p><audio key={`reference-${sound}`} controls preload="metadata" src={PRODUCTION_SOUNDS[sound].reference} aria-label="Референтен звук за сравнение V-1" className="w-full min-w-0" /></div>
      <div className="rounded-xl border academy-border p-4"><p className="mb-2 font-semibold academy-text">Избраният вариант</p><audio key={sound} controls preload="metadata" src={PRODUCTION_SOUNDS[sound].file} aria-label="Избран звуков вариант V-1" className="w-full min-w-0" /></div>
      <p role="status">{PRODUCTION_SOUNDS[sound].note}</p>
      <a href={PRODUCTION_SOUNDS[sound].file} download={`tavora-v1-zvuk-${sound}.mp3`} className="inline-block rounded-xl academy-primary px-4 py-3 font-semibold text-white">Изтегли избрания звуков пример</a>
      <p>Сравнявай при удобна сходна сила. Чуй началата и краищата на думите, а не само фона. При липсваща важна дума използвай по-лек вариант, друг дубъл или нов запис. Пази оригинала.</p>
      <p>При отделен звук провери начало, среда и край. За музика и синтетичен глас сверявай точната употреба. Външен акаунт и платена обработка не са условие за тези упражнения.</p>
    </div>}
    <div className="mt-6 rounded-xl border academy-border p-4 text-sm leading-7 academy-body">
      <h3 className="font-semibold academy-text">Ако клиентът поиска и заснемане</h3>
      <p className="mt-2">Учебна добавка с налична техника: {SHOOTING_WORK.map(([name, hours]) => `${name.toLowerCase()} ${hours.toLocaleString('bg-BG')} ч.`).join('; ')}. При вътрешна ставка 20 €/ч. и 10 € външен разход това са още 70 € моделиран разход. Предложената добавена цена е 100 €.</p>
      <button type="button" aria-pressed={shooting} onClick={() => setShooting(!shooting)} className="mt-3 rounded-xl border academy-border-strong px-4 py-3 font-semibold academy-text">{shooting ? 'Премахни предложението за заснемане' : 'Добави предложение за заснемане'}</button>
      <p role="status" aria-label="Разчет с предложеното заснемане" className="mt-3">Обща предложена цена: {estimate.totalPrice} €. Моделиран разход: {estimate.totalCost} €. Разлика: {estimate.difference} € преди непосочени общи разходи и данъци. {shooting ? 'Добавката е предложение; клиентско одобрение още няма.' : 'Заснемане не е включено.'}</p>
      <p className="mt-2 text-xs leading-6 academy-muted">Измислени учебни суми, не пазарна тарифа. Наем, допълнителен човек, нова локация или друг обхват изискват нов разчет.</p>
    </div>
    <button type="button" onClick={save} className="mt-5 rounded-xl academy-primary px-4 py-3 text-sm font-semibold text-white">Изтегли избрания снимачен план</button>
    <p className="mt-3 text-xs leading-6 academy-muted">TXT файлът пази избраните сценарий, кадър, светлина, звук и разчет. Това е чернова без XP и клиентско приемане. Независимите задачи са в уроците. Не се качва нищо и не се извиква външен ИИ. <a href="/academy-labs/perfect-video/client-production/SOURCES.md" className="academy-accent underline underline-offset-4">Произход и ограничения на материалите</a>.</p>
  </section>;
}
