import InlineIcon from '@/components/base/InlineIcon';

export default function TrustSection() {
  const trustPoints = [
    {
      icon: 'user-search',
      label: 'Реален човек зад Академията',
      claim: 'Кой стои зад него?',
      answer:
        'Владимир Атанасов — потърсете го в Google. Участия в телевизии, конкурси по медийна грамотност, публично присъствие. Не е анонимен.',
      link: 'https://www.google.com/search?q=%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%D0%BE%D0%B2+%D0%BC%D0%B5%D0%B4%D0%B8%D0%B9%D0%BD%D0%B0+%D0%B3%D1%80%D0%B0%D0%BC%D0%BE%D1%82%D0%BD%D0%BE%D1%81%D1%82',
      linkLabel: 'Потърсете в Google →',
    },
    {
      icon: 'links',
      label: 'Верифицируеми резултати',
      claim: 'Обещания без доказателства?',
      answer:
        'Пет реални клиента с живи сайтове — sunrisefood.eu, k-foodvelikotarnovo.com, thalysta.com, nmom.bg и budimse.online. Всички са създадени от нас от нулата. Отворете ги сега.',
      link: 'https://thalysta.com/',
      linkLabel: 'Отворете thalysta.com →',
    },
    {
      icon: 'mail-check',
      label: 'Реален имейл и контакт',
      claim: 'Няма ясни контакти?',
      answer:
        'tavoraagency@gmail.com — пишете сега. Отговаряме лично, не с автоматизирани отговори. Без скрити форми, без анонимност.',
      link: 'mailto:tavoraagency@gmail.com',
      linkLabel: 'Пишете директно →',
    },
    {
      icon: 'shield-check',
      label: '14-дневна гаранция с механизъм',
      claim: 'Гаранция без условия?',
      answer:
        'Пишете на tavoraagency@gmail.com с тема „Гаранция" в рамките на 14 дни. Връщаме пълната сума в 5 работни дни. Без въпроси. Без условия.',
      link: 'mailto:tavoraagency@gmail.com?subject=Гаранция',
      linkLabel: 'Вижте условията →',
    },
    {
      icon: 'file-text',
      label: 'Правни документи',
      claim: 'Липса на прозрачност?',
      answer:
        'Общи условия, Политика за поверителност, Право на отказ — всичко е публично достъпно в долната част на сайта. Съобразено с изискванията на ЕС.',
      link: '/terms',
      linkLabel: 'Прочетете условията →',
    },
    {
      icon: 'time',
      label: 'Академията е в първата си група',
      claim: 'Защо няма отзиви?',
      answer:
        'Защото не измисляме такива. Академията тепърва стартира. Доказателствата са от реална клиентска работа — не от измислени колеги.',
      link: null,
      linkLabel: null,
    },
  ];

  return (
    <section
      id="trust"
      className="py-8 md:py-28 bg-[#FFFFFF] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Section label */}
        <div
          className="flex items-center gap-3 mb-8 md:mb-14"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">Прозрачност</span>
        </div>

        {/* Heading */}
        <div className="mb-8 md:mb-14">
          <h2
            className="text-2xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-3 md:mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Имате съмнения?
            <br />
            <span className="italic text-[#0A2540]">Добре. Проверете всичко.</span>
          </h2>
          <p
            className="text-sm text-[#1C1C1E]/60 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Всяко твърдение на тази страница може да бъде верифицирано. Ето как — точка по точка.
          </p>
        </div>

        {/* Trust grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10 md:mb-16">
          {trustPoints.map((point) => (
            <div
              key={point.label}
              className="rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] p-5 md:p-6 flex flex-col gap-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* Icon + label */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 bg-white shrink-0">
                  <InlineIcon name={point.icon} className="w-5 h-5 text-[#0A2540]/60" />
                </div>
                <span className="text-sm font-medium text-[#1C1C1E]">{point.label}</span>
              </div>

              {/* Claim badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1C1C1E]/6 text-[#1C1C1E]/60 tracking-wide">
                  Твърдение: „{point.claim}"
                </span>
              </div>

              {/* Answer */}
              <p className="text-sm text-[#1C1C1E]/70 leading-relaxed flex-1">{point.answer}</p>

              {/* Verify link */}
              {point.link && (
                <a
                  href={point.link}
                  target={point.link.startsWith('http') ? '_blank' : undefined}
                  rel={point.link.startsWith('http') ? 'noopener noreferrer nofollow' : undefined}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0A2540] hover:text-[#0A2540]/70 transition-colors cursor-pointer font-medium"
                >
                  {point.linkLabel}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Bottom honest bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 md:p-6 rounded-2xl border border-[#1B4332]/20 bg-[#1B4332]/4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <InlineIcon name="information" className="w-6 h-6 text-[#1B4332]" />
          </div>
          <p className="text-sm text-[#1C1C1E]/70 leading-relaxed flex-1">
            <strong className="text-[#1C1C1E]/80">Ако нещо изглежда неясно</strong> — пишете директно на{' '}
            <a href="mailto:tavoraagency@gmail.com" className="text-[#0A2540] underline decoration-dotted hover:no-underline">
              tavoraagency@gmail.com
            </a>
            . Отговаряме лично. Ако не сме подходящи за вас — ще ви кажем честно.
          </p>
        </div>
      </div>
    </section>
  );
}
