export default function MarketingBasicsWhyTavora() {
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
        Marketing Basics не е академична теория. Това е стекът, който ТАВОРА ЕООД прилага всеки ден за реални клиенти.
        Всеки модул е извлечен от работа с бизнеси, които можете да проверите в Google.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: 'ri-building-2-line',
            title: 'Тествано върху реален бизнес',
            desc: 'Системата е приложена върху над 10 бизнеса — от Sunrise Food (#1 Google) до Thalysta (+340% продажби). Не преподаваме теория — преподаваме това, което работи.',
          },
          {
            icon: 'ri-stack-line',
            title: 'Пълният стек, не фрагменти',
            desc: '20 модула в 4 последователни групи. Не е "курс по SEO" или "курс по реклами" — това е цялата маркетинг машина от А до Я, подредена логически.',
          },
          {
            icon: 'ri-store-2-line',
            title: 'Оптимизирано за локален бизнес',
            desc: 'За разлика от generic маркетинг програми, Marketing Basics е проектиран специално за малък и локален бизнес. GBP, локално SEO, reviews, партньорства — нещата, които реално движат иглата.',
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

      <div className="p-6 md:p-8 rounded-2xl bg-[#0F1F35] text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Маркетинг система, доказана с резултати.
            </h3>
            <div className="space-y-2 text-sm text-white/75 leading-relaxed">
              <p>
                <strong className="text-white">Sunrise Food</strong> — #1 в Google за "гъби кладница онлайн" за 3-4 седмици с групи 1+2+3.
              </p>
              <p>
                <strong className="text-white">Thalysta</strong> — +340% продажби с ново позициониране, реклами и оптимизиран funnel (групи 1+3+4).
              </p>
              <p>
                <strong className="text-white">Budimse.online</strong> — +340% органичен трафик чрез SEO и съдържание (групи 2+3).
              </p>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-4xl md:text-5xl font-light text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3+</div>
            <div className="text-xs text-white/65">клиентски резултата</div>
          </div>
        </div>
      </div>
    </section>
  );
}