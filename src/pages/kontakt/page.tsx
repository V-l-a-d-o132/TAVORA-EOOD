import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import LazyMap from '@/components/feature/LazyMap';

const serviceOptions = [
  { id: 'website', label: 'Изработка на сайт', price: 'от 999 €' },
  { id: 'seo', label: 'SEO & GEO оптимизация', price: '390 € еднократно' },
  { id: 'ads', label: 'Рекламни кампании', price: 'от 290 € / мес.' },
  { id: 'video', label: 'Видео продукция', price: 'от 290 €' },
  { id: 'full', label: 'Цялостно присъствие', price: 'по запитване' },
];

const faqs = [
  {
    q: 'Колко бързо отговаряте на запитвания?',
    a: 'Отговаряме в рамките на 24 часа в работни дни. След получаване на вашето запитване ще ви изпратим индивидуална оферта с конкретни срокове и цена.',
  },
  {
    q: 'Работите ли само с бизнеси от Велико Търново?',
    a: 'Не — работим с бизнеси от цяла България и ЕС. SEO услугите са особено ефективни за локални бизнеси в Търново, Габрово, Плевен и Русе, защото познаваме регионалния пазар.',
  },
  {
    q: 'Каква е цената за SEO оптимизация?',
    a: 'Еднократният SEO одит е 390 €. Месечната поддръжка и GEO оптимизация започват от 290 € / мес. Всяка оферта е индивидуална според конкуренцията във вашата ниша.',
  },
  {
    q: 'Мога ли да разговарям с Владимир директно?',
    a: 'Да — Владимир Атанасов, основател на ТАВОРА ЕООД, участва във всяка стратегическа среща и първоначална консултация.',
  },
  {
    q: 'Предлагате ли безплатна консултация?',
    a: 'Първоначалната видео среща (30 мин) е включена в офертата и не се таксува отделно. Там анализираме вашия бизнес, конкуренцията и възможностите.',
  },
  {
    q: 'Как се заплащат услугите?',
    a: '50% авансово при стартиране, 50% при приключване на проекта. За месечни абонаменти (реклами, SEO) — плащане в началото на всеки месец.',
  },
];

const KONTAKT_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kontakt#webpage',
      url: 'https://imashnujnoto.com/kontakt',
      name: 'Контакт | Поискайте оферта — ТАВОРА ЕООД',
      description:
        'Свържете се с ТАВОРА ЕООД за дигитален маркетинг, SEO, GEO оптимизация, реклами и видео продукция. Отговаряме в рамките на 24 часа с индивидуална оферта.',
      inLanguage: 'bg',
      dateModified: '2026-05-05',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Контакт', item: 'https://imashnujnoto.com/kontakt' },
        ],
      },
    },
    {
      '@type': 'ContactPage',
      '@id': 'https://imashnujnoto.com/kontakt#contactpage',
      name: 'Контакт — ТАВОРА ЕООД',
      url: 'https://imashnujnoto.com/kontakt',
      description: 'Форма за запитване и оферта за дигитален маркетинг, SEO, GEO оптимизация, реклами и видео продукция.',
      mainEntity: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        taxID: '208438650',
        email: 'tavoraagency@gmail.com',
        telephone: '+359885189724',
        url: 'https://imashnujnoto.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'ул. "Велчо Джамджията"',
          addressLocality: 'Велико Търново',
          postalCode: '5000',
          addressCountry: 'BG',
        },
        areaServed: [
          { '@type': 'City', name: 'Велико Търново' },
          { '@type': 'AdministrativeArea', name: 'Търновска област' },
          { '@type': 'Country', name: 'България' },
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': 'https://imashnujnoto.com/kontakt#faq',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
};

