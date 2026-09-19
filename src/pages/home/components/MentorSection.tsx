import InlineIcon from '@/components/base/InlineIcon';

const services = [
  {
    icon: 'code',
    title: 'Изработка на сайт',
    desc: 'Базов сайт с вградено SEO — структура, скорост, Google Business Profile. За #1 позиции в Google (като kfood и sunrise) — цената зависи от конкуренцията и обема на работа.',
    tag: 'от 999 €',
    highlight: true,
  },
  {
    icon: 'global',
    title: 'Цялостно онлайн присъствие',
    desc: 'Сайт, SEO, GEO, социални медии, реклами — всичко под един покрив. За бизнеси, които искат реална онлайн видимост, не само красив сайт.',
    tag: 'по запитване',
  },
  {
    icon: 'advertisement',
    title: 'Рекламни кампании',
    desc: 'Meta, Google, YouTube, TikTok. Настройваме, управляваме и оптимизираме. Не шаблони — стратегия за конкретния ви бизнес и аудитория.',
    tag: 'от 290 € / мес.',
  },
  {
    icon: 'video',
    title: 'Видео продукция',
    desc: 'Снимаме с професионална техника — камери, микрофони, осветление. Натан участва пред камерата. Монтаж, субтитри, доставка в 5 работни дни.',
    tag: 'от 290 €',
  },
  {
    icon: 'search',
    title: 'SEO & GEO оптимизация',
    desc: 'Класиране в Google и AI търсачки (ChatGPT, Perplexity). On-page оптимизация, структурирани данни, Google Business Profile.',
    tag: '390 € еднократно',
  },
];

const vladCredentials = [
  { icon: 'line-chart', text: 'Няколко години практика в дигитален маркетинг и ПР' },
  { icon: 'google', text: 'Доказани #1 позиции в Google — проверете сами' },
  { icon: 'robot', text: 'Работи с AI инструменти в реална клиентска работа' },
  { icon: 'tv', text: 'Участия в телевизии и конкурси по медийна грамотност' },
];

const nathanCredentials = [
  { icon: 'instagram', text: 'Мениджър социални медии — стратегия и съдържание' },
  { icon: 'camera', text: 'Участва пред камерата — видео съдържание за бизнеси' },
  { icon: 'tiktok', text: 'TikTok и Instagram — органично и платено съдържание' },
  { icon: 'team', text: 'Работи директно с клиентите по социалните канали' },
];

const projects = [
  {
    name: 'Sunrise Food',
    url: 'https://sunrisefood.eu/',
    description: 'Изграждане на сайт от нула + SEO оптимизация. Резултат: #1 в Google за "гъби кладница онлайн" за ~3–4 седмици.',
    tag: '#1 Google',
    tagColor: '#1B4332',
  },
  {
    name: 'K-Food Велико Търново',
    url: 'https://k-foodvelikotarnovo.com/',
    description: 'SEO и GEO оптимизация на съществуващ сайт. Резултат: #1 в Google + топ препоръка в ChatGPT за 2–3 месеца.',
    tag: '#1 Google + ChatGPT',
    tagColor: '#8B1A1A',
  },
];

