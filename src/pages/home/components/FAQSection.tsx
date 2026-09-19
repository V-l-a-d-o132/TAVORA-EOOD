import { useState } from 'react';
import InlineIcon from '@/components/base/InlineIcon';

const faqs = [
  {
    q: 'За кого НЕ е подходящ курсът?',
    a: 'Ако търсите бърза схема за пари — не е за вас. Ако нямате 5–6 часа седмично — не е за вас. Ако очаквате гарантирани резултати — никой курс не може да ги даде. SEO отнема месеци. Изпълнението е ваше. Ако сте готови за това — продължете да четете.',
    honest: true,
  },
  {
    q: 'Колко бързо ще видя резултати?',
    a: 'Честният отговор: зависи. При Sunrise Food — около 3–4 седмици за локална ниша с умерена конкуренция. При K-Food — 2–3 месеца за национално търсене. Ако нишата ви е по-конкурентна — може да отнеме повече. Не обещаваме срокове. Обещаваме система, която е работила — и ще ви покажем как да я приложите.',
    honest: false,
  },
  {
    q: 'Трябва ли ми технически опит?',
    a: 'Не. Курсът е проектиран за хора без технически фон. Ще работите с AI инструменти, които правят техническата работа вместо вас. Нужно е желание да учите и да прилагате — не познания по програмиране.',
    honest: false,
  },
  {
    q: 'Какво точно включва менторството в Премиум пакета?',
    a: '4 индивидуални сесии по 60 минути с Владимир Атанасов. Преглед на вашия конкретен проект — сайт, стратегия, съдържание. Достъп до затворена общност от участници. Сесиите се насрочват след записване, в рамките на 3 месеца. Ако имате въпроси за конкретното съдържание — пишете преди да се запишете.',
    honest: false,
  },
  {
    q: 'Как работи 14-дневната гаранция?',
    a: 'Ако в рамките на 14 дни от записването решите, че курсът не е за вас — пишете на tavoraagency@gmail.com с тема „Гаранция". Връщаме пълната сума в рамките на 5 работни дни. Без въпроси. Единственото условие: да сте гледали поне 2 модула — за да имаме реална обратна връзка.',
    honest: false,
  },
  {
    q: 'Курсът актуален ли е — AI се развива много бързо?',
    a: 'Добър въпрос. Фокусът е върху принципи и системи, не върху конкретни инструменти. Инструментите се менят — логиката зад тях остава. Участниците в Премиум пакета получават достъп до обновления при значими промени. Но честно: ако след 2 години нещо е остаряло — ще го кажем.',
    honest: false,
  },
  {
    q: 'Мога ли да платя на вноски?',
    a: 'Да. При записване можете да поискате план на вноски — 2 или 3 месечни плащания. Свържете се с нас след попълване на формата и ще уточним детайлите.',
    honest: false,
  },
  {
    q: 'Защо само 2 клиента като доказателство?',
    a: 'Защото имам само 2. Не измислям повече. Тези 2 са реални, верифицируеми и можете да ги проверите сами в Google и ChatGPT прямо сега. Предпочитам 2 истински доказателства пред 20 измислени.',
    honest: true,
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-8 md:py-36 bg-[#F9F9F9] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Section label */}
        <div
          className="flex items-center gap-3 mb-10 md:mb-16"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">Честни отговори</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
          {/* Left: Heading */}
          <div>
            <h2
              className="text-2xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4 md:mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Въпроси,
              <br />
              <span className="italic text-[#0A2540]">включително неудобните.</span>
            </h2>
            <p
              className="text-sm text-[#1C1C1E]/60 leading-relaxed mb-6 md:mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Ако имате въпрос, на който не намирате отговор тук — пишете директно.
              Отговаряме лично, не с автоматизирани отговори.
            </p>

            {/* Highlight */}
            <div
              className="p-4 md:p-5 rounded-xl border border-[#0A2540]/15 bg-[#0A2540]/4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <InlineIcon name="shield-check" className="w-4 h-4 text-[#0A2540]/60" />
                <span className="text-xs text-[#0A2540]/70 font-medium tracking-wide uppercase">Защо питаме „За кого НЕ е?"</span>
              </div>
              <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                Защото предпочитаме да откажем неподходящ кандидат, отколкото да вземем парите му
                и той да е разочарован. Затова преглеждаме кандидатурите лично.
              </p>
            </div>
          </div>

          {/* Right: FAQ accordion */}
          <div className="space-y-2 md:space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  openIndex === i
                    ? 'border-[#0A2540]/20 bg-white'
                    : 'border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/15'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 p-4 md:p-5 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {faq.honest && (
                      <span
                        className="shrink-0 mt-0.5 text-[10px] px-2 py-0.5 rounded-full bg-[#0A2540]/8 text-[#0A2540]/70 whitespace-nowrap"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Честен отговор
                      </span>
                    )}
                    <span
                      className="text-sm font-medium text-[#1C1C1E] leading-snug"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {faq.q}
                    </span>
                  </div>
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    <InlineIcon name={openIndex === i ? 'subtract' : 'add'} className="w-5 h-5 text-[#1C1C1E]/65" />
                  </div>
                </button>

                {openIndex === i && (
                  <div
                    className="px-4 md:px-5 pb-4 md:pb-5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <div className="h-px bg-[#1C1C1E]/6 mb-4" />
                    <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-12 md:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-7 rounded-2xl border border-[#1C1C1E]/8 bg-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div>
            <div
              className="text-base font-light text-[#1C1C1E] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}
            >
              Имате друг въпрос?
            </div>
            <div className="text-xs text-[#1C1C1E]/60">
              Пишете директно — отговаряме лично, не с автоматизирани отговори.
            </div>
          </div>
          <a
            href="mailto:tavoraagency@gmail.com"
            className="w-full sm:w-auto px-6 py-3 border border-[#0A2540]/30 text-[#0A2540] text-sm tracking-wide rounded-full hover:bg-[#0A2540] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap text-center"
          >
            Задайте въпрос →
          </a>
        </div>
      </div>
    </section>
  );
}
