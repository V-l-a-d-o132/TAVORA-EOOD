const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
};

const OUTCOMES = [
  {
    icon: 'ri-briefcase-line',
    title: 'Оформяш продаваема дигитална услуга',
    desc: 'Дефинираш какво точно предлагаш, за кого е то и защо някой би платил за него. От размита идея до ясна оферта.',
  },
  {
    icon: 'ri-layout-line',
    title: 'Създаваш сайт и оферта с AI',
    desc: 'Изграждаш сайт и оферта, които представят услугата ти професионално — с помощта на AI инструменти, стъпка по стъпка.',
  },
  {
    icon: 'ri-megaphone-line',
    title: 'Изграждаш система за съдържание и маркетинг',
    desc: 'Създаваш съдържание и маркетинг процес, който привлича хора към теб по предвидим начин — вместо случайни публикации.',
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Измерваш резултатите и подобряваш процеса',
    desc: 'Следиш какво работи и какво не, и коригираш посоката по данни — така системата ти става по-добра с всеки цикъл.',
  },
];

export default function AkademiyaOutcomesSection() {
  return (
    <section id="akademiya-outcomes" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Какво ще умееш</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Какъв практически резултат получаваш
          </h2>
          <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: C.textMuted }}>
            Не часове видео. Умение, което можеш да приложиш към собствена услуга или към бизнеса на клиенти.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {OUTCOMES.map((o, i) => (
            <div key={o.title} className="p-6 md:p-7 flex flex-col gap-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                  <i className={`${o.icon} text-base`} style={{ color: C.accent }} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textDim }}>
                  0{i + 1}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold mb-2" style={{ color: C.text }}>{o.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}