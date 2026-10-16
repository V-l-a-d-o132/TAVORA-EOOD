import { useState } from 'react';

interface IntroChoice {
  label: string;
  feedback: string;
  correct: boolean;
}

interface IntroContent {
  title: string;
  opening: string;
  outcome: string;
  example: {
    situation: string;
    decision: string;
    reason: string;
  };
  path: { title: string; detail: string }[];
  withoutBusiness: string;
  withBusiness: string;
  question: string;
  choices: IntroChoice[];
}

const INTRODUCTIONS: Record<string, IntroContent> = {
  'koprinena-pateka': {
    title: 'Първо провери какво знаеш. После строй.',
    opening: 'Ще минеш от ясна задача към услуга, която можеш да обясниш, изпълниш и поправиш. Не ти трябва собствен бизнес, за да започнеш. Първият модул ти дава данни за учебен проект и показва цялото решение.',
    outcome: 'Накрая ще си упражнил решения за клиентска задача, оферта, работен процес и приемане по предоставени случаи. Завършеният курс не означава гарантиран клиент или доход.',
    example: {
      situation: 'Учебно фотостудио предлага 10 обработени снимки за 70 €. Клиент пита дали има свободен час в неделя. График не е предоставен.',
      decision: 'ИИ може да подготви отговор за цената и пакета. За неделя отговорът е: „Трябва да проверим графика.“',
      reason: 'Убедителният текст не превръща липсващия факт в истина. Човекът проверява и одобрява обещанието.',
    },
    path: [
      { title: 'Дай ясна задача', detail: 'Посочи факти, ограничения и как изглежда полезният резултат.' },
      { title: 'Провери черновата', detail: 'Сравни я с източника, особено за цена, срок и права.' },
      { title: 'Свържи работата', detail: 'Използвай провереното в сайта, офертата и финалния проект.' },
    ],
    withoutBusiness: 'Започни с данните за учебното фотостудио. Можеш да решиш първата задача и без платен ИИ инструмент.',
    withBusiness: 'В курса работиш по предоставените случаи. След урока можеш да приложиш подхода към своя работа на собственото си устройство; не предаваш лични или клиентски материали.',
    question: 'ИИ предлага да потвърди час за неделя, но нямаш достъп до графика. Какво правиш?',
    choices: [
      { label: 'Изпращам отговора; после ще видя дали часът е свободен.', feedback: 'Потвърждението вече е обещание към клиента. Първо трябва да знаеш дали е вярно.', correct: false },
      { label: 'Оставям часа непотвърден и проверявам графика.', feedback: 'Точно така. Моделът може да напише чернова, а фактът и решението остават за проверка.', correct: true },
      { label: 'Искам от друг модел да познае дали студиото работи.', feedback: 'Втори отговор без достъп до графика пак няма да докаже наличност.', correct: false },
    ],
  },
  'perfektno-video': {
    title: 'Преди камерата идва причината да снимаш.',
    opening: 'Тук няма да започнеш с настройки и преходи. Първо ще разбереш за кого е видеото, какъв въпрос трябва да реши и как ще провериш дали е помогнало. После ще минеш през снимане, звук, монтаж, публикуване и следваща версия.',
    outcome: 'Ще упражниш бриф, история, избор на кадри и звук, монтаж и поправка на версия по готови материали. Собственото снимане остава отделна лична практика. Никой урок не може да обещае „вирално“ видео.',
    example: {
      situation: 'В учебния казус ателие за керамика има 31 посещения на страницата и 4 записвания за две седмици. Собственичката подозира, че цената пречи. Три разговора сочат друг въпрос: начинаещите не знаят как протича занятието.',
      decision: 'Първото видео показва как започва урокът и какво получава нов човек. Преди снимане записваш какво знаеш и какво остава предположение.',
      reason: 'Красивите кадри няма да отговорят на страха на зрителя, ако не покажеш самото преживяване.',
    },
    path: [
      { title: 'Разбери зрителя', detail: 'Наблюдение, въпрос и едно изпълнимо обещание.' },
      { title: 'Произведи доказателство', detail: 'Бриф, кадър, звук и монтаж, които служат на обещанието.' },
      { title: 'Провери и подобри', detail: 'Сравни резултата честно и запази версия 1 и версия 2.' },
    ],
    withoutBusiness: 'Започни с предоставените материали и учебния казус. За задължителните задачи не са нужни собствен клип или техника.',
    withBusiness: 'В курса работиш по предоставените случаи. След урока можеш да приложиш подхода към своя работа на собственото си устройство; не предаваш лични или клиентски материали.',
    question: 'Ателието мисли, че цената спира хората, но разговорите показват неяснота за самото занятие. Кой е първият ход?',
    choices: [
      { label: 'Пускам отстъпка и снимам реклама за нея.', feedback: 'Цената засега е предположение. Отстъпката не отговаря на въпроса, който хората действително задават.', correct: false },
      { label: 'Показвам началото на занятието и какво получава начинаещият.', feedback: 'Да. Видеото първо отговаря на наблюдавания въпрос; после проверяваш какво се е променило.', correct: true },
      { label: 'Снимам ефектен монтаж без обяснение, за да събера гледания.', feedback: 'Гледанията сами не показват дали начинаещият е разбрал какво го очаква.', correct: false },
    ],
  },
  'marketing-basics': {
    title: 'Маркетингът започва преди рекламата.',
    opening: 'Маркетингът е поредица от решения: кой има проблем, какво точно му предлагаш, къде ще разбере за това и как ще разбереш дали изборът работи. Рекламата е само един начин човекът да те види. Ако офертата е неясна, повече посещения могат просто да донесат повече неподходящи запитвания.',
    outcome: 'До финала ще свържеш участниците в решението, офертата, каналите, бюджета и капацитета в предоставен учебен план. В това въведение започваме с човека и парите, за да имаш опора и когато уроците стигнат до алгоритми и инструменти.',
    example: {
      situation: 'Учебен сервиз е похарчил 300 € за реклама. Половината обаждания са за услуга, която не предлага. Собственикът иска още 300 €, за да „заработи алгоритъмът“.',
      decision: 'Първо проверяваш какво обещават рекламата и страницата, за коя услуга се обаждат хората и колко от запитванията могат да станат клиенти. После решаваш дали има смисъл от нов разход.',
      reason: 'Посещение е човек на страницата; запитване е контакт; продажба е платена работа. Те са различни числа и не бива да ги наричаш с едно име.',
    },
    path: [
      { title: 'Клиент и проблем', detail: 'Кой търси решение и защо точно сега?' },
      { title: 'Оферта и доказателство', detail: 'Какво обещаваш, как го изпълняваш и защо да ти повярват?' },
      { title: 'Канал и измерване', detail: 'Къде стигаш до човека и колко запитвания стават реални клиенти?' },
      { title: 'Следващото решение', detail: 'Какво поправяш преди да увеличиш бюджета?' },
    ],
    withoutBusiness: 'Работи по учебния сервиз. Отделяй дадените факти от предположенията и не измисляй продажби, които не са посочени.',
    withBusiness: 'В курса работиш по предоставените случаи. След урока можеш да приложиш подхода към своя работа на собственото си устройство; не предаваш лични или клиентски материали.',
    question: 'Рекламата носи обаждания за услуга, която сервизът не предлага. Какво проверяваш преди нов бюджет?',
    choices: [
      { label: 'Увеличавам бюджета, за да дойдат повече обаждания.', feedback: 'Още от същите обаждания няма да решат разминаването в офертата.', correct: false },
      { label: 'Сверявам обещанието в рекламата и страницата с реалната услуга.', feedback: 'Да. Първо поправяш причината за неподходящите запитвания, после измерваш дали промяната помага.', correct: true },
      { label: 'Отчитам всички обаждания като продажби.', feedback: 'Запитването не е продажба. Трябва да видиш кои хора са потърсили предлаганата услуга и какво е станало след това.', correct: false },
    ],
  },
};

