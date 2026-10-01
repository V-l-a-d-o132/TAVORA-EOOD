import { MARKETING_BASICS_FAQ } from '@/data/academy-public-faq';
import { useState } from 'react';

const FAQ_ITEMS = MARKETING_BASICS_FAQ;

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
