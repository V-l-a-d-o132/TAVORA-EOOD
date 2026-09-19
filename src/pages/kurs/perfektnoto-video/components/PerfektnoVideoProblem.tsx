export default function PerfektnoVideoProblem() {
  return (
    <section id="problem" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Проблемът</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Знаеш, че видеото продава.{' '}
        <em className="text-[#1C1C1E]/55">Но не знаеш откъде да започнеш.</em>
      </h2>

      <div className="space-y-4 text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
        <p>
          През 2026 видеото е <strong className="text-[#1C1C1E]">#1 ранкинг фактор</strong> в дигиталния маркетинг.
          Бизнеси с видео конвертират 3 пъти по-добре. Google дава приоритет на страници с видео.
          ChatGPT и Perplexity цитират видео съдържание в AI отговорите.
          Ако нямаш видео — буквално не съществуваш за голяма част от аудиторията си.
        </p>
        <p>
          Но проблемът на повечето бизнеси не е "нямам камера". Проблемът е <strong className="text-[#1C1C1E]">"нямам система"</strong>.
          Правят видеа без стратегия, без скрипт, без план за разпространение.
          Чувстват се неудобно пред камера. Нямат бюджет за продукция.
          А когато все пак направят нещо — то не конвертира.
        </p>
        <p>
          <strong className="text-[#1C1C1E]">Перфектното Видео</strong> решава и трите проблема едновременно.
          Система от 15 модула, която работи и за човека само с телефон, и за този с достъп до професионална продукция.
          Тествано върху проекти с милиони импресии — K-Food (+280% органичен трафик чрез видео), Академика 245 (национално медийно покритие).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: 'ri-emotion-unhappy-line',
            title: 'Неудобно ти е пред камера',
            desc: 'Модули 01-03 решават това преди изобщо да си включил камерата. Стратегия, послание, подготовка — когато знаеш какво правиш, страхът изчезва.',
          },
          {
            icon: 'ri-money-dollar-circle-line',
            title: 'Нямаш бюджет за продукция',
            desc: 'Модул 07 (Само с телефон) ти показва как да снимаш професионално изглеждащо видео с устройството в джоба ти. Без допълнителна техника.',
          },
          {
            icon: 'ri-line-chart-line',
            title: 'Правил си видеа, но не конвертират',
            desc: 'Модули 02 (Посланието) и 08 (След снимката) покриват точно това — как да направиш видео, което не просто изглежда добре, а носи продажби.',
          },
          {
            icon: 'ri-puzzle-line',
            title: 'Нямаш цялостен процес',
            desc: 'Без система снимаш "нещо", качваш "някъде" и се надяваш. С 15-те модула имаш repeatable процес от диагностика до финален продукт.',
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
          { value: '15', label: 'модула · 20+ часа съдържание' },
          { value: '241', label: 'урока с практически задачи' },
          { value: '+280%', label: 'ръст на трафик с видео (K-Food)' },
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