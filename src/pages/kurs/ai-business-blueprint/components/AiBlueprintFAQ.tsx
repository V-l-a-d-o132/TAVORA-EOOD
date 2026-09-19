import { useState } from 'react';
import { formatPrice, getTierById } from '@/config/pricing';

const silkRoadPrice = formatPrice(getTierById('silkRoad')?.price || 0);
const starterPrice = formatPrice(getTierById('starter')?.price || 0);

const FAQ_ITEMS = [
  {
    q: 'Колко струва „Пътят на коприната“ на Академия TAVORA?',
    a: `Пълната програма (11 модула, 74+ урока) е ${silkRoadPrice} еднократно. Стартовият пакет с първите 10 модула е ${starterPrice}. Първият модул (AI Advantage) е безплатен и не изисква карта.`,
  },
  {
    q: 'Трябва ли ми технически опит, за да започна?',
    a: 'Не. Първият модул (AI Advantage) започва от абсолютна нула — учиш се да работиш с ChatGPT, Claude и Gemini като професионалист, без никакви предварителни технически познания. Всеки следващ модул надгражда върху предишния.',
  },
  {
    q: 'За колко време мога да завърша цялата програма?',
    a: 'Програмата съдържа 11 модула и 32+ часа структурирано съдържание. С темпо от 4-6 часа седмично се покрива за около 6-8 седмици. Всеки модул е самостоятелен — не е нужно да минаваш всички наведнъж.',
  },
  {
    q: 'Кога ще видя първите резултати?',
    a: 'Първите 3 модула ти дават умения да създадеш оферта и сайт. Резултатите зависят от твоята ниша, изпълнение и отделено време — академията не гарантира конкретен финансов резултат.',
  },
  {
    q: 'Какво прави „Пътят на коприната“ различен от други AI обучения?',
    a: 'Разликата е, че Академия TAVORA е активна маркетинг агенция — ТАВОРА ЕООД работи с платени клиенти всеки ден. Техниките в модулите не са теория от интернет, а реални методи, тествани върху клиентски проекти с верифицируеми резултати.',
  },
  {
    q: 'Мога ли да купя само един модул, а не цялата програма?',
    a: 'Не. Програмата се закупува като пакет — Стартовият пакет (първите 10 модула) или пълната програма (11 модула). Първият модул е безплатен, за да тестваш подхода преди да решиш.',
  },
  {
    q: 'Гарантиран ли е конкретен финансов резултат?',
    a: 'Не. Академията предоставя знания, процеси и практически инструменти, но резултатите зависят от избраната ниша, изпълнението, пазара и отделеното време.',
  },
  {
    q: 'Имам ли нужда от ChatGPT Plus или други платени AI инструменти?',
    a: 'За първия модул безплатната версия на ChatGPT е напълно достатъчна. В по-напредналите модули ще ти покажем кои платени инструменти си струват инвестицията. Нито един модул не изисква скъп софтуер за старт.',
  },
  {
    q: 'Как се различава от другите програми на Академия TAVORA?',
    a: '„Пътят на коприната“ е цялостната бизнес система — от AI до Revenue Blueprint. Marketing Basics е маркетингова програма за локален бизнес. Перфектното Видео е видео продукционна система. Трите програми са самостоятелни и се допълват.',
  },
  {
    q: 'Какво става, ако не съм доволен?',
    a: 'Имаш 30-дневна доброволна гаранция за възстановяване на сумата. Първият модул е безплатен — това е начинът да тестваш програмата без риск.',
  },
];

export default function AiBlueprintFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Въпроси и отговори</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Всичко, което питате за{' '}
        <em className="text-[#1C1C1E]/55">Пътят на коприната.</em>
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