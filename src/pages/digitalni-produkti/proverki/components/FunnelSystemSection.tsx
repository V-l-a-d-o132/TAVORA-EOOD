interface ModuleItem {
  num: string;
  icon: string;
  title: string;
  desc: string;
}

const MODULES: ModuleItem[] = [
  {
    num: '01',
    icon: 'ri-robot-line',
    title: 'Промптиране и AI',
    desc: 'Овладейте ChatGPT, Claude и Gemini като експертен инструмент. Prompt engineering за бизнес резултати всеки ден.',
  },
  {
    num: '02',
    icon: 'ri-paint-brush-line',
    title: 'Дизайн в Readdy',
    desc: 'Създавайте професионални сайтове и лендинг страници без код. AI дизайн за перфектни резултати.',
  },
  {
    num: '03',
    icon: 'ri-search-line',
    title: 'SEO и GEO',
    desc: 'Класирайте се в Google, Bing и AI търсачките. SEO + Generative Engine Optimization за пълна видимост.',
  },
  {
    num: '04',
    icon: 'ri-file-text-line',
    title: 'Съдържание',
    desc: 'Създавайте съдържание, което продава. От блог статии до видео скриптове — стратегия, която носи резултати.',
  },
  {
    num: '05',
    icon: 'ri-share-line',
    title: 'Социални мрежи',
    desc: 'Изградете присъствие във всички ключови платформи. Органичен растеж и платени кампании, които работят.',
  },
  {
    num: '06',
    icon: 'ri-line-chart-line',
    title: 'Конверсия',
    desc: 'Превърнете посетителите в клиенти. CRO, A/B тестване и психология на продажбите.',
  },
  {
    num: '07',
    icon: 'ri-settings-line',
    title: 'Технически основи',
    desc: 'Домейни, хостинг, DNS, сигурност, бекъп. Всичко, от което се нуждае вашият дигитален бизнес.',
  },
  {
    num: '08',
    icon: 'ri-shield-check-line',
    title: 'Киберсигурност',
    desc: 'Защитете бизнеса си от хакери, malware и data breaches. Практически стъпки без да сте IT експерт.',
  },
  {
    num: '09',
    icon: 'ri-bar-chart-line',
    title: 'Аналитика',
    desc: 'Събирайте, анализирайте и използвайте data от всички канали. Решения базирани на факти, не на интуиция.',
  },
  {
    num: '10',
    icon: 'ri-refresh-line',
    title: 'Автоматизация',
    desc: 'Освободете времето си. Имейл, social media, lead capture — системи, които работят за вас 24/7.',
  },
];

export default function FunnelSystemSection() {
  return (
    <section className="w-full bg-[#FAFAF8] py-12 md:py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[11px] text-[#1C1C1E]/40 tracking-widest uppercase mb-2 font-medium">
            ПЪЛНА СИСТЕМА
          </p>
          <h2
            className="text-2xl md:text-4xl font-bold text-[#1C1C1E] leading-tight"
          >
            10 системи.{' '}
            <span className="text-amber-600">1000 стъпки.</span>{' '}
            Без излишна теория.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MODULES.map((mod) => (
            <div
              key={mod.num}
              className="p-4 rounded-2xl border border-[#1C1C1E]/6 bg-white hover:border-amber-200/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#1C1C1E]/4 flex items-center justify-center">
                  <i className={`${mod.icon} text-[#1C1C1E]/50 text-sm`} />
                </div>
                <span className="text-[10px] text-[#1C1C1E]/35 font-medium">100 ст.</span>
              </div>
              <div className="text-xs text-[#1C1C1E]/35 font-medium mb-1">{mod.num}</div>
              <h3 className="text-sm font-semibold text-[#1C1C1E] leading-snug mb-1.5">
                {mod.title}
              </h3>
              <p className="text-[11px] text-[#1C1C1E]/45 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 md:mt-8">
          {[
            { value: '1000', label: 'Конкретни стъпки' },
            { value: '10', label: 'Системи' },
            { value: '30', label: 'Дни до резултат' },
            { value: '∞', label: 'Доживотен достъп' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-3 md:p-4 rounded-2xl border border-[#1C1C1E]/6 bg-white"
            >
              <div className="text-xl md:text-2xl font-bold text-[#1C1C1E] mb-0.5">{stat.value}</div>
              <div className="text-[11px] text-[#1C1C1E]/45">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}