interface Props {
  courseId: string;
  initiallyOpen: boolean;
  canStart: boolean;
  price: string;
  onStart: () => void;
  onUnlock: () => void;
}

export default function CourseIntroduction({ courseId, initiallyOpen, canStart, price, onStart, onUnlock }: Props) {
  const intro = INTRODUCTIONS[courseId];
  const [open, setOpen] = useState(initiallyOpen);
  const [selected, setSelected] = useState<number | null>(null);
  if (!intro) return null;

  return <section aria-label="Въведение в курса" className="mb-8 overflow-hidden rounded-2xl border academy-border academy-surface academy-text">
    <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:academy-tint sm:p-7">
      <span>
        <span className="text-xs font-bold uppercase tracking-[.15em] academy-accent">Въведение в курса</span>
        <span className="mt-2 block text-xl font-semibold leading-tight sm:text-2xl">{intro.title}</span>
        {!open && <span className="mt-2 block text-sm academy-muted">Как ще учиш и откъде да започнеш</span>}
      </span>
      <i className={`${open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} shrink-0 text-xl academy-muted`} aria-hidden />
    </button>

    {open && <div className="border-t academy-border px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
      <p className="max-w-3xl text-base leading-7 academy-body">{intro.opening}</p>
      <p className="mt-3 max-w-3xl text-sm leading-6 academy-muted">{intro.outcome}</p>

      <div className="mt-7 rounded-xl border academy-border academy-raised p-5">
        <h3 className="text-sm font-semibold academy-text">Един случай, три стъпки</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { label: 'Ситуация', body: intro.example.situation },
            { label: 'Решение', body: intro.example.decision },
            { label: 'Защо', body: intro.example.reason },
          ].map(({ label, body }) => <div key={label}>
            <p className="text-xs font-bold uppercase tracking-wider academy-accent">{label}</p>
            <p className="mt-2 text-sm leading-6 academy-body">{body}</p>
          </div>)}
        </div>
      </div>

      <h3 className="mt-7 text-sm font-semibold academy-text">Пътят през курса</h3>
      <ol className="mt-3 grid gap-3 sm:grid-cols-2">
        {intro.path.map((step, index) => <li key={step.title} className="flex gap-3 rounded-lg border academy-border p-4">
          <span className="text-sm font-bold academy-accent">{String(index + 1).padStart(2, '0')}</span>
          <span><strong className="block text-sm academy-text">{step.title}</strong><span className="mt-1 block text-sm leading-5 academy-muted">{step.detail}</span></span>
        </li>)}
      </ol>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border academy-border p-4"><h3 className="text-sm font-semibold">Ако нямаш бизнес</h3><p className="mt-2 text-sm leading-6 academy-muted">{intro.withoutBusiness}</p></div>
        <div className="rounded-lg border academy-border p-4"><h3 className="text-sm font-semibold">Ако работиш по реален проект</h3><p className="mt-2 text-sm leading-6 academy-muted">{intro.withBusiness}</p></div>
      </div>

      <div className="mt-7 rounded-xl border academy-accent-border academy-accent-bg p-5">
        <h3 className="text-sm font-semibold academy-text">Провери дали си готов за първия урок</h3>
        <p className="mt-2 text-sm leading-6 academy-body">{intro.question}</p>
        <div className="mt-4 grid gap-2">
          {intro.choices.map((choice, index) => <button key={choice.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-lg border px-4 py-3 text-left text-sm leading-5 transition-colors ${selected === index ? choice.correct ? 'academy-success-border academy-success-bg academy-text' : 'academy-warning-border academy-warning-bg academy-text' : 'academy-border academy-raised academy-body hover:academy-border-strong'}`}>{choice.label}</button>)}
        </div>
        {selected !== null && <p role="status" className={`mt-3 text-sm leading-6 ${intro.choices[selected].correct ? 'academy-success' : 'academy-warning'}`}>{intro.choices[selected].feedback}</p>}
      </div>

      <button type="button" onClick={canStart ? onStart : onUnlock} className="mt-7 inline-flex items-center gap-2 rounded-lg academy-primary px-5 py-3 text-sm font-bold text-white hover:academy-primary-hover">
        {canStart ? 'Към първия модул' : `Отключи курса за ${price}`}
        <i className="ri-arrow-right-line" aria-hidden />
      </button>
    </div>}
  </section>;
}
