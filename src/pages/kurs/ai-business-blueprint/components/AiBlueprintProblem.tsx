export default function AiBlueprintProblem() {
  return (
    <section id="problem" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Проблемът</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Знаеш парчета. Нямаш система.
        <br />
        <em className="text-[#1C1C1E]/55">И точно това те държи на едно място.</em>
      </h2>

      <div className="space-y-4 text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
        <p>
          Познаваме този човек. Гледал е 47 YouTube видеа за "как да правя пари с AI".
          Има безплатен ChatGPT акаунт и е пробвал да генерира няколко поста за Facebook.
          Може би дори си е направил сайт през някой builder. Но клиенти? Приход? Система?
          <strong className="text-[#1C1C1E]"> Няма.</strong>
        </p>
        <p>
          Проблемът не е в липсата на информация — информация има повече от всякога.
          Проблемът е, че информацията е <strong className="text-[#1C1C1E]">разпокъсана</strong>.
          Един казва "прави SEO", друг казва "прави TikTok", трети казва "просто купи моя курс".
          Никой не ти дава последователността: първо направи това → после това → после това → ето ти клиент.
        </p>
        <p>
          В ТАВОРА ЕООД сме минали точно през този цикъл с десетки реални клиенти.
          Видели сме кои стъпки водят до #1 в Google (Sunrise Food, K-Food, NP Massage Studio)
          и кои са загуба на време.
          <strong className="text-[#1C1C1E]"> AI Business Blueprint</strong> е резултатът —
          последователността, подредена в 11 модула, без излишния шум.
        </p>
      </div>

      {/* The 4 pain points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: 'ri-puzzle-line',
            title: 'Разпокъсани знания',
            desc: 'Знаеш малко SEO, малко дизайн, малко AI prompting. Но тези парчета не се свързват в работеща система, която носи пари.',
          },
          {
            icon: 'ri-tools-line',
            title: 'Твърде много инструменти',
            desc: 'ChatGPT, Claude, Readdy, Canva, CapCut, Meta Ads, Google Analytics — кой инструмент за какво? В кой ред? Без roadmap е хаос.',
          },
          {
            icon: 'ri-error-warning-line',
            title: 'Нямаш proof of work',
            desc: 'Искаш клиенти, но нямаш портфолио. Искаш портфолио, но нямаш клиенти. Парадоксът на начинаещия — и как да го разбиеш.',
          },
          {
            icon: 'ri-timer-line',
            title: 'Губиш време в проба-грешка',
            desc: 'Всеки експеримент ти струва седмици. Ние сме направили грешките вместо теб — системата ти дава shortcut през тях.',
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

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
        {[
          { value: '11', label: 'модула · 32+ часа съдържание' },
          { value: '74+', label: 'урока с практически задачи' },
          { value: '3+', label: 'клиенти на #1 в Google и ChatGPT' },
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