export default function KontaktPage() {
  const [selected, setSelected] = useState('website');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const id = 'schema-kontakt';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(KONTAKT_SCHEMA);

    document.title = 'Контакт | Поискайте оферта — ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Свържете се с ТАВОРА ЕООД за дигитален маркетинг, SEO, GEO оптимизация, реклами и видео продукция. Отговаряме в рамките на 24 часа с индивидуална оферта.');

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

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
    <div className="min-h-screen bg-[#F9F9F9]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-6xl mx-auto px-4 md:px-16 py-8 md:py-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Поискайте оферта</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 md:mb-16">
          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Свържете се
            <br />
            <span className="italic text-[#0A2540]">с нас.</span>
          </h1>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed self-end max-w-md">
            Опишете накратко вашия бизнес и какво искате да постигнете. Ще се свържем с вас за индивидуална оферта в рамките на 24 часа.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left — service selector + info */}
          <div>
            <h2
              className="text-lg font-light text-[#1C1C1E] mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Изберете услуга
            </h2>
            <div className="space-y-2.5 mb-8">
              {serviceOptions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    selected === s.id
                      ? 'border-[#0A2540]/30 bg-white'
                      : 'border-[#1C1C1E]/8 bg-white hover:border-[#1C1C1E]/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium leading-snug ${selected === s.id ? 'text-[#0A2540]' : 'text-[#1C1C1E]'}`}>{s.label}</span>
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

            {/* Contact info cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                    <i className="ri-mail-line text-[#0A2540]/60 text-base" />
                  </div>
                  <div>
                    <div className="text-xs text-[#1C1C1E]/65 mb-0.5">Имейл</div>
                    <a href="mailto:tavoraagency@gmail.com" className="text-sm text-[#0A2540] hover:underline decoration-dotted">tavoraagency@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                    <i className="ri-article-line text-[#0A2540]/60 text-base" />
                  </div>
                  <div>
                    <div className="text-xs text-[#1C1C1E]/65 mb-0.5">SEO ресурси</div>
                    <Link to="/blog" className="text-sm text-[#0A2540] hover:underline decoration-dotted">Четете нашия блог →</Link>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                    <i className="ri-graduation-cap-line text-[#0A2540]/60 text-base" />
                  </div>
                  <div>
                    <div className="text-xs text-[#1C1C1E]/65 mb-0.5">Искате да го научите сами?</div>
                    <Link to="/kurs" className="text-sm text-[#0A2540] hover:underline decoration-dotted">Виж курса →</Link>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4 shrink-0">
                    <i className="ri-share-line text-[#0A2540]/60 text-base" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#1C1C1E]/65 mb-0.5">Социални мрежи</div>
                    <div className="flex flex-wrap gap-2">
                      <a href="https://www.facebook.com/profile.php?id=61589264103453" target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-[#0A2540] hover:underline decoration-dotted flex items-center gap-1"><i className="ri-facebook-fill text-xs" /> Facebook</a>
                      <a href="https://www.instagram.com/marketingattavora/" target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-[#0A2540] hover:underline decoration-dotted flex items-center gap-1"><i className="ri-instagram-line text-xs" /> Instagram</a>
                      <a href="https://www.tiktok.com/@tavoramarketingagency" target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-[#0A2540] hover:underline decoration-dotted flex items-center gap-1"><i className="ri-tiktok-fill text-xs" /> TikTok</a>
                      <a href="https://www.youtube.com/@TavoraMarketingAgency" target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-[#0A2540] hover:underline decoration-dotted flex items-center gap-1"><i className="ri-youtube-fill text-xs" /> YouTube</a>
                      <a href="https://share.google/sP3ydTe4iqEO44qua" target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-[#0A2540] hover:underline decoration-dotted flex items-center gap-1"><i className="ri-google-fill text-xs" /> Google Business</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl border border-[#1C1C1E]/8 p-6 md:p-8">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 flex items-center justify-center rounded-full border border-[#1B4332]/20 mb-6">
                  <i className="ri-check-line text-xl text-[#1B4332]" />
                </div>
                <h3
                  className="text-2xl font-light text-[#1C1C1E] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Заявката е получена.
                </h3>
                <p className="text-sm text-[#1C1C1E]/65 max-w-xs leading-relaxed">
                  Ще се свържем с вас в рамките на 24 часа за индивидуална оферта.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Име</label>
                    <input
                      type="text"
                      name="first_name"
                      required
                      placeholder="Иван"
                      className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Фамилия</label>
                    <input
                      type="text"
                      name="last_name"
                      required
                      placeholder="Петров"
                      className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Имейл адрес</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ivan@example.com"
                    className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+359 88 888 8888"
                    className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Тип услуга</label>
                  <div className="relative">
                    <select
                      name="service"
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors appearance-none cursor-pointer pr-9"
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
                    className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors resize-none"
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

        {/* FAQ Section — adds content depth for indexing */}
        <div className="mt-16 md:mt-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Често задавани въпроси</span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Всичко, което искате да <span className="italic text-[#0A2540]">знаете</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#1C1C1E]/8 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer"
                >
                  <span className="text-sm font-medium text-[#1C1C1E]">{faq.q}</span>
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full border border-[#1C1C1E]/10 shrink-0 transition-all ${openFaq === i ? 'bg-[#0A2540] border-[#0A2540]' : ''}`}>
                    <i className={`ri-${openFaq === i ? 'subtract' : 'add'}-line text-xs ${openFaq === i ? 'text-white' : 'text-[#1C1C1E]/65'}`} />
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related services */}
        <div className="mt-12 md:mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Разгледайте услугите</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'Изработка на сайт', desc: 'Сайтове с вградено SEO от 999 €', link: '/uslugi/izrabotka-na-sait' },
              { title: 'SEO & GEO', desc: 'AI-оптимизация от 390 €', link: '/uslugi/seo-geo' },
              { title: 'Рекламни кампании', desc: 'Meta, Google, TikTok от 290 €', link: '/uslugi/reklamni-kampanii' },
              { title: 'Видео продукция', desc: 'Рекламни видеа от 290 €', link: '/uslugi/video-produkciya' },
            ].map((s) => (
              <Link
                key={s.title}
                to={s.link}
                className="group p-5 bg-white rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all duration-200"
              >
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-1 group-hover:text-[#0A2540] transition-colors">{s.title}</h3>
                <p className="text-xs text-[#1C1C1E]/65">{s.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-[#0A2540]/60 group-hover:text-[#0A2540] transition-colors">
                  <span>Виж повече</span>
                  <i className="ri-arrow-right-line" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-12 md:mt-16">
          <LazyMap
            title="ТАВОРА ЕООД — Велико Търново"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.0!2d25.6415!3d43.0785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z0JLQtdC70LjQutC-INCi0YrRgNC90L7QstC-!5e0!3m2!1sbg!2sbg!4v1700000000000!5m2!1sbg!2sbg&q=ул.+Велчо+Джамджията,+Велико+Търново,+България"
            height={280}
          />
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}