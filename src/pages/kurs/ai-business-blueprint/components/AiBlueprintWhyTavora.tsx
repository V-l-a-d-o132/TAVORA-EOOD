export default function AiBlueprintWhyTavora() {
  return (
    <section id="zashto-tavora" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Защо Академия TAVORA?</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Първо го правим.{' '}
        <em className="text-[#1C1C1E]/55">После го преподаваме.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-10 max-w-xl">
        Не сме "ex-маркетолози", които вече не практикуват. ТАВОРА ЕООД е активна агенция —
        всеки ден работим с платени клиенти, тестваме AI инструменти, оптимизираме SEO.
        Това, което преподаваме, сме тествали върху реални проекти.
      </p>

      {/* Three differentiation pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: 'ri-flashlight-line',
            title: 'Активна агенция, не просто курс',
            desc: 'Всяка техника в модулите е тествана върху реални клиентски проекти. Не преподаваме теория от YouTube — преподаваме система, която използваме всеки ден за клиенти като Sunrise Food, K-Food и NP Massage Studio. Верифицируеми резултати: #1 в Google и ChatGPT.',
          },
          {
            icon: 'ri-shield-check-line',
            title: 'Доживотен достъп и обновления',
            desc: 'Плащаш веднъж и имаш достъп завинаги, включително бъдещи обновления на модулите. Без абонамент и без скрити такси.',
          },
          {
            icon: 'ri-stack-line',
            title: 'Система, не фрагменти',
            desc: 'Повечето обучения ти дават отделни тактики. Ние ти даваме 11-те модула в точната последователност: AI → дизайн → SEO/GEO → съдържание → аудитория → конверсия → мащабиране. Без празнини.',
          },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-2xl border border-[#1C1C1E]/8 bg-white flex flex-col items-start">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0A2540]/8 mb-4">
              <i className={`${item.icon} text-lg text-[#0A2540]`} />
            </div>
            <h4 className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</h4>
            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Verified results banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0F1F35] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Не на думи — с резултати, които можеш да провериш.
            </h3>
            <div className="space-y-2 text-sm text-white/75 leading-relaxed">
              <p>
                <strong className="text-white">Sunrise Food</strong> — #1 в Google за "гъби кладница онлайн". Отвори Google и провери.
              </p>
              <p>
                <strong className="text-white">K-Food Велико Търново</strong> — #1 в Google и ChatGPT за "корейска храна". Питай ChatGPT сега.
              </p>
              <p>
                <strong className="text-white">NP Massage Studio</strong> — #1 в Google и ChatGPT за масажи в региона.
              </p>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-4xl md:text-5xl font-light text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3+</div>
            <div className="text-xs text-white/65">клиенти на #1 в Google</div>
          </div>
        </div>
      </div>
    </section>
  );
}