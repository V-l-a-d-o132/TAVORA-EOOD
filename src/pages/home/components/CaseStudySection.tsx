import InlineIcon from '@/components/base/InlineIcon';

export default function CaseStudySection() {
  return (
    <section id="case-study" className="py-8 md:py-32 bg-[#F9F9F9] w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-16">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-5 md:mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">Верифицируеми резултати</span>
        </div>

        {/* Heading */}
        <div className="mb-6 md:mb-10">
          <h2
            className="text-2xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-3 md:mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Работили сме с много бизнеси.{' '}
            <span className="italic text-[#1B4332]">Ето резултатите, които можете да проверите.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/70 max-w-2xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            През годините сме създали сайтове, реклами, видеа и SEO кампании за десетки бизнеси и НПО организации.
            По-долу са клиентите, при които сме правили абсолютно всичко — от сайт до реклами и SEO.
            Всеки линк е жив — проверете го сега.
          </p>
        </div>

        {/* Honest disclaimer */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl border border-[#0A2540]/12 bg-[#0A2540]/3 mb-8 md:mb-12"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
            <InlineIcon name="information" className="w-4 h-4 text-[#0A2540]/80" />
          </div>
          <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
            <strong className="text-[#1C1C1E]/80">Какво показваме тук?</strong> Само клиенти, за които сме направили пълен пакет — сайт, SEO, реклами и/или видео.
            Не показваме клиенти, за които сме правили само една услуга. Всеки сайт е жив, всеки резултат е проверим.
          </p>
        </div>

        {/* Case 1: Sunrise Food */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-1 h-5 bg-[#1B4332] rounded-full shrink-0" />
            <span className="text-xs font-semibold text-[#1B4332] tracking-widest uppercase">Пълен пакет — Sunrise Food</span>
            <a
              href="https://sunrisefood.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#1B4332]/60 underline decoration-dotted hover:text-[#1B4332] transition-colors cursor-pointer"
            >
              sunrisefood.eu ↗
            </a>
          </div>

          {/* What was done */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво е направено</div>
              <ul className="space-y-1.5">
                {[
                  'Изграждане на сайт от нула',
                  'Keyword research за нишата',
                  'On-page SEO оптимизация',
                  'Структурирани данни (Schema)',
                  'Google Business Profile',
                  'Съдържание с AI (Gemini)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="checkbox-circle" className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Колко отне</div>
              <div className="text-2xl font-light text-[#1B4332] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>~3–4 седмици</div>
              <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                От нулев сайт до #1 позиция за основното търсене. Нишата е с умерена конкуренция — това имаше значение.
              </p>
              <div className="mt-3 pt-3 border-t border-[#1C1C1E]/6">
                <div className="text-[10px] text-[#1C1C1E]/70 mb-1">Инструменти</div>
                <div className="flex flex-wrap gap-1">
                  {['Gemini', 'Google Search Console', 'Schema.org', 'Google Business'].map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/8 text-[#1B4332]/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво може да не се повтори</div>
              <ul className="space-y-1.5">
                {[
                  'Нишата е специфична — по-малко конкуренция',
                  'Клиентът е производител — автентичност помага',
                  'При по-конкурентна ниша — по-дълго',
                  'Резултатите зависят от изпълнението',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="alert" className="w-4 h-4 text-[#C0392B]/70 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* Google SERP - Sunrise */}
            <div className="rounded-2xl overflow-hidden bg-white border border-[#1C1C1E]/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-[#1C1C1E]/6 bg-[#F5F5F5] shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white rounded text-[10px] text-[#1C1C1E]/65 border border-[#1C1C1E]/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  google.com/search?q=гъби+кладница+онлайн
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-base font-bold shrink-0">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                  <div className="flex-1 px-3 py-1.5 border border-[#1C1C1E]/15 rounded-full text-xs text-[#1C1C1E]/65 truncate min-w-0">
                    гъби кладница онлайн
                  </div>
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 mb-3">Около 2,140,000 резултата (0.31 сек)</div>
                <div className="border border-[#1B4332]/25 rounded-xl p-3 bg-[#1B4332]/4 mb-2 relative">
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#1B4332] text-white text-[9px] rounded-full tracking-wide font-medium">
                    #1 ПОЗИЦИЯ
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#1B4332]/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    </div>
                    <a href="https://sunrisefood.eu/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#1C1C1E]/60 hover:text-[#1B4332] transition-colors cursor-pointer">sunrisefood.eu</a>
                  </div>
                  <div className="text-sm font-medium text-[#0A2540] mb-1 leading-snug">
                    Гъби Кладница Онлайн – Sunrise Food
                  </div>
                  <div className="text-[11px] text-[#1C1C1E]/70 leading-relaxed">
                    Прясна кладница от производител. Доставка директно от фермата.
                  </div>
                </div>
                {[
                  { domain: 'bazar.bg', title: 'Гъби кладница – обяви' },
                  { domain: 'olx.bg', title: 'Кладница гъби – OLX.bg' },
                  { domain: 'emag.bg', title: 'Гъби кладница – eMAG' },
                ].map((r, i) => (
                  <div key={i} className="py-1.5 border-b border-[#1C1C1E]/5 opacity-30">
                    <div className="text-[10px] text-[#1C1C1E]/65">{r.domain}</div>
                    <div className="text-xs text-[#0A2540]/60">{r.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ChatGPT - Sunrise */}
            <div className="rounded-2xl overflow-hidden bg-[#212121] border border-white/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-white/8 bg-[#171717] shrink-0">
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white/8 rounded text-[10px] text-white/75 border border-white/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  chatgpt.com
                </div>
              </div>
              <div className="flex-1 p-4 md:p-5 flex flex-col gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0">
                    <InlineIcon name="openai" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[11px] text-white/75">ChatGPT</span>
                  <span className="text-[10px] text-white/75 bg-white/8 px-2 py-0.5 rounded-full">GPT-4o</span>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-[#2F2F2F] rounded-2xl rounded-tr-sm px-3 py-2">
                    <p className="text-xs text-white/95 leading-relaxed">Откъде да си купя гъби кладница онлайн?</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5">
                    <InlineIcon name="openai" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <p className="text-xs text-white/90 leading-relaxed">За пресни гъби кладница с онлайн доставка в България, препоръчвам:</p>
                    <div className="bg-[#10a37f]/10 border border-[#10a37f]/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#10a37f]/20 flex items-center justify-center shrink-0">
                          <InlineIcon name="star" className="w-2.5 h-2.5 text-[#10a37f]" />
                        </div>
                        <span className="text-[10px] text-[#10a37f] font-semibold uppercase tracking-wider">Топ препоръка</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-white">Sunrise Food</span>
                        <a href="https://sunrisefood.eu/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#10a37f] hover:underline cursor-pointer">sunrisefood.eu</a>
                      </div>
                      <p className="text-[11px] text-white/85 leading-relaxed">Производител с директна онлайн доставка. Доверен доставчик на Kaufland, Lidl и Fantastico.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2 bg-[#2F2F2F] rounded-xl px-3 py-2 border border-white/8">
                  <span className="text-xs text-white/75 flex-1">Изпратете съобщение...</span>
                  <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                    <i className="ri-arrow-up-line text-white/75 text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 md:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
          <span className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase">втори клиент</span>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
        </div>

        {/* Case 2: K-Food */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-1 h-5 bg-[#C0392B] rounded-full shrink-0" />
            <span className="text-xs font-semibold text-[#C0392B] tracking-widest uppercase">Пълен пакет — K-Food Велико Търново</span>
            <a
              href="https://k-foodvelikotarnovo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#C0392B]/60 underline decoration-dotted hover:text-[#C0392B] transition-colors cursor-pointer"
            >
              k-foodvelikotarnovo.com ↗
            </a>
          </div>

          {/* What was done */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво е направено</div>
              <ul className="space-y-1.5">
                {[
                  'Редизайн и SEO оптимизация на сайт',
                  'Съдържание на продуктови категории',
                  'GEO оптимизация за AI търсачки',
                  'Вътрешна линк структура',
                  'Локално SEO за Велико Търново',
                  'Мета данни и Open Graph',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="checkbox-circle" className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Колко отне</div>
              <div className="text-2xl font-light text-[#C0392B] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>2–3 месеца</div>
              <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                По-дълго от Sunrise Food — националното търсене е по-конкурентно. ChatGPT препоръката дойде след около 6 седмици.
              </p>
              <div className="mt-3 pt-3 border-t border-[#1C1C1E]/6">
                <div className="text-[10px] text-[#1C1C1E]/70 mb-1">Инструменти</div>
                <div className="flex flex-wrap gap-1">
                  {['Gemini', 'ChatGPT', 'Ahrefs', 'Schema.org', 'GSC'].map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#C0392B]/8 text-[#C0392B]/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво може да не се повтори</div>
              <ul className="space-y-1.5">
                {[
                  'Корейската ниша е специфична в BG',
                  'Малко местна конкуренция онлайн',
                  'ChatGPT препоръките се менят',
                  'Нужна е постоянна поддръжка',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="alert" className="w-4 h-4 text-[#C0392B]/70 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* Google SERP - K-Food */}
            <div className="rounded-2xl overflow-hidden bg-white border border-[#1C1C1E]/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-[#1C1C1E]/6 bg-[#F5F5F5] shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white rounded text-[10px] text-[#1C1C1E]/65 border border-[#1C1C1E]/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  google.com/search?q=корейска+храна+онлайн
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-base font-bold shrink-0">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                  <div className="flex-1 px-3 py-1.5 border border-[#1C1C1E]/15 rounded-full text-xs text-[#1C1C1E]/65 truncate min-w-0">
                    корейска храна онлайн
                  </div>
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 mb-3">Около 1,870,000 резултата (0.28 сек)</div>
                <div className="border border-[#C0392B]/25 rounded-xl p-3 bg-[#C0392B]/4 mb-2 relative">
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#C0392B] text-white text-[9px] rounded-full tracking-wide font-medium">
                    #1 ПОЗИЦИЯ
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#C0392B]/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                    </div>
                    <a href="https://k-foodvelikotarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#1C1C1E]/60 hover:text-[#C0392B] transition-colors cursor-pointer">k-foodvelikotarnovo.com</a>
                  </div>
                  <div className="text-sm font-medium text-[#0A2540] mb-1 leading-snug">
                    Корейска Храна Онлайн – K-Food Велико Търново
                  </div>
                  <div className="text-[11px] text-[#1C1C1E]/70 leading-relaxed">
                    Автентична корейска храна с доставка в цяла България. Поръчайте онлайн.
                  </div>
                </div>
                {[
                  { domain: 'emag.bg', title: 'Корейска храна – eMAG' },
                  { domain: 'bazar.bg', title: 'Корейски продукти – обяви' },
                  { domain: 'amazon.de', title: 'Korean Food – Amazon' },
                ].map((r, i) => (
                  <div key={i} className="py-1.5 border-b border-[#1C1C1E]/5 opacity-30">
                    <div className="text-[10px] text-[#1C1C1E]/65">{r.domain}</div>
                    <div className="text-xs text-[#0A2540]/60">{r.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ChatGPT - K-Food */}
            <div className="rounded-2xl overflow-hidden bg-[#212121] border border-white/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-white/8 bg-[#171717] shrink-0">
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white/8 rounded text-[10px] text-white/75 border border-white/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  chatgpt.com
                </div>
              </div>
              <div className="flex-1 p-4 md:p-5 flex flex-col gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0">
                    <InlineIcon name="openai" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[11px] text-white/75">ChatGPT</span>
                  <span className="text-[10px] text-white/75 bg-white/8 px-2 py-0.5 rounded-full">GPT-4o</span>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-[#2F2F2F] rounded-2xl rounded-tr-sm px-3 py-2">
                    <p className="text-xs text-white/95 leading-relaxed">От кой български сайт да си поръчам корейска храна?</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5">
                    <InlineIcon name="openai" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <p className="text-xs text-white/90 leading-relaxed">За автентична корейска храна с доставка в България, препоръчвам:</p>
                    <div className="bg-[#C0392B]/10 border border-[#C0392B]/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#C0392B]/20 flex items-center justify-center shrink-0">
                          <InlineIcon name="star" className="w-2.5 h-2.5 text-[#C0392B]" />
                        </div>
                        <span className="text-[10px] text-[#C0392B] font-semibold uppercase tracking-wider">Топ препоръка</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-white">K-Food Велико Търново</span>
                        <a href="https://k-foodvelikotarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#C0392B] hover:underline cursor-pointer">k-foodvelikotarnovo.com</a>
                      </div>
                      <p className="text-[11px] text-white/85 leading-relaxed">Специализиран онлайн магазин за корейска храна. Доставка в цяла България.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2 bg-[#2F2F2F] rounded-xl px-3 py-2 border border-white/8">
                  <span className="text-xs text-white/75 flex-1">Изпратете съобщение...</span>
                  <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                    <i className="ri-arrow-up-line text-white/75 text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 md:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
          <span className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase">трети клиент</span>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
        </div>

        {/* Case 3: NP Massage Studio */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-1 h-5 bg-[#E8A87C] rounded-full shrink-0" />
            <span className="text-xs font-semibold text-[#E8A87C] tracking-widest uppercase">Пълен пакет — NP Massage Studio</span>
            <a
              href="https://npmassagestudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#E8A87C]/60 underline decoration-dotted hover:text-[#E8A87C] transition-colors cursor-pointer"
            >
              npmassagestudio.com ↗
            </a>
          </div>

          {/* What was done */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво е направено</div>
              <ul className="space-y-1.5">
                {[
                  'Изграждане на сайт от нула',
                  'SEO оптимизация за локално търсене',
                  'GEO оптимизация за AI търсачки',
                  'Структурирани данни (LocalBusiness Schema)',
                  'Google Business Profile оптимизация',
                  'Многоезична структура (BG + EN)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="checkbox-circle" className="w-4 h-4 text-[#E8A87C] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Колко отне</div>
              <div className="text-2xl font-light text-[#E8A87C] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>~4–6 седмици</div>
              <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                От нулев сайт до #1 в Google за "massages tarnovo" и #1 в ChatGPT за масажи в Търново. Две локации — Павликени и Велико Търново.
              </p>
              <div className="mt-3 pt-3 border-t border-[#1C1C1E]/6">
                <div className="text-[10px] text-[#1C1C1E]/70 mb-1">Инструменти</div>
                <div className="flex flex-wrap gap-1">
                  {['Schema.org', 'GEO', 'Local SEO', 'Google Business', 'GSC'].map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8A87C]/8 text-[#E8A87C]/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво може да не се повтори</div>
              <ul className="space-y-1.5">
                {[
                  'Локалната ниша е по-лесна за SEO',
                  'Две локации помагат за geo покритие',
                  'ChatGPT препоръките се обновяват',
                  'Нужна е редовна поддръжка на GBP',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="alert" className="w-4 h-4 text-[#C0392B]/70 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* Google SERP - NP Massage Studio */}
            <div className="rounded-2xl overflow-hidden bg-white border border-[#1C1C1E]/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-[#1C1C1E]/6 bg-[#F5F5F5] shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white rounded text-[10px] text-[#1C1C1E]/65 border border-[#1C1C1E]/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  google.com/search?q=massages+tarnovo
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-base font-bold shrink-0">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                  <div className="flex-1 px-3 py-1.5 border border-[#1C1C1E]/15 rounded-full text-xs text-[#1C1C1E]/65 truncate min-w-0">
                    massages tarnovo
                  </div>
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 mb-3">Около 1,250,000 резултата (0.32 сек)</div>
                <div className="border border-[#E8A87C]/25 rounded-xl p-3 bg-[#E8A87C]/4 mb-2 relative">
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#E8A87C] text-white text-[9px] rounded-full tracking-wide font-medium">
                    #1 ПОЗИЦИЯ
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#E8A87C]/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E8A87C]" />
                    </div>
                    <a href="https://npmassagestudio.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#1C1C1E]/60 hover:text-[#E8A87C] transition-colors cursor-pointer">npmassagestudio.com</a>
                  </div>
                  <div className="text-sm font-medium text-[#0A2540] mb-1 leading-snug">
                    NP Massage Studio — Професионални масажи във Велико Търново
                  </div>
                  <div className="text-[11px] text-[#1C1C1E]/70 leading-relaxed">
                    Класически, спортен, антицелулитен масаж и ароматерапия. Локации в Павликени и Велико Търново.
                  </div>
                </div>
                {[
                  { domain: 'spa.bg', title: 'Масажи Велико Търново – SPA.bg' },
                  { domain: 'grabo.bg', title: 'Масаж Велико Търново – Grabo' },
                  { domain: 'facebook.com', title: 'Масажни студиа Велико Търново' },
                ].map((r, i) => (
                  <div key={i} className="py-1.5 border-b border-[#1C1C1E]/5 opacity-30">
                    <div className="text-[10px] text-[#1C1C1E]/65">{r.domain}</div>
                    <div className="text-xs text-[#0A2540]/60">{r.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ChatGPT - NP Massage Studio */}
            <div className="rounded-2xl overflow-hidden bg-[#212121] border border-white/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-white/8 bg-[#171717] shrink-0">
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-white/15 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white/8 rounded text-[10px] text-white/75 border border-white/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  chatgpt.com
                </div>
              </div>
              <div className="flex-1 p-4 md:p-5 flex flex-col gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0">
                    <InlineIcon name="openai" className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[11px] text-white/75">ChatGPT</span>
                  <span className="text-[10px] text-white/75 bg-white/8 px-2 py-0.5 rounded-full">GPT-4o</span>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-[#2F2F2F] rounded-2xl rounded-tr-sm px-3 py-2">
                    <p className="text-xs text-white/95 leading-relaxed">търся студио за масажи в търново</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5">
                    <InlineIcon name="openai" className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <p className="text-xs text-white/90 leading-relaxed">Ето няколко добри варианта за масажно студио във Велико Търново според услугите, отзивите и локалното присъствие:</p>
                    <div className="bg-[#E8A87C]/10 border border-[#E8A87C]/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#E8A87C]/20 flex items-center justify-center shrink-0">
                          <InlineIcon name="star" className="w-2.5 h-2.5 text-[#E8A87C]" />
                        </div>
                        <span className="text-[10px] text-[#E8A87C] font-semibold uppercase tracking-wider">Топ препоръка</span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-semibold text-white">NP Massage Studio</span>
                        <a href="https://npmassagestudio.com/" target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#E8A87C] hover:underline cursor-pointer">npmassagestudio.com</a>
                      </div>
                      <p className="text-[11px] text-white/85 leading-relaxed">Професионални масажи в Павликени и Велико Търново. Класически, спортен, антицелулитен масаж и ароматерапия.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-auto flex items-center gap-2 bg-[#2F2F2F] rounded-xl px-3 py-2 border border-white/8">
                  <span className="text-xs text-white/75 flex-1">Изпратете съобщение...</span>
                  <div className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/10 shrink-0">
                    <i className="ri-arrow-up-line text-white/75 text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 md:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
          <span className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase">четвърти клиент</span>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
        </div>

        {/* Case 4: Photo Tarnovo */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-1 h-5 bg-[#D4A574] rounded-full shrink-0" />
            <span className="text-xs font-semibold text-[#D4A574] tracking-widest uppercase">Пълен пакет — Photo Tarnovo</span>
            <a
              href="https://phototarnovo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[#D4A574]/60 underline decoration-dotted hover:text-[#D4A574] transition-colors cursor-pointer"
            >
              phototarnovo.com ↗
            </a>
          </div>

          {/* What was done */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво е направено</div>
              <ul className="space-y-1.5">
                {[
                  'Изграждане на сайт от нула',
                  'SEO оптимизация за локално търсене',
                  'GEO оптимизация за AI търсачки',
                  'Структурирани данни (LocalBusiness Schema)',
                  'Google Business Profile оптимизация',
                  'Оптимизация на портфолио страници',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="checkbox-circle" className="w-4 h-4 text-[#D4A574] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Колко отне</div>
              <div className="text-2xl font-light text-[#D4A574] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>~3–5 седмици</div>
              <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                От нулев сайт до #1 в Google за "photo tarnovo". Фотографската ниша в Търново изисква силно визуално присъствие и добра локална оптимизация.
              </p>
              <div className="mt-3 pt-3 border-t border-[#1C1C1E]/6">
                <div className="text-[10px] text-[#1C1C1E]/70 mb-1">Инструменти</div>
                <div className="flex flex-wrap gap-1">
                  {['Schema.org', 'GEO', 'Local SEO', 'Google Business', 'GSC'].map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A574]/8 text-[#D4A574]/70">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#1C1C1E]/8" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-2">Какво може да не се повтори</div>
              <ul className="space-y-1.5">
                {[
                  'Локалната фотографска ниша е по-лесна',
                  'Силното портфолио помага за ангажираност',
                  'GBP оптимизацията е ключова за фотографи',
                  'Нужна е редовна поддръжка на GBP',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-[#1C1C1E]/60">
                    <InlineIcon name="alert" className="w-4 h-4 text-[#C0392B]/70 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {/* Google SERP - Photo Tarnovo */}
            <div className="rounded-2xl overflow-hidden bg-white border border-[#1C1C1E]/8 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-[#1C1C1E]/6 bg-[#F5F5F5] shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white rounded text-[10px] text-[#1C1C1E]/65 border border-[#1C1C1E]/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  google.com/search?q=photo+tarnovo
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-base font-bold shrink-0">
                    <span className="text-[#4285F4]">G</span>
                    <span className="text-[#EA4335]">o</span>
                    <span className="text-[#FBBC05]">o</span>
                    <span className="text-[#4285F4]">g</span>
                    <span className="text-[#34A853]">l</span>
                    <span className="text-[#EA4335]">e</span>
                  </div>
                  <div className="flex-1 px-3 py-1.5 border border-[#1C1C1E]/15 rounded-full text-xs text-[#1C1C1E]/65 truncate min-w-0">
                    photo tarnovo
                  </div>
                </div>
                <div className="text-[10px] text-[#1C1C1E]/65 mb-3">Около 890,000 резултата (0.27 сек)</div>
                <div className="border border-[#D4A574]/25 rounded-xl p-3 bg-[#D4A574]/4 mb-2 relative">
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#D4A574] text-white text-[9px] rounded-full tracking-wide font-medium">
                    #1 ПОЗИЦИЯ
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-3 h-3 rounded-full bg-[#D4A574]/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D4A574]" />
                    </div>
                    <a href="https://phototarnovo.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#1C1C1E]/60 hover:text-[#D4A574] transition-colors cursor-pointer">phototarnovo.com</a>
                  </div>
                  <div className="text-sm font-medium text-[#0A2540] mb-1 leading-snug">
                    Photo Tarnovo — Професионална фотография във Велико Търново
                  </div>
                  <div className="text-[11px] text-[#1C1C1E]/70 leading-relaxed">
                    Професионални фотосесии, сватбена фотография, портретна и комерсиална фотография във Велико Търново.
                  </div>
                </div>
                {[
                  { domain: 'facebook.com', title: 'Photo Tarnovo — Facebook' },
                  { domain: 'instagram.com', title: 'Photo Tarnovo — Instagram' },
                  { domain: 'spa.bg', title: 'Фотографи Велико Търново' },
                ].map((r, i) => (
                  <div key={i} className="py-1.5 border-b border-[#1C1C1E]/5 opacity-30">
                    <div className="text-[10px] text-[#1C1C1E]/65">{r.domain}</div>
                    <div className="text-xs text-[#0A2540]/60">{r.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Pack mock — Photo Tarnovo */}
            <div className="rounded-2xl overflow-hidden bg-white border border-[#D4A574]/20 flex flex-col w-full">
              <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 border-b border-[#1C1C1E]/6 bg-[#F5F5F5] shrink-0">
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-[#1C1C1E]/12 shrink-0" />
                <div className="flex-1 mx-2 px-2 py-1 bg-white rounded text-[10px] text-[#1C1C1E]/65 border border-[#1C1C1E]/8 truncate min-w-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                  google.com/maps/search/photo+tarnovo
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="text-xs font-medium text-[#1C1C1E] mb-3">Местни резултати — Google Maps</div>
                <div className="border border-[#D4A574]/20 rounded-xl p-3 bg-[#D4A574]/4 mb-3 relative">
                  <div className="absolute -top-2 left-3 px-2 py-0.5 bg-[#D4A574] text-white text-[9px] rounded-full tracking-wide font-medium">
                    #1 LOCAL PACK
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-[#D4A574]/15 flex items-center justify-center shrink-0">
                      <i className="ri-camera-line text-[#D4A574] text-xs" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#1C1C1E]">Photo Tarnovo</div>
                      <div className="text-[10px] text-[#1C1C1E]/60 flex items-center gap-1">
                        <i className="ri-star-fill text-[#FBBC05] text-[9px]" />
                        <span>5.0</span>
                        <span className="text-[#1C1C1E]/30">·</span>
                        <span>Велико Търново</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#1C1C1E]/60">
                    <span className="px-2 py-0.5 rounded-full bg-[#D4A574]/10 text-[#D4A574]">Отворено</span>
                    <span>Професионален фотограф</span>
                  </div>
                </div>
                {[
                  { name: 'Фотограф 2', rating: '4.7' },
                  { name: 'Фотограф 3', rating: '4.5' },
                ].map((r, i) => (
                  <div key={i} className="py-1.5 border-b border-[#1C1C1E]/5 opacity-30">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#1C1C1E]/5 flex items-center justify-center shrink-0">
                        <i className="ri-map-pin-line text-[#1C1C1E]/30 text-[10px]" />
                      </div>
                      <div>
                        <div className="text-xs text-[#1C1C1E]/60">{r.name}</div>
                        <div className="text-[10px] text-[#1C1C1E]/40">★ {r.rating} · Велико Търново</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 md:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
          <span className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase">още клиенти</span>
          <div className="flex-1 h-[1px] bg-[#1C1C1E]/8" />
        </div>

        {/* Case 3–5: Thalysta, Nmom, Budimse */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="w-1 h-5 bg-[#0A2540] rounded-full shrink-0" />
            <span className="text-xs font-semibold text-[#0A2540] tracking-widest uppercase">Пълен пакет — сайт, SEO, реклами, видео</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            {[
              {
                name: 'Thalysta',
                url: 'https://thalysta.com/',
                color: '#8B5CF6',
                desc: 'E-commerce платформа с пълен пакет — изработка на сайт, SEO оптимизация, рекламни кампании и видео продукция. От нулата до пълно онлайн присъствие.',
                result: 'Жив сайт · Онлайн магазин',
              },
              {
                name: 'NMOM',
                url: 'https://nmom.bg/',
                color: '#0EA5E9',
                desc: 'Сайт и онлайн присъствие за НПО организация. Изработка на сайт от нулата, SEO оптимизация и дигитална стратегия за социална кауза.',
                result: 'Жив сайт · НПО',
              },
              {
                name: 'Budimse',
                url: 'https://budimse.online/',
                color: '#10B981',
                desc: 'Образователна онлайн платформа — изработка на сайт, SEO, GEO оптимизация и дигитален маркетинг. Проект, който ние създадохме абсолютно всичко.',
                result: 'Жив сайт · Платформа',
              },
            ].map((c) => (
              <div key={c.name} className="p-5 rounded-2xl bg-white border border-[#1C1C1E]/8 hover:border-[#0A2540]/15 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{c.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border text-[#0A2540]/60 whitespace-nowrap" style={{ borderColor: `${c.color}40`, backgroundColor: `${c.color}10` }}>
                    {c.result}
                  </span>
                </div>
                <p className="text-xs text-[#1C1C1E]/60 leading-relaxed mb-4">{c.desc}</p>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                  style={{ color: c.color }}
                >
                  <InlineIcon name="external-link" className="w-3 h-3" />
                  {c.url.replace('https://', '')}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Verify links */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 md:mb-10 p-4 rounded-xl bg-white border border-[#1C1C1E]/6" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="w-5 h-5 flex items-center justify-center shrink-0">
            <InlineIcon name="links" className="w-4 h-4 text-[#0A2540]/60" />
          </div>
          <span className="text-xs text-[#1C1C1E]/70">Проверете сами — сега:</span>
          <div className="flex flex-wrap items-center gap-3">
            {[
              { url: 'https://phototarnovo.com/', label: 'phototarnovo.com', color: '#D4A574' },
              { url: 'https://npmassagestudio.com/', label: 'npmassagestudio.com', color: '#E8A87C' },
              { url: 'https://sunrisefood.eu/', label: 'sunrisefood.eu', color: '#1B4332' },
              { url: 'https://k-foodvelikotarnovo.com/', label: 'k-foodvelikotarnovo.com', color: '#C0392B' },
              { url: 'https://thalysta.com/', label: 'thalysta.com', color: '#8B5CF6' },
              { url: 'https://nmom.bg/', label: 'nmom.bg', color: '#0EA5E9' },
              { url: 'https://budimse.online/', label: 'budimse.online', color: '#10B981' },
            ].map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] hover:opacity-80 transition-colors cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: `${l.color}10`, borderColor: `${l.color}25`, color: l.color }}
              >
                <InlineIcon name="external-link" className="w-3 h-3" />
                {l.label}
              </a>
            ))}
          </div>
          <span className="text-[10px] text-[#1C1C1E]/65 sm:ml-auto">Всички са живи сайтове</span>
        </div>

        {/* GEO note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
          <div
            className="flex items-start gap-3 p-4 md:p-5 rounded-xl bg-[#0A2540]/4 border border-[#0A2540]/8"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
              <InlineIcon name="sparkling" className="w-4 h-4 text-[#0A2540]" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#0A2540] mb-1">GEO — Generative Engine Optimization</div>
              <div className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                Оптимизация не само за Google, но и за AI търсачки — ChatGPT, Gemini, Perplexity.
                Това е новото SEO и е част от всяка наша кампания.
              </div>
            </div>
          </div>

          <blockquote
            className="border-l-2 border-[#1B4332]/25 pl-4 text-[#1C1C1E]/60 italic leading-relaxed text-sm md:text-base"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            „Четири бизнеса на #1 в Google — Photo Tarnovo, Sunrise Food, K-Food и NP Massage Studio.
            Thalysta, NMOM и Budimse са живи проекти, които ние създадохме от нулата."
          </blockquote>
        </div>

      </div>
    </section>
  );
}
