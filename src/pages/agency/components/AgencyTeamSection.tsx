const vladCredentials = [
  { icon: 'ri-line-chart-line', text: 'Няколко години практика в дигитален маркетинг и ПР' },
  { icon: 'ri-google-line', text: 'Доказани #1 позиции в Google — проверете сами' },
  { icon: 'ri-robot-line', text: 'Работи с AI инструменти в реална клиентска работа' },
  { icon: 'ri-tv-line', text: 'Участия в телевизии и конкурси по медийна грамотност' },
];

const nathanCredentials = [
  { icon: 'ri-instagram-line', text: 'Мениджър социални медии — стратегия и съдържание' },
  { icon: 'ri-camera-line', text: 'Участва пред камерата — видео съдържание за бизнеси' },
  { icon: 'ri-tiktok-line', text: 'TikTok и Instagram — органично и платено съдържание' },
  { icon: 'ri-team-line', text: 'Работи директно с клиентите по социалните канали' },
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

export default function AgencyTeamSection() {
  return (
    <section id="team" className="py-8 md:py-32 bg-white w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        <div className="flex items-center gap-3 mb-10 md:mb-14" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Екипът</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-14 md:mb-20">
          {/* Vladimir */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative shrink-0">
              <div className="relative rounded-2xl overflow-hidden w-[120px] h-[150px] sm:w-[140px] sm:h-[175px]">
                <img
                  src="https://static.readdy.ai/image/658b459fcf05a7723f8029c45615de2f/7ba027e5c67ece54f762f57dda00407f.png"
                  alt="Владимир Атанасов — дигитален маркетинг"
                  className="w-full h-full object-cover object-top grayscale"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E]/15 to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-lg font-light text-[#1C1C1E] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Владимир Атанасов
              </div>
              <div className="text-xs text-[#0A2540]/60 mb-3 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                Дигитален маркетинг · SEO · GEO · Реклами
              </div>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Няколко години в дигитален маркетинг и ПР. Знам какво искат хората — защото работя с тях директно.
                Всичко, което преподавам, го правя и за реални клиенти.
              </p>
              <div className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {vladCredentials.map((cred) => (
                  <div key={cred.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0">
                      <i className={`${cred.icon} text-xs text-[#0A2540]/60`} />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{cred.text}</span>
                  </div>
                ))}
              </div>
              <a
                href="https://www.google.com/search?q=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%D0%BE%D0%B2+%D0%BC%D0%B5%D0%B4%D0%B8%D0%B9%D0%BD%D0%B0+%D0%B3%D1%80%D0%B0%D0%BC%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#0A2540]/65 hover:text-[#0A2540] transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <i className="ri-search-line text-xs" />
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
              <div className="text-lg font-light text-[#1C1C1E] mb-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Натан Петков
              </div>
              <div className="text-xs text-[#0A2540]/60 mb-3 tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                Социални медии · Видео · TikTok · Instagram
              </div>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                Мениджър социални медии — стратегия, съдържание и управление. Участва пред камерата.
                Снимаме с професионална техника за най-добри резултати.
              </p>
              <div className="space-y-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {nathanCredentials.map((cred) => (
                  <div key={cred.text} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0">
                      <i className={`${cred.icon} text-xs text-[#0A2540]/60`} />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65">{cred.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#1C1C1E]/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                <i className="ri-camera-3-line text-xs" />
                <span>Снимаме с проф. камери, микрофони и осветление</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Реални проекти — проверете ги</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-start gap-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#1C1C1E]/20 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors">{p.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full text-white shrink-0" style={{ backgroundColor: p.tagColor }}>{p.tag}</span>
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.description}</p>
                </div>
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <i className="ri-external-link-line text-[#1C1C1E]/25 group-hover:text-[#0A2540]/65 transition-colors text-sm" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
