import { useState } from 'react';
import InlineIcon from '@/components/base/InlineIcon';

const modules = [
  {
    number: '01',
    title: 'Бизнес Модел и Позициониране',
    subtitle: 'Преди да правите сайт — трябва да знаете за кого е',
    description:
      'Започваме с нещо, което повечето курсове пропускат: дефиниране на нишата и целевата аудитория. Ще направите конкретен ICP (Ideal Customer Profile) за вашия бизнес. Ще разберете как да ценообразувате услуги, без да се подценявате.',
    topics: [
      'Избор на ниша — критерии и грешки',
      'Изграждане на ICP с реален пример',
      'Ценообразуване: как да не работите на загуба',
      'Позициониране спрямо конкурентите',
    ],
    tools: ['ChatGPT', 'Google Trends', 'Ahrefs Free'],
    whatYouDo: 'Попълвате ICP шаблон за вашия бизнес и дефинирате ценова стратегия.',
    duration: '3 часа',
    color: '#0A2540',
  },
  {
    number: '02',
    title: 'Изграждане на Сайт с AI',
    subtitle: 'Работещ сайт за часове, не за седмици',
    description:
      'Ще изградите реален сайт, използвайки AI инструменти. Не теория — правите го по време на модула. Фокусът е върху структурата, която Google харесва: правилна йерархия, бързо зареждане, мобилна оптимизация.',
    topics: [
      'AI workflow за уеб дизайн стъпка по стъпка',
      'Структура на сайт за SEO от самото начало',
      'Компоненти: header, footer, landing page',
      'Публикуване и хостинг — безплатни опции',
    ],
    tools: ['AI уеб инструменти', 'Vercel', 'Cloudflare'],
    whatYouDo: 'Публикувате работещ сайт за вашия бизнес или клиент.',
    duration: '4 часа',
    color: '#1B4332',
  },
  {
    number: '03',
    title: 'Съдържание с Gemini',
    subtitle: 'Текстове, които Google класира — и хората четат',
    description:
      'Ще научите как да използвате Gemini за създаване на SEO съдържание, което звучи като написано от човек. Промпт инженеринг за бизнес копирайтинг — конкретни шаблони, не общи съвети.',
    topics: [
      'Промпт шаблони за продуктови описания',
      'Структура на SEO статия (H1, H2, вътрешни линкове)',
      'Тон и глас на бранда — как да го зададете на AI',
      'Локализация: как да звучи естествено на български',
    ],
    tools: ['Gemini', 'Google Docs', 'Surfer SEO (безплатен план)'],
    whatYouDo: 'Пишете 3 реални текста за вашия сайт с Gemini.',
    duration: '3 часа',
    color: '#0A2540',
  },
  {
    number: '04',
    title: 'SEO и GEO Оптимизация',
    subtitle: 'Как Google и AI търсачките решават кой е #1',
    description:
      'Техническото SEO, което реално има значение — без излишна теория. Ще разберете как работи GEO (Generative Engine Optimization) и защо ChatGPT препоръчва определени сайтове. Ще приложите всичко директно върху вашия сайт.',
    topics: [
      'On-page SEO: мета данни, H тагове, alt текстове',
      'Schema markup — структурирани данни за Google',
      'Google Business Profile оптимизация',
      'GEO: как AI търсачките избират препоръки',
    ],
    tools: ['Google Search Console', 'Schema.org', 'Google Business', 'Ahrefs'],
    whatYouDo: 'Оптимизирате вашия сайт технически и го подготвяте за AI търсачки.',
    duration: '2 часа',
    color: '#1B4332',
  },
  {
    number: '05',
    title: 'Рекламни Кампании',
    subtitle: 'Meta, Google, YouTube, TikTok — как да не горите бюджета',
    description:
      'Ще научите как да настроите и управлявате платени кампании на четирите основни платформи. Фокусът е върху реалната логика зад таргетирането — не само бутони и настройки, а защо работи и кога не работи.',
    topics: [
      'Meta Ads: аудитории, креативи, ретаргетинг',
      'Google Ads: Search vs Display, Quality Score',
      'YouTube Ads: кога има смисъл, кога не',
      'TikTok Ads: специфики и разлики от Meta',
    ],
    tools: ['Meta Business Suite', 'Google Ads', 'TikTok Ads Manager', 'Canva'],
    whatYouDo: 'Настройвате тестова кампания с реален бюджет и анализирате резултатите.',
    duration: '3 часа',
    color: '#0A2540',
  },
  {
    number: '06',
    title: 'Видео Съдържание за Бизнеси',
    subtitle: 'Как да снимате съдържание, което работи — без да изглежда аматьорско',
    description:
      'Натан Петков води модула. Ще научите как да планирате, снимате и монтирате видео съдържание за бизнеси. Снимаме с професионална техника — камери, микрофони, осветление. Ще разберете разликата между съдържание, което се гледа, и такова, което се прескача.',
    topics: [
      'Планиране на видео стратегия за бизнес',
      'Техника: камера, микрофон, осветление — минимум и оптимум',
      'Снимане пред камерата — как да изглеждате естествено',
      'Монтаж с AI инструменти — бързо и ефективно',
    ],
    tools: ['CapCut', 'DaVinci Resolve', 'Descript', 'Canva'],
    whatYouDo: 'Снимате и монтирате кратко видео за вашия бизнес или клиент.',
    duration: '3 часа',
    color: '#1B4332',
  },
  {
    number: '07',
    title: 'Намиране и Задържане на Клиенти',
    subtitle: 'Как да продавате без да се чувствате като продавач',
    description:
      'Последният модул е за бизнес страната. Как да намерите първите клиенти, как да водите продажбен разговор без натиск, как да управлявате очакванията. Реални скриптове и шаблони за договори.',
    topics: [
      'Намиране на клиенти: LinkedIn, препоръки, студено писане',
      'Продажбен разговор: квалификация и предложение',
      'Договор и условия — минимум, от който да тръгнете',
      'Управление на очакванията — как да не разочаровате',
    ],
    tools: ['LinkedIn', 'Notion (шаблони)', 'Calendly'],
    whatYouDo: 'Изпращате 5 реални съобщения до потенциални клиенти.',
    duration: '2 часа',
    color: '#0A2540',
  },
];