export default function MentorSection() {
  return (
    <section
      id="mentor"
      className="py-8 md:py-36 bg-[#F9F9F9] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">

        {/* Services */}
        <div className="mb-16 md:mb-24">
          <div
            className="flex items-center gap-3 mb-4 md:mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">Какво правим</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <h2
              className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Правим всичко,
              <br />
              <span className="italic text-[#0A2540]">което преподаваме.</span>
            </h2>
            <p
              className="text-sm text-[#1C1C1E]/60 leading-relaxed self-end max-w-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Не сме консултанти, които дават съвети. Правим реална работа за реални клиенти.
              Ако искате да го научите сами — има курс. Ако искате ние да го направим — пишете ни.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <div
                key={s.title}
                className={`p-5 md:p-6 rounded-2xl border ${s.highlight ? 'border-[#0A2540]/20 bg-[#0A2540]/3' : 'border-[#1C1C1E]/8 bg-white'} relative`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {s.highlight && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] tracking-wide">
                      БАЗОВ ПАКЕТ
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full border ${s.highlight ? 'border-[#0A2540]/20 bg-[#0A2540]/8' : 'border-[#0A2540]/15 bg-[#0A2540]/4'}`}>
                    <InlineIcon name={s.icon} className="w-4 h-4 text-[#0A2540]/70" />
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border whitespace-nowrap ${s.highlight ? 'border-[#0A2540]/20 text-[#0A2540]/70 font-medium' : 'border-[#1C1C1E]/10 text-[#1C1C1E]/60'}`}>
                    {s.tag}
                  </span>
                </div>
                <div className="text-sm font-medium text-[#1C1C1E] mb-2">{s.title}</div>
                <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">{s.desc}</p>
                {s.highlight && (
                  <p className="text-[10px] text-[#1C1C1E]/65 mt-3 leading-relaxed">
                    За #1 позиции в Google (като kfood и sunrise) — цената се определя индивидуално след анализ на конкуренцията.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div
            className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
              <InlineIcon name="information" className="w-4 h-4 text-[#1C1C1E]/60" />
            </div>
            <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
              Снимаме с професионална техника — камери, микрофони, осветление. Имаме доста опит и знаем какво искат хората.
              За директна работа с вашия бизнес:{' '}
              <a href="mailto:tavoraagency@gmail.com" className="text-[#0A2540] underline decoration-dotted">tavoraagency@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Team */}
        <div
          className="flex items-center gap-3 mb-10 md:mb-14"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">Екипът</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14 md:mb-20">

          {/* Vladimir */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="relative rounded-2xl overflow-hidden w-[120px] h-[150px] sm:w-[140px] sm:h-[175px]">
                <img
                  src="https://static.readdy.ai/image/658b459fcf05a7723f8029c45615de2f/7ba027e5c67ece54f762f57dda00407f.png"
                  alt="Владимир Атанасов — дигитален маркетинг и ПР"
                  className="w-full h-full object-cover object-top grayscale"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/15 to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="text-lg font-light text-[#1C1C1E] mb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Владимир Атанасов
              </div>
              <div
                className="text-xs text-[#0A2540]/60 mb-3 tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Дигитален маркетинг · SEO · GEO · Реклами
              </div>
              <p
                className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Няколко години в дигитален маркетинг и ПР. Знам какво искат хората — защото работя с тях директно.
                Всичко, което преподавам, го правя и за реални клиенти. Не теория от книги.
              </p>
              <div className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {vladCredentials.map((cred) => (
                  <div key={cred.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0">
                      <InlineIcon name={cred.icon} className="w-3.5 h-3.5 text-[#0A2540]/60" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{cred.text}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://www.google.com/search?q=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%D0%BE%D0%B2+%D0%BC%D0%B5%D0%B4%D0%B8%D0%B9%D0%BD%D0%B0+%D0%B3%D1%80%D0%B0%D0%BC%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#0A2540]/50 hover:text-[#0A2540] transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <InlineIcon name="search" className="w-3.5 h-3.5" />
                Потърсете в Google →
              </a>
            </div>
          </div>

          {/* Nathan */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="relative rounded-2xl overflow-hidden w-[120px] h-[150px] sm:w-[140px] sm:h-[175px] bg-[#F0EDE8]">
                <img
                  src="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/8d3b4d25-8dde-4da9-aa56-0ccd87c38867_NATAN-PETKOW.jpg?v=b599eefaf2a6b7b8cfbff0e3389d53fa"
                  alt="Натан Петков — мениджър социални медии"
                  className="w-full h-full object-cover object-top grayscale"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/15 to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <div
                className="text-lg font-light text-[#1C1C1E] mb-0.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Натан Петков
              </div>
              <div
                className="text-xs text-[#0A2540]/60 mb-3 tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Социални медии · Видео · TikTok · Instagram
              </div>
              <p
                className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Мениджър социални медии — стратегия, съдържание и управление. Участва пред камерата.
                Снимаме с професионална техника за най-добри резултати. Знае как работи алгоритъмът, защото го тества всеки ден.
              </p>
              <div className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {nathanCredentials.map((cred) => (
                  <div key={cred.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0">
                      <InlineIcon name={cred.icon} className="w-3.5 h-3.5 text-[#0A2540]/60" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{cred.text}</span>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 flex items-center gap-2 text-xs text-[#1C1C1E]/60"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <InlineIcon name="camera" className="w-3.5 h-3.5" />
                <span>Снимаме с проф. камери, микрофони и осветление</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase mb-4">Реални проекти — проверете ги</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/20 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">
                      {p.name}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ backgroundColor: p.tagColor }}
                    >
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">{p.description}</p>
                </div>
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <InlineIcon name="external-link" className="w-4 h-4 text-[#1C1C1E]/25 group-hover:text-[#0A2540]/50 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
