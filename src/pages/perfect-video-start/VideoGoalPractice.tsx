import { useEffect, useState } from 'react';
import { videoAiLessonLink } from '@/lib/video-ai';
import { coffee } from '@/lib/video-montage';

const goals = {
  creator: {
    label: 'Клип за моя канал',
    brief: 'Покажи на начинаещ как правиш нещо с ръцете си. Избери въпрос, на който можеш да отговориш за 20–30 секунди.',
    shoot: 'Сними предмета, началото, решаващото движение отблизо и резултата. Остави по 6–8 секунди на кадър. Запиши с едно изречение коя стъпка е важна.',
    edit: 'Започни с въпроса. Остави достатъчно време зрителят да види как се прави решаващото движение.',
    scene: 'Нарисуван лист се разгъва върху едноцветен фон. Използвай го за преход преди истинската демонстрация.',
    evidence: 'Дай клипа на един човек. Може ли да повтори стъпката само след едно гледане?',
    lessons: [['pv02-05', 'Подреди сценария'], ['pv09-04', 'Направи надписите четими']],
  },
  business: {
    label: 'Видео за моя бизнес',
    brief: 'Клиент пита как се поръчва продуктът ти. Покажи действителния продукт и завърши с проверен начин за поръчка.',
    shoot: 'Сними продукта, едно действие при подготовката, важен детайл и готовата поръчка. Остави по 6–8 секунди на кадър. Запиши отговора на въпроса.',
    edit: 'Покажи истинския продукт още в началото. Остави адреса или начина за поръчка достатъчно дълго, за да се прочете на телефон.',
    scene: 'Три хартиени кръга се събират върху цветен фон. Използвай ги за кратък преход към кадъра на действителния продукт.',
    evidence: 'Дай клипа на човек, който не познава бизнеса. Може ли да назове продукта и да стигне до правилното място за поръчка?',
    lessons: [['pv01-07', 'Избери следващата стъпка'], ['pv13-09', 'Провери правата за употреба']],
  },
  editor: {
    label: 'Монтаж за клиент',
    brief: 'Възложител иска вертикален клип от негови кадри. Уговорете какво зрителят трябва да разбере и кога се предава първата версия.',
    shoot: 'Вземи четири разрешени дубъла или използвай примерния запис на кафемашината. Отбележи откъде започва действието и кога се вижда резултатът.',
    edit: 'Подбери ясните дубъли от материала на възложителя. Запази смисъла на репликата и направи втора версия по една бележка с точна секунда.',
    scene: 'Абстрактни линии се разтварят като завеса върху неутрален фон. Предложи прехода за одобрение отделно от кадрите на възложителя.',
    evidence: 'Предай двете версии и секундата на поправката. Може ли получателят да отвори файла и да види точно поисканата промяна?',
    lessons: [['pv09-01', 'Направи първата сглобка'], ['pv13-15', 'Работи по клиентска бележка']],
  },
} as const;

type Goal = keyof typeof goals;
type Method = 'phone' | 'edit' | 'generate';
const methods: Record<Method, string> = {
  phone: 'С телефон',
  edit: 'ИИ монтира мои кадри',
  generate: 'ИИ създава нови кадри',
};
const storageKey = 'tavora:perfect-video:project-choice:v1';
const groupStyle = 'flex flex-wrap gap-2';
const linkStyle = 'font-semibold academy-accent underline underline-offset-4';

function initialChoice(): { goal: Goal; method: Method; topic: string } {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (typeof value?.goal === 'string' && typeof value.method === 'string' &&
        Object.hasOwn(goals, value.goal) && Object.hasOwn(methods, value.method)) {
      return { goal: value.goal, method: value.method, topic: typeof value.topic === 'string' ? value.topic.slice(0, 140) : '' };
    }
  } catch { /* The exercise also works without browser storage. */ }
  return { goal: 'creator', method: 'phone', topic: '' };
}

function choiceStyle(selected: boolean) {
  return 'min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 ' +
    (selected ? 'academy-accent-border academy-accent-bg academy-text' : 'academy-border academy-body hover:academy-tint');
}

