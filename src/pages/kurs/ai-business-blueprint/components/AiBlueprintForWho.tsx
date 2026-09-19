export default function AiBlueprintForWho() {
  return (
    <section id="za-kogo" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">За кого?</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        За кого е AI Business Blueprint —{' '}
        <em className="text-[#1C1C1E]/60">и за кого НЕ е.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-10 max-w-xl">
        Тази програма не е за всеки. И това е нарочно. Ето честно за кого работи — и за кого ще е загуба на време и пари.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* For who */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#22c55e]/20 bg-[#f0fdf4]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#22c55e]/15 shrink-0">
              <i className="ri-check-line text-sm text-[#16a34a]" />
            </div>
            <span className="text-sm font-medium text-[#1C1C1E]">За кого Е:</span>
          </div>
          <ul className="space-y-3">
            {[
              'Предприемачи, които искат да изградят онлайн бизнес с AI от нулата — без технически опит',
              'Фрийлансъри, които искат да добавят AI услуги към портфолиото си и да вдигнат цените',
              'Маркетинг специалисти, които искат да овладеят AI инструменти и да станат по-ценни на пазара',
              'Хора, които са пробвали разпокъсани YouTube туториали и искат най-накрая цялостна система',
              'Собственици на малък бизнес, които искат да дигитализират и автоматизират процесите си',
              'Всеки, който е готов да инвестира 3-6 месеца последователна работа срещу реален резултат',
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

        {/* Not for */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#e53e3e]/20 bg-[#fef2f2]">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e53e3e]/15 shrink-0">
              <i className="ri-close-line text-sm text-[#dc2626]" />
            </div>
            <span className="text-sm font-medium text-[#1C1C1E]">За кого НЕ Е:</span>
          </div>
          <ul className="space-y-3">
            {[
              'Хора, които търсят "бързи пари без работа" — тук става дума за изграждане на бизнес, не за схема',
              'Хора, които не са готови да отделят минимум 4-6 часа седмично за учене и прилагане',
              'Хора, които очакват резултат за 3 дни — първите платени проекти идват след модул 6',
              'Хора, които смятат, че AI ще свърши всичко вместо тях — AI е инструмент, не заместник',
              'Хора, които искат "още един сертификат за CV" — тук няма изпити, има реални проекти',
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