import { useState } from 'react';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
};

const FAQS = [
  {
    q: 'За кого е Академията?',
    a: 'За хора, които искат да създават и продават дигитални услуги — предприемачи, фрийлансъри и собственици на малък бизнес, които искат да използват AI, маркетинг и видео по систематизиран начин.',
  },
  {
    q: 'За кого не е?',
    a: 'За хора, които търсят „бързи пари без работа“, очакват гарантиран резултат без усилия или не са готови да отделят време за учене и прилагане. Ако искаш схема за печелене за дни — това не е за теб.',
  },
  {
    q: 'Трябва ли ми предишен опит?',
    a: 'Не. Програмите започват от основите и надграждат стъпка по стъпка. По-важно е желанието да учиш и да прилагаш, отколкото да имаш технически фон.',
  },
  {
    q: 'Каква е разликата между трите програми?',
    a: '„Пътят на коприната“ е за изграждане и продажба на дигитална услуга с AI. „Перфектното Видео“ е за бизнес видео продукция. „Marketing Basics“ е за цялостна маркетинг система. Всяка е самостоятелна и покрива различен резултат.',
  },
  {
    q: 'Каква е разликата между Стартов и Пълен достъп?',
    a: 'Стартовият пакет включва първите 10 модула от „Пътят на коприната“ — без Revenue Blueprint и без другите две програми. Пълният достъп включва всички 46 модула, трите програми, тестове, сертификат и бъдещи обновления.',
  },
  {
    q: 'Как протичат двете стратегически срещи?',
    a: 'Това са две индивидуални онлайн срещи по 60 минути с Владимир Атанасов. Първата е анализ на идеята, офертата, позиционирането и плана. Втората е преглед на изпълнението, корекции и следващи действия.',
  },
  {
    q: 'Нужни ли са платени AI инструменти?',
    a: 'Голяма част от съдържанието може да се изпълни с безплатните версии на основните инструменти. Където е полезно, показваме и платени опции — но не са задължителни, за да започнеш.',
  },
  {
    q: 'Колко време имам достъп?',
    a: 'Доживотен. Веднъж закупен, достъпът до съдържанието остава, включително бъдещите обновления на модулите.',
  },
  {
    q: 'Как работи 30-дневната гаранция?',
    a: 'Ако в рамките на 30 дни решиш, че Академията не е за теб, пиши ни и ще възстановим сумата. Това е доброволна гаранция, отделна от законовото право на отказ.',
  },
  {
    q: 'Сертификатът професионална квалификация ли е?',
    a: 'Не. Сертификатът е за завършено обучение — той потвърждава, че си преминал програмата, но не е държавно призната професионална квалификация.',
  },
  {
    q: 'Гарантиран ли е конкретен финансов резултат?',
    a: 'Не. Академията предоставя знания, процеси и практически инструменти, но резултатите зависят от избраната ниша, изпълнението, пазара и отделеното време.',
  },
];

export default function AkademiyaFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="akademiya-faq" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Въпроси и отговори</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Всичко, което искаш да знаеш
          </h2>
          <p className="text-sm md:text-base max-w-xl leading-relaxed" style={{ color: C.textMuted }}>
            Ако не намираш отговора си тук — пиши ни директно.
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={faq.q} style={{ background: C.surface, border: `1px solid ${openIndex === i ? C.borderHover : C.border}` }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-4 p-4 md:p-5 text-left cursor-pointer"
              >
                <span className="text-sm font-medium leading-snug" style={{ color: C.text }}>{faq.q}</span>
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  <i className={openIndex === i ? 'ri-subtract-line' : 'ri-add-line'} style={{ color: C.textDim, fontSize: '16px' }} />
                </div>
              </button>

              {openIndex === i && (
                <div className="px-4 md:px-5 pb-4 md:pb-5">
                  <div style={{ height: '1px', background: C.border, marginBottom: '14px' }} />
                  <p className="text-sm leading-relaxed" style={{ color: C.textMuted }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-7" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div>
            <p className="text-lg font-bold mb-1" style={{ color: C.text }}>Имаш друг въпрос?</p>
            <p className="text-xs" style={{ color: C.textDim }}>Пиши ни — отговаряме лично.</p>
          </div>
          <a
            href="mailto:hello@imashnujnoto.com"
            className="px-6 py-3 text-sm font-bold transition-colors whitespace-nowrap"
            style={{ background: C.accent, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ff5555'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
          >
            Задай въпрос
          </a>
        </div>
      </div>
    </section>
  );
}