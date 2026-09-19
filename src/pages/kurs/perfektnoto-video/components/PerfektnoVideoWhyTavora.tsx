export default function PerfektnoVideoWhyTavora() {
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
        ТАВОРА ЕООД не е "онлайн курс" — ние сме активна видео продукция и маркетинг агенция.
        Всеки модул е базиран на реални проекти, които сме заснели и продуцирали за платени клиенти.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: 'ri-camera-lens-line',
            title: 'Реална продукция, не теория',
            desc: 'Продуцирали сме видеа за K-Food (+280% трафик чрез видео), Академика 245 (милиони импресии, национално медийно покритие) и Амалипе. Техниките в модулите не са от YouTube — те са от сетове, на които сме били.',
          },
          {
            icon: 'ri-smartphone-line',
            title: 'Работи за всеки бюджет',
            desc: 'Модул 07 (Само с телефон) + Модул 09 (Професионална продукция) — системата покрива целия спектър. Не ти трябва RED камера да започнеш, но когато си готов да мащабираш, знаеш как да работиш с професионален екип.',
          },
          {
            icon: 'ri-shield-check-line',
            title: 'Доживотен достъп и обновления',
            desc: 'Плащаш веднъж и имаш достъп завинаги, включително бъдещи обновления на модулите. Без абонамент и без скрити такси.',
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
              Видео проекти с милиони импресии.
            </h3>
            <div className="space-y-2 text-sm text-white/75 leading-relaxed">
              <p>
                <strong className="text-white">K-Food Велико Търново</strong> — +280% органичен трафик чрез къси видеа за TikTok и Reels.
              </p>
              <p>
                <strong className="text-white">Академика 245</strong> — документален разказ с национално медийно покритие (bTV, Nova, БНТ).
              </p>
              <p>
                <strong className="text-white">Амалипе</strong> — видео кампания за образователна интеграция с милиони импресии.
              </p>
            </div>
          </div>
          <div className="text-center shrink-0">
            <div className="text-4xl md:text-5xl font-light text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>3+</div>
            <div className="text-xs text-white/65">клиентски видео проекта</div>
          </div>
        </div>
      </div>
    </section>
  );
}