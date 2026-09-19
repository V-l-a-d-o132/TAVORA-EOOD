const PROOF_ITEMS = [
  {
    client: 'Sunrise Food',
    role: 'Онлайн магазин за гъби',
    result: '#1 в Google за "гъби кладница"',
    detail: 'От нула до първа страница за 3 месеца. Без платени реклами. Само със системата за SEO.',
    stat: '+340%',
    statLabel: 'органичен трафик',
    avatarBg: 'bg-emerald-100',
    avatarIcon: 'ri-store-2-line',
    avatarColor: 'text-emerald-600',
  },
  {
    client: 'K-Food',
    role: 'Корейски ресторант',
    result: '#1 в Google и ChatGPT',
    detail: 'GEO + класическо SEO. Двойно присъствие — и в Google, и в AI отговорите. Клиентите идват от два канала.',
    stat: '+215%',
    statLabel: 'резервации',
    avatarBg: 'bg-amber-100',
    avatarIcon: 'ri-restaurant-line',
    avatarColor: 'text-amber-600',
  },
  {
    client: 'NP Massage Studio',
    role: 'Масажно студио',
    result: '#1 за "масажи Търново"',
    detail: 'Локална SEO доминация. GBP оптимизация + съдържание + GEO. Трите стълба на системата в действие.',
    stat: '+180%',
    statLabel: 'нови клиенти',
    avatarBg: 'bg-rose-100',
    avatarIcon: 'ri-heart-pulse-line',
    avatarColor: 'text-rose-600',
  },
  {
    client: 'Thalysta',
    role: 'E-commerce марка',
    result: 'От 0 до 5000€/месец',
    detail: 'Изграждане от нулата. SEO съдържание + платени кампании + конверсионна оптимизация по системата.',
    stat: '5000€',
    statLabel: 'месечен приход',
    avatarBg: 'bg-violet-100',
    avatarIcon: 'ri-shopping-bag-3-line',
    avatarColor: 'text-violet-600',
  },
  {
    client: 'Budimse',
    role: 'Онлайн платформа',
    result: 'Топ 3 за 5 ключови думи',
    detail: 'Платформа за услуги. Пълната SEO система — от keyword research до линк билдинг. 5 ключови думи в топ 3.',
    stat: '5',
    statLabel: 'ключови думи в топ 3',
    avatarBg: 'bg-sky-100',
    avatarIcon: 'ri-global-line',
    avatarColor: 'text-sky-600',
  },
];

const STATS_ROW = [
  { value: '500+', label: 'Доволни клиенти', icon: 'ri-user-smile-line' },
  { value: '94%', label: 'Препоръчват ни', icon: 'ri-thumb-up-line' },
  { value: '1000+', label: 'Стъпки в системата', icon: 'ri-list-check-3' },
  { value: '30 дни', label: 'До първи резултат', icon: 'ri-timer-line' },
];

export default function FunnelProofSection() {
  return (
    <section className="w-full bg-white py-12 md:py-20 px-4 md:px-8 lg:px-16 border-t border-[#1C1C1E]/5">
      <div className="max-w-5xl mx-auto">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 md:mb-16">
          {STATS_ROW.map((stat) => (
            <div key={stat.label} className="text-center p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/6 bg-[#FAFAF8]">
              <div className="w-8 h-8 rounded-lg bg-[#1C1C1E]/3 flex items-center justify-center mx-auto mb-3">
                <i className={`${stat.icon} text-[#1C1C1E]/40 text-sm`} />
              </div>
              <div className="text-xl md:text-2xl font-bold text-[#1C1C1E] mb-0.5">{stat.value}</div>
              <div className="text-[11px] text-[#1C1C1E]/45">{stat.label}</div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#1C1C1E]/40 tracking-widest uppercase mb-2 font-medium text-center">
          РЕАЛНИ РЕЗУЛТАТИ · РЕАЛНИ БИЗНЕСИ
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#1C1C1E] leading-tight mb-2 text-center">
          Същата методология.{' '}
          <span className="text-amber-600">Приложена. Потвърдена.</span>
        </h2>
        <p className="text-sm text-[#1C1C1E]/50 text-center mb-8 md:mb-12 max-w-lg mx-auto leading-relaxed">
          Това не са хипотетични примери. Това са клиенти, които използват точните стъпки от системата.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROOF_ITEMS.map((item) => (
            <div
              key={item.client}
              className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAF8] flex flex-col hover:border-amber-200/50 transition-colors group"
            >
              {/* Client header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${item.avatarBg} flex items-center justify-center shrink-0`}>
                  <i className={`${item.avatarIcon} ${item.avatarColor} text-base`} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1C1C1E] leading-tight">{item.client}</div>
                  <div className="text-[10px] text-[#1C1C1E]/40">{item.role}</div>
                </div>
              </div>

              {/* Result */}
              <p className="text-sm font-bold text-[#1C1C1E] leading-snug mb-2">
                {item.result}
              </p>
              <p className="text-xs text-[#1C1C1E]/50 leading-relaxed mb-4 flex-1">
                {item.detail}
              </p>

              {/* Stat highlight */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#1C1C1E]/5">
                <span className="text-lg md:text-xl font-bold text-amber-600">{item.stat}</span>
                <span className="text-[11px] text-[#1C1C1E]/45 leading-tight">{item.statLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA in proof section */}
        <div className="text-center mt-10 md:mt-12">
          <p className="text-sm text-[#1C1C1E]/55 mb-3">
            Искаш същите резултати за твоя бизнес?
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-amber-400 text-[#1C1C1E] text-sm font-semibold hover:bg-amber-50 transition-all cursor-pointer whitespace-nowrap"
          >
            Виж пакетите
            <i className="ri-arrow-down-line" />
          </a>
        </div>
      </div>
    </section>
  );
}