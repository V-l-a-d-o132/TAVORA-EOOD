import { useState } from 'react';
import InlineIcon from '@/components/base/InlineIcon';

const notForItems = [
  {
    icon: 'dollar-circle',
    title: 'Търсите бърз начин да правите пари',
    desc: 'SEO отнема месеци. Ако очаквате резултати след 2 седмици — това не е за вас.',
  },
  {
    icon: 'sleep',
    title: 'Искате пасивен доход без усилие',
    desc: 'Нищо в курса не работи автоматично. Всичко изисква изпълнение от ваша страна.',
  },
  {
    icon: 'time',
    title: 'Нямате 5–6 часа седмично',
    desc: 'Курсът е 14 часа съдържание. Плюс прилагане. Ако нямате времето — изчакайте.',
  },
  {
    icon: 'team',
    title: 'Вече имате маркетинг екип',
    desc: 'Курсът е за хора, които правят нещата сами или с малък екип. Не е за делегиране.',
  },
  {
    icon: 'magic',
    title: 'Очаквате гарантирани резултати',
    desc: 'Не можем да гарантираме позиции. Никой не може. Показваме система — изпълнението е ваше.',
  },
];

const forItems = [
  'Имате малък бизнес или сте фрийлансър и искате повече онлайн видимост',
  'Правите нещата сами и искате да разберете как работи SEO реално',
  'Имате клиенти, на които искате да предлагате дигитален маркетинг',
  'Готови сте да работите — не само да гледате видеа',
  'Искате да разберете как AI инструментите се използват в реална работа',
  'Имате конкретна ниша и искате да класирате сайт в нея',
];

export default function TransformationSection() {
  const [openHonest, setOpenHonest] = useState(false);

  return (
    <section className="py-8 md:py-36 bg-[#FFFFFF] w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-16">

        {/* Section label */}
        <div
          className="flex items-center gap-3 mb-10 md:mb-16"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60 tracking-widest uppercase">За кого е — и за кого не е</span>
        </div>

        {/* WHO THIS IS NOT FOR — prominent */}
        <div className="mb-12 md:mb-20">
          <h2
            className="text-2xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-3 md:mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            За кого{' '}
            <span className="italic text-[#C0392B]">не е</span>{' '}
            подходящ курсът.
          </h2>
          <p
            className="text-sm text-[#1C1C1E]/60 max-w-xl leading-relaxed mb-8 md:mb-10"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Предпочитам да ви кажа директно — отколкото да вземем парите ви и след това да сте разочаровани.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
            {notForItems.map((item) => (
              <div
                key={item.title}
                className="p-4 md:p-5 rounded-2xl border border-[#C0392B]/12 bg-[#C0392B]/3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 flex items-center justify-center rounded-full border border-[#C0392B]/20 shrink-0">
                    <InlineIcon name={item.icon} className="w-4 h-4 text-[#C0392B]/60" />
                  </div>
                  <span className="text-sm font-medium text-[#1C1C1E]">{item.title}</span>
                </div>
                <p className="text-xs text-[#1C1C1E]/60 leading-relaxed pl-10">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Honest note */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F9]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
              <InlineIcon name="information" className="w-4 h-4 text-[#1C1C1E]/70" />
            </div>
            <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
              Ако се разпознавате в нещо от горното — не се записвайте. Сериозно.
              Ако не сте сигурни — пишете ни на{' '}
              <a href="mailto:tavoraagency@gmail.com" className="text-[#0A2540] underline decoration-dotted">tavoraagency@gmail.com</a>{' '}
              и ще ви кажем честно дали курсът е подходящ за вас.
            </p>
          </div>
        </div>

        {/* WHO THIS IS FOR */}
        <div className="mb-12 md:mb-20">
          <h3
            className="text-xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-3 md:mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            За кого{' '}
            <span className="italic text-[#1B4332]">е</span>{' '}
            подходящ.
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 p-4 rounded-xl border border-[#1B4332]/12 bg-[#1B4332]/3"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                  <InlineIcon name="checkbox-circle" className="w-4 h-4 text-[#1B4332]" />
                </div>
                <span className="text-sm text-[#1C1C1E]/60 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HONEST SECTION — First cohort */}
        <div
          className="mb-12 md:mb-20 rounded-2xl border border-[#0A2540]/15 bg-[#0A2540]/3 p-6 md:p-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            <div className="shrink-0">
              <div className="w-12 h-12 flex items-center justify-center rounded-full border border-[#0A2540]/20 bg-white">
                <InlineIcon name="information" className="w-6 h-6 text-[#0A2540]/60" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#0A2540] mb-3 tracking-wide uppercase">
                Честно — курсът е в първата си група
              </div>
              <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-4">
                Нямаме десетки отзиви, защото Академията тепърва стартира. Не измисляме такива.
                Доказателствата, които имаме, са от реална клиентска работа — Sunrise Food и K-Food.
                Тях можете да проверите сами в Google и ChatGPT прямо сега.
              </p>
              <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-5">
                Ако се запишете в първата група — ще получите директен достъп до ментора,
                по-ниска цена и ще бъдете сред хората, чиито резултати ще бъдат документирани честно.
              </p>
              <button
                onClick={() => setOpenHonest(!openHonest)}
                className="flex items-center gap-2 text-xs text-[#0A2540]/60 hover:text-[#0A2540] transition-colors cursor-pointer"
              >
                <InlineIcon name={openHonest ? 'subtract' : 'add'} className="w-4 h-4" />
                {openHonest ? 'Скрий' : 'Какво означава "първа група" на практика?'}
              </button>
              <div className="mt-4 pl-4 border-l-2 border-[#0A2540]/15"
                style={{
                  maxHeight: openHonest ? 500 : 0,
                  overflow: 'hidden',
                  opacity: openHonest ? 1 : 0,
                  transition: 'max-height 300ms ease, opacity 200ms ease',
                }}
              >
                <ul className="space-y-2">
                  {[
                    'По-малка група — повече внимание от ментора',
                    'Цената е по-ниска от тази на следващите групи',
                    'Вашият проект може да стане следващото доказателство',
                    'Директна обратна връзка — не записани отговори',
                    'Ако не сте доволни в 14 дни — връщаме парите без въпроси',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#1C1C1E]/70">
                      <InlineIcon name="checkbox-circle" className="w-4 h-4 text-[#1B4332] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA nudge */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-7 rounded-2xl border border-[#1C1C1E]/10 bg-[#F9F9F9]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div>
            <div className="text-base font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              Не сте сигурни дали е за вас?
            </div>
            <div className="text-xs text-[#1C1C1E]/60">
              Попълнете формата — ще прегледаме и ще ви кажем честно.
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('application');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3 border border-[#0A2540]/30 text-[#0A2540] text-sm tracking-wide rounded-full hover:bg-[#0A2540] hover:text-white transition-all duration-300 cursor-pointer whitespace-nowrap font-medium shrink-0"
          >
            Виж дали е за теб →
          </button>
        </div>

      </div>
    </section>
  );
}
