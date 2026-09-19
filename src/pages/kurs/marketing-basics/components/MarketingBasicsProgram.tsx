import { useState } from 'react';
import { Link } from 'react-router-dom';

const GROUPS = [
  {
    id: 'foundation',
    title: 'Група 1: Основа и Позициониране',
    subtitle: 'Кой си ти, за кого си, защо теб — плюс правна и технологична рамка',
    icon: 'ri-focus-3-line',
    color: '#3B5BDB',
    modules: [
      { num: '01', title: 'Основа — Кой, за кого, защо теб', time: '45мин · 7 урока', desc: 'AI тест за препоръка, категория на един, founder brand, позициониране vs реклама, конкурентен анализ. Фундаментът, без който всеки маркетинг бюджет е загуба.' },
      { num: '02', title: 'Идеалният клиент и Zero-Party Данни', time: '45мин · 8 урока', desc: 'Jobs-to-be-done вместо демография, момент на спусъка, карта на възражения, банка от думи на клиента, Zero-party анкети, A/B/C клиентски нива, social listening.' },
      { num: '03', title: 'Съобщението и AI цитирирането', time: '45мин · 8 урока', desc: '5-секунден тест за ясност, доказуемо твърдение с число, разбиване на мит, основен AI промпт за бранда, AI-четима "За нас" страница, одит спрямо конкуренти.' },
      { num: '04', title: 'Юридическа рамка и Технологичен стек', time: '1ч · 10 урока', desc: 'Consent Mode v2, EU AI Act, минимален софтуерен стек, GDPR в практиката, no-code автоматизация, AI агенти за бизнеса, MCP на прост език, одит на абонаменти.' },
    ],
  },
  {
    id: 'presence',
    title: 'Група 2: Присъствие и Видимост',
    subtitle: 'Къде и как да те намират — в Google, AI и извън',
    icon: 'ri-global-line',
    color: '#2F9E44',
    modules: [
      { num: '05', title: 'Ценообразуване и AI-читаеми оферти', time: '45мин · 8 урока', desc: 'Ценообразуване на база стойност, ценова котва, имена на пакети, гаранции, скрипт за "скъпо е", AI-четими ценови страници, прозрачност като предимство.' },
      { num: '06', title: 'Google Business Profile & Local 2026', time: '1ч · 11 урока', desc: 'GBP промени 2026, видео верификация, основни vs допълнителни категории, Ask Maps, Popularity vs Prominence, суспендиране и обжалване, AI агенти и локален бизнес.' },
      { num: '07', title: 'Ревюта и Репутация в ерата на новите правила', time: '1ч · 9 урока', desc: 'Нови правила за ревюта, молба vs стимул, AI чернова + човешка проверка, деескалация на негативни ревюта, бранд споменавания извън Google, Reddit и Quora.' },
      { num: '08', title: 'Сайт, Schema и Конверсии', time: '1ч · 10 урока', desc: 'Йерархия на доверието, Schema без програмист, правилото "един CTA", chat widget рамка, landing page vs homepage, формуляр без триене, heatmaps, микро-конверсии.' },
      { num: '09', title: 'Локално SEO и AI видимост (GEO)', time: '1.5ч · 12 урока', desc: 'Локално SEO среща GEO, NAP консистентност, гласови заявки, проверими факти за AI, Entity SEO, Citation Engineering, llms.txt, AI Visibility Tracking, 90-дневен план.' },
      { num: '10', title: 'Съдържание с посока и E-E-A-T', time: '1ч · 10 урока', desc: 'Тест "би ли го написал експерт", 4 стълба съдържание, YouTube SEO, видео като AI източник, AI чернова + човешки редактор, 1 съдържание → 5 формата, календар без прегаряне.' },
    ],
  },
  {
    id: 'traffic',
    title: 'Група 3: Трафик и Партньорства',
    subtitle: 'Как да доведеш хора при теб — органично, платено, чрез партньори',
    icon: 'ri-traffic-light-line',
    color: '#E67700',
    modules: [
      { num: '11', title: 'Социални мрежи: Видео и Автентичност', time: '1ч · 9 урока', desc: 'Една платформа наведнъж, първите 2 секунди на видеото, сурово vs студийно, формула "кука-проблем-решение-CTA", DMs като отдел продажби, общностен маркетинг.' },
      { num: '12', title: 'Meta Реклами: Ерата на Advantage+', time: '1ч · 9 урока', desc: 'Advantage+ автоматизация, Conversion API + пиксел, креативът като ново таргетиране, Reels vs Feed, минимален бюджет, A/B тест на креатив, финален чеклист.' },
      { num: '13', title: 'Google Реклами: AI-управлявани Search', time: '45мин · 8 урока', desc: 'AI Max логика, keywordless таргетиране, Performance Max с малък бюджет, негативни ключови думи, локална реклама през Maps, първа кампания стъпка по стъпка.' },
      { num: '14', title: 'First-Party Маркетингова Система', time: '45мин · 8 урока', desc: 'Живот след third-party cookies, first-party данни като инфраструктура, сървър-side проследяване, сегментиране по поведение, инкрементално измерване, ретаргетинг през имейл.' },
      { num: '15', title: 'Кампании и Промоционални вълни', time: '45мин · 7 урока', desc: 'Анатомия на кампания без "просто отстъпка", кога промоция гради vs обезценява, етична спешност, мултиканална синхронизация, пост-анализ.' },
      { num: '16', title: 'Партньорства и Бранд Споменавания', time: '45мин · 7 урока', desc: 'Допълващи партньори, кръстосана промоция, мини-събития, бранд споменаване като SEO/AI сигнал, реферална система, поддържане на мрежата.' },
    ],
  },
  {
    id: 'conversion',
    title: 'Група 4: Превръщане и Метрики',
    subtitle: 'Как интересът става продажба — и как знаеш кое работи',
    icon: 'ri-exchange-funds-line',
    color: '#e53e3e',
    modules: [
      { num: '17', title: 'Лийд фунии и Speed-to-Lead', time: '1ч · 9 урока', desc: 'Speed-to-lead като предимство №1, AI чатбот за квалифициране, AI агент за насрочване, фуния топъл vs студен, минимална CRM, намиране на "пробойната".' },
      { num: '18', title: 'Интерактивни Лийд Магнити', time: '45мин · 8 урока', desc: 'Статични PDF-и vs калкулатори, мини-тестове вместо чеклисти, Zero-party въпрос в магнита, обвързване с оферта, автоматична доставка, A/B тест на магнити.' },
      { num: '19', title: 'Имейл маркетинг и Собствена база', time: '1ч · 9 урока', desc: 'Единствен канал без алгоритъм, изграждане без спам, динамично съдържание, 3 задължителни поредици, тестване на теми, чистене на неактивни, метрики отвъд отваряния.' },
      { num: '20', title: 'Продажби, Follow-up и Истинските Метрики', time: '1ч · 10 урока', desc: 'Продажбата като продължение на съобщението, 3 въпроса преди твърдение, AI follow-up без роботизиране, Consent Mode, сървър-side проследяване, цена на лийд/клиент/LTV.' },
    ],
  },
];

