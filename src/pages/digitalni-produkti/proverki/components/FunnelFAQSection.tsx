const FAQ_ITEMS = [
  {
    q: 'Какво точно получавам?',
    a: '10 системи с общо 1000 конкретни стъпки — по 100 във всяка. Това не е курс — това е готова методология, която прилагате веднага. Всяка стъпка е тествана върху реални бизнеси.',
  },
  {
    q: 'Как става плащането?',
    a: 'Карта, Google Pay или Apple Pay през Stripe. Плащате — получавате код — влизате. Целият процес отнема 2 минути.',
  },
  {
    q: 'Мога ли да ги ползвам за мои клиенти?',
    a: 'Да. Агенции и специалисти ги използват като вътрешна система за работа с клиенти.',
  },
  {
    q: 'Ако не съм доволен?',
    a: '7 дни. Връщаме парите. Без въпроси. Без усложнения.',
  },
];

export default function FunnelFAQSection() {
  return (
    <section className="w-full bg-[#FAFAF8] py-16 md:py-24 px-4 md:px-16 border-t border-[#1C1C1E]/5">
      <div className="max-w-2xl mx-auto">
        <p className="text-[11px] text-[#1C1C1E]/35 tracking-widest uppercase mb-2 font-medium text-center">
          Бързи отговори
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold text-[#1C1C1E] leading-tight mb-10 text-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Директно.{' '}
          <span className="text-[#1C1C1E]/40 font-normal">Без увъртане.</span>
        </h2>

        <div className="space-y-2">
          {FAQ_ITEMS.map((faq, i) => (
            <details key={i} className="group border border-[#1C1C1E]/7 rounded-xl overflow-hidden bg-white">
              <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                <span className="text-sm font-medium text-[#1C1C1E] pr-4">{faq.q}</span>
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <i className="ri-add-line text-[#1C1C1E]/30 group-open:hidden block text-sm" />
                  <i className="ri-subtract-line text-[#1C1C1E]/30 group-open:block hidden text-sm" />
                </div>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-xs text-[#1C1C1E]/55 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}