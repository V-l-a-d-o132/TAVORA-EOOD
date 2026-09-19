import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import LazyMap from '@/components/feature/LazyMap';

const serviceOptions = [
  { id: 'website', label: 'Изработка на сайт', price: 'от 999 €' },
  { id: 'seo', label: 'SEO & GEO оптимизация', price: '390 € еднократно' },
  { id: 'ads', label: 'Рекламни кампании', price: 'от 290 € / мес.' },
  { id: 'video', label: 'Видео продукция', price: 'от 290 €' },
  { id: 'full', label: 'Цялостно присъствие', price: 'по запитване' },
];

export default function AgencyContactSection() {
  const [selected, setSelected] = useState('website');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot check
    const honeypot = formData.get('company_alt');
    if (honeypot && String(honeypot).trim()) {
      setSubmitted(true);
      setLoading(false);
      return;
    }

    const serviceLabel = serviceOptions.find(s => s.id === selected)?.label ?? selected;
    const firstName = String(formData.get('first_name') || '').trim();
    const lastName = String(formData.get('last_name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    try {
      const { error } = await supabase.from('contact_messages').insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        service: serviceLabel,
        message,
      }]);
      if (error) throw error;
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-8 md:py-32 bg-[#F9F9F9] w-full overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        <div className="flex items-center gap-3 mb-8 md:mb-14" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Поискайте оферта</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
          {/* Left */}
          <div>
            <h2 className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Изберете услуга
              <br />
              <span className="italic text-[#0A2540]">и се свържете с нас.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Опишете накратко вашия бизнес и какво искате да постигнете. Ще се свържем с вас за индивидуална оферта.
            </p>

            <div className="space-y-2.5">
              {serviceOptions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selected === s.id
                      ? 'border-[#0A2540]/30 bg-[#0A2540]/4'
                      : 'border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/20'
                  }`}
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[#1C1C1E] leading-snug">{s.label}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#1C1C1E]/65 whitespace-nowrap hidden sm:block">{s.price}</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === s.id ? 'border-[#0A2540] bg-[#0A2540]' : 'border-[#1C1C1E]/20'}`}>
                        {selected === s.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#1C1C1E]/65 mt-0.5 sm:hidden">{s.price}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-2 mb-2">
                <i className="ri-information-line text-[#0A2540]/65 text-sm" />
                <span className="text-xs font-medium text-[#1C1C1E]/60">Искате да го научите сами?</span>
              </div>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                Всичко, което правим — преподаваме и в курса.{' '}
                <a href="/kurs" className="text-[#0A2540] underline decoration-dotted hover:no-underline">Виж курса →</a>
              </p>
            </div>

            {/* Address info */}
            <div className="mt-6 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <i className="ri-map-pin-line text-[#0A2540]/60 text-base" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1C1C1E]/70 mb-0.5">Работим в</p>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                    Велико Търново и цяла България
                  </p>
                  <p className="text-xs text-[#1C1C1E]/65 mt-1">ТАВОРА ЕООД · ЕИК 208438650</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-14 h-14 flex items-center justify-center rounded-full border border-[#1B4332]/20 mb-6">
                  <i className="ri-check-line text-xl text-[#1B4332]" />
                </div>
                <h3 className="text-2xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Заявката е получена.
                </h3>
                <p className="text-sm text-[#1C1C1E]/65 max-w-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Ще се свържем с вас в рамките на 24 часа за индивидуална оферта.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Име</label>
                    <input type="text" name="first_name" required placeholder="Иван" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-white focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Фамилия</label>
                    <input type="text" name="last_name" required placeholder="Петров" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-white focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Имейл адрес</label>
                  <input type="email" name="email" required placeholder="ivan@example.com" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-white focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Телефон</label>
                  <input type="tel" name="phone" placeholder="+359 88 888 8888" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-white focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Тип услуга</label>
                  <div className="relative">
                    <select
                      name="service"
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] bg-white focus:outline-none focus:border-[#0A2540]/30 transition-colors appearance-none cursor-pointer pr-9"
                    >
                      {serviceOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} — {s.price}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                      <i className="ri-arrow-down-s-line text-[#1C1C1E]/65 text-base" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Разкажете за вашия бизнес</label>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={500}
                    placeholder="Какъв е вашият бизнес и какво искате да постигнете?"
                    className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-white focus:outline-none focus:border-[#0A2540]/30 transition-colors resize-none"
                  />
                </div>
                {/* Honeypot */}
                <div className="opacity-0 absolute -left-[9999px]">
                  <input type="text" name="company_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-60"
                >
                  {loading ? 'Изпращане...' : 'Поискайте оферта →'}
                </button>
                <p className="text-xs text-[#1C1C1E]/70 text-center">Вашите данни са защитени. Без спам.</p>
              </form>
            )}
          </div>
        </div>

        {/* Google Maps embed */}
        <div className="mt-14 md:mt-20">
          <LazyMap
            title="ТАВОРА ЕООД — Велико Търново"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.0!2d25.6415!3d43.0785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JLQtdC70LjQutC-INCi0YrRgNC90L7QstC-!5e0!3m2!1sbg!2sbg!4v1700000000000!5m2!1sbg!2sbg&q=ул.+Велчо+Джамджията,+Велико+Търново,+България"
            height={260}
          />
        </div>
      </div>
    </section>
  );
}
