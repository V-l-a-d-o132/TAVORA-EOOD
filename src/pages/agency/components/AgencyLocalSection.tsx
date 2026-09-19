import { Link } from 'react-router-dom';

export default function AgencyLocalSection() {
  const regions = [
    {
      icon: 'ri-map-pin-2-line',
      city: 'Велико Търново',
      label: 'Основен пазар',
      desc: 'Активно работим с бизнеси от Велико Търново и областта — ресторанти, хотели, местни услуги и търговци.',
    },
    {
      icon: 'ri-building-2-line',
      city: 'Цяла България',
      label: 'Национален обхват',
      desc: 'Работим дистанционно с клиенти от цялата страна. Резултатите не зависят от географията.',
    },
    {
      icon: 'ri-home-office-line',
      city: 'Велико Търново',
      label: 'Физически офис',
      desc: 'Физически офис във Велико Търново. ТАВОРА ЕООД е лицензиран доставчик на дигитален маркетинг.',
    },
  ];

  const stats = [
    { value: 'ВТ', label: 'Основен фокус' },
    { value: '100%', label: 'Дистанционна работа' },
    { value: 'BG', label: 'Национален обхват' },
  ];

  return (
    <section
      id="local"
      className="py-8 md:py-28 w-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2540 0%, #0d3060 100%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 md:mb-14">
          <div className="w-8 h-[1px] bg-white/30 shrink-0" />
          <span className="text-xs text-white/75 tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
            Локален фокус
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <h2
              className="text-2xl md:text-5xl font-light text-white leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Дигитален маркетинг
              <br />
              <span className="italic text-white/70">за Велико Търново</span>
              <br />
              <span className="text-white/75 text-xl md:text-3xl">и цяла България.</span>
            </h2>
            <p
              className="text-sm text-white/75 leading-relaxed mb-8 max-w-md"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Основният ни пазар е Велико Търново и Търновска област — познаваме местния бизнес климат, конкуренцията и търсенето. Работим и с клиенти от цялата страна изцяло дистанционно.
            </p>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 mb-10">
              {stats.map((s) => (
                <div key={s.label}>
                  <p
                    className="text-xl md:text-3xl font-light text-white mb-1"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[10px] md:text-xs text-white/75" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/kontakt"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3 bg-white text-[#0A2540] text-sm font-medium rounded-full hover:bg-white/90 transition-all duration-300 cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Поискайте оферта
              <i className="ri-arrow-right-line text-sm" />
            </Link>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link to="/imash-nujnoto" className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-white/75 hover:border-white/25 hover:text-white/70 transition-all whitespace-nowrap">Имаш нужното</Link>
              <Link to="/novini" className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-white/75 hover:border-white/25 hover:text-white/70 transition-all whitespace-nowrap">Новини</Link>
              <Link to="/blog" className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-white/75 hover:border-white/25 hover:text-white/70 transition-all whitespace-nowrap">SEO Блог</Link>
            </div>
          </div>

          {/* Right: Region cards */}
          <div className="space-y-3 md:space-y-4">
            {regions.map((r) => (
              <div
                key={r.city}
                className="p-4 md:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/10 shrink-0">
                    <i className={`${r.icon} text-white/70 text-base`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-base font-medium text-white"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {r.city}
                      </span>
                      <span
                        className="text-xs text-white/75 px-2 py-0.5 rounded-full border border-white/15 whitespace-nowrap"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {r.label}
                      </span>
                    </div>
                    <p className="text-xs text-white/75 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {r.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* GEO note */}
            <div className="p-4 rounded-xl border border-white/8 bg-white/3">
              <div className="flex items-center gap-2 mb-1.5">
                <i className="ri-search-eye-line text-white/75 text-sm" />
                <span className="text-xs font-medium text-white/75" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Защо местното SEO има значение?
                </span>
              </div>
              <p className="text-xs text-white/75 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Когато някой в Търново търси „ресторант близо до мен" или „счетоводител Велико Търново" — вашият бизнес трябва да е на първо място. Точно това правим.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