const GROUP_DESC = [
  'Първите 4 модула полагат фундамента: кой си, за кого работиш, какво казваш и каква е правната и технологична рамка. AI тестът за препоръка, founder brand и основният AI промпт са вградени директно.',
  'Модули 05-10 изграждат цялостно онлайн присъствие — от цени и GBP до локално SEO, GEO оптимизация и E-E-A-T съдържание. Когато клиент те потърси в Google, Maps или ChatGPT, намира теб.',
  'Модули 11-16 генерират предвидим поток от клиенти: социални мрежи, Meta Advantage+, AI-управлявани Google реклами, first-party маркетинг, промоционални вълни и партньорства.',
  'Модули 17-20 затварят цикъла: лийд фунии със speed-to-lead, интерактивни магнити, имейл автоматизация и истинските метрики, които показват дали системата работи.',
];

export default function MarketingBasicsProgram() {
  const [openGroup, setOpenGroup] = useState<string | null>('foundation');

  return (
    <section id="programa" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Пълна програма — 2026</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        20 модула, 177 урока —{' '}
        <em className="text-[#1C1C1E]/55">маркетинг система за 2026.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-2">
        GEO, AI агенти и автоматизация са вградени директно в уроците — без излишно добавяне на отделни модули. Същият обем, много по-точно съдържание.
      </p>
      <p className="text-xs text-[#1C1C1E]/50 mb-8">
        Общо 18+ часа структурирано съдържание. Всеки урок с практическа задача.
      </p>

      <div className="space-y-4">
        {GROUPS.map((group, gi) => (
          <div key={group.id} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden transition-all duration-200">
            <button
              className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
              onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              aria-expanded={openGroup === group.id}
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${group.color}15` }}>
                <i className={`${group.icon} text-lg`} style={{ color: group.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-0.5">{group.title}</h3>
                <p className="text-xs text-[#1C1C1E]/65">{group.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1C1C1E]/65 shrink-0">
                <span>{group.modules.length} модула</span>
                <i className={`text-sm transition-transform duration-200 ${openGroup === group.id ? 'ri-subtract-line' : 'ri-add-line'}`} />
              </div>
            </button>
            {openGroup === group.id && (
              <div className="px-5 md:px-6 pb-5 md:pb-6 bg-[#F9F9F7] border-t border-[#1C1C1E]/6">
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed pt-4 mb-4">{GROUP_DESC[gi]}</p>
                <div className="space-y-2">
                  {group.modules.map((mod) => (
                    <div key={mod.num} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#1C1C1E]/5">
                      <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 text-xs font-medium text-white" style={{ backgroundColor: group.color }}>
                        {mod.num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="text-xs font-medium text-[#1C1C1E]">{mod.title}</div>
                          <span className="text-[10px] text-[#1C1C1E]/65">{mod.time}</span>
                        </div>
                        <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{mod.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/kurs"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/85 transition-all cursor-pointer whitespace-nowrap font-medium"
        >
          Започни с първия безплатен модул →
        </Link>
      </div>
    </section>
  );
}