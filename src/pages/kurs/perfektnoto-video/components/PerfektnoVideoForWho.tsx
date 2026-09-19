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
        Видеото продава — но не всеки има нужда от пълна видео система. Ето честно за кого работи тази програма.
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
              'Собственици на бизнес, които знаят че видеото продава, но не знаят откъде да започнат',
              'Маркетолози, които искат да добавят видео продукция към услугите си',
              'Фрийлансъри, които искат да предлагат видео като платена услуга',
              'Хора, които са пробвали да снимат видеа, но не са доволни от резултатите',
              'Предприемачи с ограничен бюджет, които искат да започнат само с телефон',
              'Всеки, който иска система за видео — не просто "гледай YouTube и пробвай"',
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
            <span className="text-sm font-medium text-[#1C1C1E]">За кого НЕ Е:</span>
          </div>
          <ul className="space-y-3">
            {[
              'Хора, които очакват да станат оператори за 3 дни — видео продукцията изисква практика',
              'Хора, които нямат търпение да минат през подготвителните модули (стратегия, послание)',
              'Хора, които искат да снимат само за TikTok и нищо друго — системата е по-широка',
              'Хора, които не са готови да инвестират в минимална техника (дори бюджетна)',
              'Хора, които смятат че AI ще им направи видеата вместо тях — AI помага, но не замества продукцията',
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