export default function VideoGoalPractice() {
  const [choice, setChoice] = useState(initialChoice);
  const [copyResult, setCopyResult] = useState({ text: '', message: '' });
  const project = goals[choice.goal];
  const editing = choice.method === 'edit';
  const prompt = [choice.topic.trim() && 'Тема на клипа — ' + choice.topic.trim(), ...(editing
    ? [project.brief, project.edit, 'Използвай посочените от мен оригинали и запиши отделен вертикален файл от 20–30 секунди. За стила ще дам един свой или разрешен пример. Изведи две правила за ритъм и надписи. Запази смисловите паузи. Ако има говор, добави български субтитри и посочи думите, в които се съмняваш. Ако материалът е без звук, използвай кратки надписи за видимото действие. Запази оригиналите.']
    : [project.scene, 'Вертикален кадър, неподвижна камера, едно непрекъснато движение. Без надписи или лога. Запази края неподвижен за срез.'])].filter(Boolean).join('\n');
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(choice)); } catch { /* Local persistence is optional. */ }
  }, [choice]);

  return <section aria-labelledby="video-project-title" className="mb-6 min-w-0 rounded-2xl border academy-border-strong academy-surface p-4 sm:p-6">
    <h2 id="video-project-title" className="text-2xl font-semibold academy-text">Какво искаш да направиш?</h2>
    <fieldset className="mt-4"><legend className="sr-only">Цел на видеото</legend>
      <div className={groupStyle}>{(Object.keys(goals) as Goal[]).map(goal =>
        <button type="button" key={goal} aria-pressed={choice.goal === goal} className={choiceStyle(choice.goal === goal)}
          onClick={() => setChoice({ ...choice, goal })}>{goals[goal].label}</button>
      )}</div>
    </fieldset>
    <p className="my-4 max-w-3xl text-base leading-7 academy-body">{project.brief}</p>
    <label className="mb-4 block text-sm font-semibold academy-text">Моята тема или въпрос на зрителя <span className="font-normal academy-muted">(по желание)</span>
      <input value={choice.topic} maxLength={140} onChange={e => setChoice({ ...choice, topic: e.target.value })}
        placeholder="Например „Как се сменя спукана гума на колело?“" className="mt-1.5 block min-h-11 w-full rounded-lg border academy-border-strong academy-bg px-3 py-2 text-base font-normal academy-text" />
    </label>
    <fieldset><legend className="mb-2 text-sm font-semibold academy-text">Как ще работиш?</legend>
      <div className={groupStyle}>{(Object.keys(methods) as Method[]).map(method =>
        <button type="button" key={method} aria-pressed={choice.method === method} className={choiceStyle(choice.method === method)}
          onClick={() => setChoice({ ...choice, method })}>{methods[method]}</button>
      )}</div>
    </fieldset>
    <div className="my-5 space-y-3 rounded-xl academy-tint p-4 text-sm leading-6 academy-body">
      {choice.method === 'phone' ? <>
        <h3 className="font-semibold academy-text">Първият ти файл за около 45 минути</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li><strong>10 минути.</strong> {project.shoot}</li>
          <li><strong>25 минути.</strong> Отвори монтажната маса. Подреди четири отрязъка и добави кратък надпис на всеки. {project.edit}</li>
          <li><strong>10 минути.</strong> Изнеси клипа, намери файла на устройството и го отвори на телефон. {project.evidence}</li>
        </ol>
      </> : <>
        <h3 className="font-semibold academy-text">{editing ? 'От суровия запис до първия монтаж' : 'От идея до движеща се сцена'}</h3>
        {editing ? <p>На телефон отвори разрешените кадри в CapCut и пробвай Auto Cut, ако е наличен. На компютър можеш да дадеш указанието по-долу на Claude Code. Във всяка сглобка прослушай репликата от двете страни на среза.</p>
          : <p>Във Firefly Video въведи описание или задай своя снимка като начален кадър. Генерирай кратка сцена два пъти, като във втория вариант смениш само движението. Свали избрания файл. За клип изцяло с ИИ създай четири сцени по около 5 секунди — начало, действие, детайл и финал. Запази един и същ обект и цветове, подреди сцените и изнеси видеото.</p>}
        <p className="font-semibold academy-text">{editing ? 'Указание за монтаж' : 'Указание за генериране'}</p>
        <p className="select-text whitespace-pre-line rounded-lg border academy-border academy-surface p-3">{prompt}</p>
        <div className="flex flex-wrap items-center gap-3"><button type="button" className={choiceStyle(false)} onClick={async () => {
          try { await navigator.clipboard.writeText(prompt); setCopyResult({ text: prompt, message: 'Копирано.' }); }
          catch { setCopyResult({ text: prompt, message: 'Маркирай указанието по-горе и избери „Копирай“.' }); }
        }}>Копирай указанието</button><span role="status">{copyResult.text === prompt && copyResult.message}</span></div>
        {editing && <p>Свери име, число и една пауза с оригинала. Върни бележка, например „На 00:08 върни началото на думата и премести надписа под ръцете“. Отвори втория изнесен файл и сравни този момент.</p>}
        {editing ? <details>
          <summary className="cursor-pointer py-2 font-semibold academy-text">На компютър с Claude Code</summary>
          <p>Сложи копия на дублите в папка „Кадри“, един разрешен пример в „Стил“ и остави празна папка „Версии“. В локална сесия отвори общата папка. Поискай кратък тестов износ с FFmpeg. За български говор може да използваш многоезичен Whisper. Провери кои инструменти са налични, преди да пуснеш указанието за целия клип.</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2"><a className={linkStyle} href="https://code.claude.com/docs/en/desktop-quickstart">Локална сесия в Claude Code</a><a className={linkStyle} href="https://ffmpeg.org/">FFmpeg</a><a className={linkStyle} href="https://github.com/openai/whisper">Whisper</a></div>
        </details> : <p>Изгледай двата варианта на забавен ход. Следи дали предметът променя форма, буквите се разместват или се появява несъществуващ детайл. Означи илюстрацията като създадена с ИИ. Когато показваш реална стока или резултат от услуга, включи собствен кадър, който го потвърждава. Условията и кредитите зависят от генератора.</p>}
        <p>{editing ? <a className={linkStyle} href="https://www.capcut.com/help/how-to-use-auto-cut">Как се използва Auto Cut</a>
          : <a className={linkStyle} href="https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-images.html">Как се създава видео във Firefly</a>}</p>
        <p><strong>Проверка на готовия клип.</strong> {project.evidence}</p>
      </>}
    </div>
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a href="/academy-labs/perfect-video/montage" className="inline-flex min-h-11 items-center rounded-lg academy-primary px-4 py-2 text-sm font-semibold text-white">Отвори монтажната маса</a>
      {project.lessons.map(([id, title]) => <a key={id} href={videoAiLessonLink(id)} className={'text-sm ' + linkStyle}>{title}</a>)}
    </div>
    <p className="mt-3 text-xs leading-5 academy-muted">Монтажната маса работи и от телефон без външен абонамент. Ако още нямаш свои кадри, използвай примерния запис. <a href={coffee.url} download="kafemashina.mp4" className={linkStyle}>Свали кадрите за упражнение</a></p>
  </section>;
}