export default function CurriculumSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="curriculum"
      className="py-8 md:py-36 bg-[#FFFFFF] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 md:mb-20">
          <div>
            <div
              className="flex items-center gap-3 mb-4 md:mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
              <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">Какво точно ще правите</span>
            </div>
            <h2
              className="text-2xl md:text-5xl font-light text-[#1C1C1E] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              7 модула.
              <br />
              <span className="italic text-[#0A2540]">Конкретни стъпки.</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p
              className="text-sm text-[#1C1C1E]/60 leading-relaxed max-w-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              SEO, реклами, видео продукция — всичко, което правим за реални клиенти.
              Всеки модул включва: какво ще научите, какви инструменти ще използвате и какво конкретно ще направите.
            </p>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-0 border-t border-[#1C1C1E]/8">
          {modules.map((mod, i) => (
            <div
              key={mod.number}
              className="border-b border-[#1C1C1E]/8"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-4 md:py-7 text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3 md:gap-8 min-w-0">
                  <span
                    className="text-xs text-[#1C1C1E]/25 font-light w-5 shrink-0"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {mod.number}
                  </span>
                  <div className="min-w-0">
                    <div
                      className="text-sm md:text-xl font-light text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors duration-300 truncate"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {mod.title}
                    </div>
                    <div
                      className="text-xs text-[#1C1C1E]/65 mt-0.5 hidden sm:block"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {mod.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-6 shrink-0 ml-2">
                  <span
                    className="text-xs text-[#1C1C1E]/65 whitespace-nowrap"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {mod.duration}
                  </span>
                  <div
                    className={`w-6 h-6 md:w-7 md:h-7 rounded-full border border-[#1C1C1E]/15 flex items-center justify-center transition-all duration-300 shrink-0 ${
                      openIndex === i ? 'bg-[#0A2540] border-[#0A2540]' : 'bg-transparent'
                    }`}
                  >
                    <InlineIcon name="add" className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                        openIndex === i ? 'text-white rotate-45' : 'text-[#1C1C1E]/65'
                      }`} />
                  </div>
                </div>
              </button>

              <div
                style={{
                  maxHeight: openIndex === i ? 600 : 0,
                  opacity: openIndex === i ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 300ms ease, opacity 200ms ease',
                }}
              >
                <div className="pb-5 md:pb-8 pl-8 md:pl-14 pr-3 md:pr-4">
                  <p
                    className="text-sm text-[#1C1C1E]/60 leading-relaxed mb-5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {mod.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div style={{ fontFamily: "'Inter', sans-serif" }}>
                      <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Теми</div>
                      <ul className="space-y-2">
                        {mod.topics.map((topic) => (
                          <li
                            key={topic}
                            className="flex items-start gap-2 text-xs text-[#1C1C1E]/60"
                          >
                            <div
                              className="w-1 h-1 rounded-full shrink-0 mt-1.5"
                              style={{ backgroundColor: mod.color }}
                            />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ fontFamily: "'Inter', sans-serif" }}>
                      <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Инструменти</div>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.tools.map((tool) => (
                          <span
                            key={tool}
                            className="text-[10px] px-2 py-0.5 rounded-full border border-[#1C1C1E]/10 text-[#1C1C1E]/60"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F9]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво правите</div>
                      <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">{mod.whatYouDo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total stats */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 md:mt-12 pt-5 md:pt-8 border-t border-[#1C1C1E]/8 gap-5 sm:gap-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex flex-wrap items-center gap-5 md:gap-8">
            <div>
              <div className="text-lg md:text-xl font-light text-[#0A2540]">20 часа</div>
              <div className="text-xs text-[#1C1C1E]/65 mt-0.5 leading-tight">Практическо съдържание<br /><span className="text-[#1C1C1E]/65">(без излишна теория)</span></div>
            </div>
            <div className="w-[1px] h-8 bg-[#1C1C1E]/10 hidden sm:block" />
            <div>
              <div className="text-lg md:text-xl font-light text-[#0A2540]">7 модула</div>
              <div className="text-xs text-[#1C1C1E]/65 mt-0.5">SEO · Реклами · Видео</div>
            </div>
            <div className="w-[1px] h-8 bg-[#1C1C1E]/10 hidden sm:block" />
            <div>
              <div className="text-lg md:text-xl font-light text-[#0A2540]">Доживотен</div>
              <div className="text-xs text-[#1C1C1E]/65 mt-0.5">Достъп до материалите</div>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('application');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3 border border-[#0A2540]/30 text-[#0A2540] text-xs tracking-wide rounded-full hover:bg-[#0A2540] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Виж дали е за теб
          </button>
        </div>
      </div>
    </section>
  );
}
