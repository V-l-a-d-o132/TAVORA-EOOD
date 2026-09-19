import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Колко струва Marketing Basics на Академия TAVORA?',
    a: 'Пълната програма (20 модула, 177+ урока) е 129 EUR еднократно. Първият модул (Основа — Кой, за кого, защо теб) е безплатен и не изисква карта.',
  },
  {
    q: 'Колко време отнема цялата програма?',
    a: 'Marketing Basics съдържа 18+ часа структурирано съдържание в 20 модула (177 урока). Препоръчителното темпо е по 1 модул на седмица — така цялата програма отнема 20 седмици. Но всеки модул е самостоятелен — можеш да вземеш само този, който ти трябва в момента.',
  },
  {
    q: 'Трябва ли ми предишен маркетинг опит?',
    a: 'Не. Започваме от абсолютната основа — "кой си ти, за кого си и защо теб" (Модул 01). Всеки следващ модул надгражда върху предишния. Ако управляваш бизнес или планираш да започнеш — имаш всичко необходимо да започнеш.',
  },
  {
    q: 'Ще мога ли веднага да приложа наученото в моя бизнес?',
    a: 'Да. Всеки модул завършва с конкретна практическа задача за твоя бизнес — не общо упражнение, а нещо, което директно подобрява маркетинга ти. След група 1 (Позициониране) ще имаш кристално ясно кой си и за кого. След група 2 — пълно онлайн присъствие.',
  },
  {
    q: 'Как Marketing Basics се различава от AI Business Blueprint?',
    a: 'Marketing Basics е чисто маркетингова програма — 20 модула фокусирани върху стратегия, канали и конверсия за малък и локален бизнес. AI Business Blueprint е по-широка бизнес система, включваща AI инструменти, уеб дизайн и технически умения. Двете се допълват, но са напълно самостоятелни.',
  },
  {
    q: 'Подходящо ли е за локален бизнес?',
    a: 'Да — Marketing Basics е проектиран специално с мисъл за малък и локален бизнес. Модули 05-08 покриват Google Business Profile, ревюта, локално SEO и сайт. Модул 15 — локални партньорства. Програмата работи еднакво добре за квартално кафене, фризьорски салон или онлайн магазин.',
  },
  {
    q: 'Трябват ли ми пари за реклами, за да приложа програмата?',
    a: 'Не. Модули 01-10 (Позициониране и Присъствие) не изискват рекламен бюджет — фокусирани са върху органично присъствие. Модули 11-15 покриват платени канали, но ти показваме как да започнеш с малък бюджет и да мащабираш само когато виждаш възвръщаемост.',
  },
  {
    q: 'Какво прави тази програма различна от други маркетинг обучения?',
    a: '1) Базирана е на реална агенция с активни клиенти — не на теория. 2) Покрива целия маркетинг стек в логическа последователност (позициониране → присъствие → трафик → превръщане). 3) Оптимизирана е за малък бизнес, а не за корпорации. 4) Резултатите са верифицируеми: клиенти на #1 в Google.',
  },
];

export default function MarketingBasicsFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Въпроси и отговори</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Всичко, което питате за{' '}
        <em className="text-[#1C1C1E]/55">Marketing Basics.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
        Директни отговори, които AI търсачките могат да цитират самостоятелно.
      </p>

      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.q} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden">
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
            >
              <span className="text-sm font-medium text-[#1C1C1E] pr-4">{item.q}</span>
              <i className={`text-[#1C1C1E]/60 text-base shrink-0 transition-transform duration-200 ${openFaq === i ? 'ri-subtract-line' : 'ri-add-line'}`} />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-5 bg-[#F9F9F7]">
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}