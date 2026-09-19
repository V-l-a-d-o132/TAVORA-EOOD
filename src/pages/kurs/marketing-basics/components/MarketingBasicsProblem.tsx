export default function MarketingBasicsProblem() {
  return (
    <section id="problem" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Проблемът</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Правиш маркетинг на парче.{' '}
        <em className="text-[#1C1C1E]/55">И точно затова не работи.</em>
      </h2>

      <div className="space-y-4 text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
        <p>
          Познаваме този бизнес. Пуснал е една Facebook реклама миналия месец. Написал е 3 поста в Instagram.
          Има Google Business Profile, но не го е обновявал от 6 месеца. Правил е "нещо като SEO" преди година.
          И се чуди защо <strong className="text-[#1C1C1E]">няма клиенти</strong>.
        </p>
        <p>
          Маркетингът работи само когато е <strong className="text-[#1C1C1E]">система</strong>.
          Когато всяко действие е част от по-голям план. Когато знаеш кой е идеалният ти клиент (Модул 02),
          какво да му кажеш (Модул 03), къде да те намери (Модули 05-08), как да го доведеш (Модули 11-15)
          и какво да направи като дойде (Модули 16-20). Без тази последователност — просто гориш бюджет.
        </p>
        <p>
          <strong className="text-[#1C1C1E]">Marketing Basics</strong> не е "още един маркетинг курс".
          Това е стекът, който ТАВОРА ЕООД прилага за реални клиенти —
          от Sunrise Food (#1 Google за 3 седмици) до Thalysta (+340% продажби).
          Всеки модул е тестван. Всеки резултат е верифицируем.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: 'ri-user-search-line',
            title: 'Не знаеш кой е клиентът ти',
            desc: 'Ако не знаеш кой купува — не знаеш на кого говориш. Модули 01-04 ти помагат да дефинираш идеалния клиент, посланието и цената.',
          },
          {
            icon: 'ri-radar-line',
            title: 'Не те намират',
            desc: 'Google Business Profile, локално SEO, сайт — ако ги нямаш или не са оптимизирани, клиентите отиват при конкурента. Модули 05-10.',
          },
          {
            icon: 'ri-traffic-light-line',
            title: 'Нямаш предвидим трафик',
            desc: 'Един месец имаш клиенти, следващия — не. Трябва ти система за постоянен поток. Модули 11-15 покриват органичен и платен трафик.',
          },
          {
            icon: 'ri-exchange-funds-line',
            title: 'Не превръщаш интереса в продажби',
            desc: 'Идват хора, но не купуват. Нямаш фуния, лийд магнити, последващи имейли. Модули 16-20 са за превръщането на трафик в revenue.',
          },
        ].map((item) => (
          <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white flex items-start gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0 bg-[#0A2540]/6">
              <i className={`${item.icon} text-sm text-[#0A2540]`} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
        {[
          { value: '20', label: 'модула · 18+ часа съдържание' },
          { value: '177+', label: 'урока с практически задачи' },
          { value: '4 групи', label: 'позициониране → превръщане' },
          { value: '30 дни', label: 'гаранция за възстановяване на сумата' },
        ].map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
            <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}