export default function PerfektnoVideoForWho() {
  return (
    <section id="za-kogo" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">За кого?</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        За кого е Перфектното Видео —{' '}
        <em className="text-[#1C1C1E]/60">и за кого НЕ е.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-10 max-w-xl">
        Програмата е за хора, които искат да разбират как решенията при снимане и монтаж влияят на историята.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="p-6 md:p-8 rounded-2xl border border-[#22c55e]/20 bg-[#f0fdf4]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#22c55e]/15 shrink-0">
              <i className="ri-check-line text-sm text-[#16a34a]" />
            </div>
            <span className="text-sm font-medium text-[#1C1C1E]">За кого Е:</span>
          </div>
          <ul className="space-y-3">
            {[
              'Собственици на бизнес, които искат да показват продукта или услугата си ясно',
              'Маркетолози, които искат да добавят видео продукция към услугите си',
              'Фрийлансъри, които искат да предлагат видео като платена услуга',
              'Хора, които са пробвали да снимат видеа, но не са доволни от резултатите',
              'Предприемачи с ограничен бюджет, които искат да започнат само с телефон',
              'Хора, които искат обяснен работен ред и обратна връзка по решенията',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5 bg-[#22c55e]/15">
                  <i className="ri-check-line text-[9px] text-[#16a34a]" />
                </div>
                <span className="text-xs text-[#1C1C1E]/70 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-[#e53e3e]/20 bg-[#fef2f2]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e53e3e]/15 shrink-0">
              <i className="ri-close-line text-sm text-[#dc2626]" />
            </div>
            <span className="text-sm font-medium text-[#1C1C1E]">Кога е нужен друг формат:</span>
          </div>
          <ul className="space-y-3">
            {[
              'Искаш преподавател да прегледа и оцени твой заснет клип',
              'Търсиш обучение само за бутоните на един конкретен редактор',
              'Нужни са ти присъствени снимки с екип и обратна връзка на място',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <div className="w-4 h-4 flex items-center justify-center rounded-full shrink-0 mt-0.5 bg-[#e53e3e]/15">
                  <i className="ri-close-line text-[9px] text-[#dc2626]" />
                </div>
                <span className="text-xs text-[#1C1C1E]/70 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
