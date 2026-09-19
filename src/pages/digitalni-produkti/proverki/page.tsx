import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FunnelSystemSection from './components/FunnelSystemSection';
import FunnelProofSection from './components/FunnelProofSection';
import FunnelPricingSection from './components/FunnelPricingSection';
import FunnelFAQSection from './components/FunnelFAQSection';
import ExitIntentPopup from './components/ExitIntentPopup';
import { metaPixel } from '@/lib/metaPixel';

const SUPABASE_FUNCTIONS_URL = 'https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1';

const PRODUCT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Система за дигитален маркетинг — 10 системи | ТАВОРА ЕООД',
  description: '1000 конкретни стъпки в 10 системи: AI промптиране, дизайн в Readdy, SEO и GEO, съдържание, социални мрежи, конверсия, технически основи, киберсигурност, аналитика, автоматизация. От 12 €.',
  brand: {
    '@type': 'Brand',
    name: 'ТАВОРА ЕООД',
  },
  offers: {
    '@type': 'Offer',
    price: '24',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://imashnujnoto.com/digitalni-produkti/proverki',
  },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Какво точно получавам?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10 системи с общо 1000 конкретни стъпки. Всяка система е самостоятелен HTML документ, който прилагате веднага. Не е курс — това е готова методология.',
      },
    },
    {
      '@type': 'Question',
      name: 'Как става плащането?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Карта, Google Pay или Apple Pay през Stripe. Плащате — получавате код — влизате. Целият процес отнема под 2 минути.',
      },
    },
    {
      '@type': 'Question',
      name: 'Мога ли да ги ползвам за мои клиенти?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да. Агенции и специалисти ги използват като вътрешна система за работа с клиенти.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ако не съм доволен?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '7 дни. Връщаме парите. Без въпроси. Без усложнения.',
      },
    },
  ],
};

export default function DigitalniProduktiProverkiPage() {
  const [loadingMain, setLoadingMain] = useState(false);
  const [errorMain, setErrorMain] = useState('');
  const [activeTier, setActiveTier] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params for tier on initial load
    const params = new URLSearchParams(window.location.search);
    const tierParam = params.get('tier');
    if (tierParam === 'single' || tierParam === 'bundle' || tierParam === 'complete') {
      setActiveTier(tierParam);
    }
  }, []);

  useEffect(() => {
    document.title = '1000 стъпки за дигитален маркетинг — от 12 € | ТАВОРА';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        '1000 конкретни стъпки в 10 системи. AI, SEO, GEO, съдържание, социални мрежи, конверсия, аналитика. От 12 € еднократно. 7 дни гаранция.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/digitalni-produkti/proverki');

    const schemas = [
      { id: 'schema-product-funnel', data: PRODUCT_SCHEMA },
      { id: 'schema-faq-funnel', data: FAQ_SCHEMA },
    ];
    schemas.forEach(({ id, data }) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    });
    return () => {
      schemas.forEach(({ id }) => {
        const existing = document.getElementById(id);
        if (existing) existing.remove();
      });
    };
  }, []);

  const handleMainCTA = async () => {
    setLoadingMain(true);
    setErrorMain('');
    // Meta Pixel — InitiateCheckout (wrapped in try to prevent blocking checkout)
    try {
      metaPixel.initiateCheckout('3 Systems Bundle — Main CTA', 24);
    } catch {
      // Ignore pixel errors — checkout is more important
    }
    console.log('[Funnel] handleMainCTA starting...');
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/stripe-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'bundle' }),
      });
      console.log('[Funnel] stripe-checkout status:', res.status);
      const data = await res.json();
      console.log('[Funnel] stripe-checkout data:', data);
      if (!res.ok || !data.url) {
        const errMsg = data.error || `HTTP ${res.status}`;
        console.error('[Funnel] stripe-checkout error:', errMsg);
        setErrorMain(errMsg);
        setLoadingMain(false);
        return;
      }
      console.log('[Funnel] Redirecting to:', data.url);
      // Use multiple redirect methods for mobile compatibility
      try {
        window.location.assign(data.url);
      } catch {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('[Funnel] stripe-checkout exception:', err?.message || err);
      setErrorMain('Грешка при свързване: ' + (err?.message || 'неизвестна'));
      setLoadingMain(false);
    }
  };

  const scrollToPricing = (tier: string) => {
    setActiveTier(tier);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Minimal sticky header */}
      <header className="w-full bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#1C1C1E]/6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#1C1C1E] tracking-tight">ТАВОРА</span>
          </Link>
          <button
            onClick={() => scrollToPricing('bundle')}
            className="px-5 py-2.5 bg-amber-500 text-black text-xs font-semibold rounded-full hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap"
          >
            Виж системите
          </button>
        </div>
      </header>

      {/* ── HERO — Meta ad optimized, half-screen punch ── */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=dark%20modern%20abstract%20background%20with%20warm%20golden%20and%20amber%20glowing%20accents%20geometric%20intersecting%20lines%20deep%20charcoal%20slate%20void%20atmosphere%20cinematic%20editorial%20no%20text&width=1600&height=900&seq=funnel-hero-v3&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" />
        </div>

        <div className="relative w-full max-w-3xl mx-auto px-4 md:px-8 py-14 md:py-28 text-center">
          {/* Above-fold punch for Meta ads — visible in half-screen */}
          <p className="text-[11px] text-amber-400/75 tracking-widest uppercase mb-3 font-medium">
            За хора, които знаят как се прави. Но нямат 6 месеца да го измислят.
          </p>

          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Ти можеш да го направиш сам.
            <br />
            <span className="text-amber-400/90">Но защо да го правиш?</span>
          </h1>

          <p className="text-sm md:text-base text-white/55 max-w-lg mx-auto leading-relaxed mb-7">
            1000 стъпки. 10 системи. Проучени, тествани и подредени.
            <strong className="text-white/80"> Вземи готовото и започни днес.</strong>
          </p>

          {errorMain && (
            <div className="max-w-sm mx-auto mb-5 p-3 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs">
              {errorMain}
            </div>
          )}

          <button
            onClick={handleMainCTA}
            disabled={loadingMain}
            className="px-8 py-4 md:px-10 md:py-5 bg-amber-500 text-black text-sm md:text-base font-semibold rounded-full hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loadingMain ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                Зареждане...
              </>
            ) : (
              <>
                Вземи 3 системи — 24 €
                <i className="ri-arrow-right-line" />
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-5">
            {['1000 стъпки', '10 системи', 'Доживотен достъп', '7 дни гаранция'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <i className="ri-check-line text-amber-400/60 text-xs" />
                <span className="text-[10px] text-white/40">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIY COST — acknowledge objection, reframe ── */}
      <section className="w-full bg-white py-10 md:py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-bold text-[#1C1C1E] leading-tight mb-2">
            Да де, ама <span className="text-amber-600">кой има 6 месеца</span> свободни?
          </h2>
          <p className="text-sm text-[#1C1C1E]/50 mb-8 max-w-lg mx-auto leading-relaxed">
            Да проучиш 10 системи. Да тестваш кое работи. Да напишеш 1000 стъпки. Да ги подредиш правилно.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {[
              {
                label: 'Ако го правиш сам',
                value: '6+ месеца проучване',
                sub: 'YouTube, форуми, тестове, грешки. Време, което не ти плаща никой.',
                accent: 'text-red-500/70',
              },
              {
                label: 'С нашата система',
                value: 'Започваш днес',
                sub: 'Всичко е готово. Следваш стъпките. Всеки ден имаш конкретно действие.',
                accent: 'text-amber-600',
              },
              {
                label: 'Разликата',
                value: '6 месеца спечелено време',
                sub: 'Това са 6 месеца повече клиенти. Повече приходи. Повече резултати.',
                accent: 'text-emerald-600/70',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 md:p-5 rounded-2xl border border-[#1C1C1E]/6 bg-[#FAFAF8]"
              >
                <div className="text-[10px] text-[#1C1C1E]/35 uppercase tracking-wider mb-2 font-medium">
                  {item.label}
                </div>
                <div className={`text-sm md:text-base font-semibold mb-1.5 ${item.accent}`}>
                  {item.value}
                </div>
                <div className="text-xs text-[#1C1C1E]/45 leading-relaxed">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SHIFT — imagine ── */}
      <section className="w-full bg-[#0A0B0D] py-10 md:py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white leading-tight mb-6 md:mb-8">
            Представете си да имате <span className="text-amber-400">точния план</span> всеки ден.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
            {[
              {
                icon: 'ri-search-eye-line',
                text: 'Клиентите ви намират в Google, ChatGPT и Maps — без да плащате за всяко кликване.',
              },
              {
                icon: 'ri-line-chart-line',
                text: 'Всеки лев за реклами отива точно там, където носи резултат. Без изгорен бюджет.',
              },
              {
                icon: 'ri-timer-line',
                text: 'Знаете какво правите днес, утре и следващите 30 дни. Без "какво пък сега?"',
              },
            ].map((item, i) => (
              <div key={i} className="p-4 md:p-5 rounded-2xl border border-white/8 bg-white/3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
                  <i className={`${item.icon} text-amber-400 text-lg`} />
                </div>
                <p className="text-sm text-white/65 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SYSTEM (10 categories) ── */}
      <FunnelSystemSection />

      {/* ── SOCIAL PROOF ── */}
      <FunnelProofSection />

      {/* ── PRICING — 24€ bestseller ── */}
      <FunnelPricingSection activeTier={activeTier} onTierChange={setActiveTier} />

      {/* ── FAQ ── */}
      <FunnelFAQSection />

      {/* ── FINAL PUSH ── */}
      <section className="w-full bg-[#0A0B0D] py-10 md:py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-amber-400/70 text-[11px] tracking-widest uppercase mb-3 font-medium">
            Не чакайте
          </p>
          <h2 className="text-xl md:text-3xl font-bold text-white leading-tight mb-3">
            Всеки ден без система = пропуснати клиенти.
          </h2>
          <p className="text-sm text-white/50 mb-7 max-w-md mx-auto leading-relaxed">
            Можеш да го измислиш сам за 6 месеца. Или да го вземеш готово за 24 € и да започнеш днес. Изборът е твой — но времето не чака.
          </p>

          <button
            onClick={handleMainCTA}
            disabled={loadingMain}
            className="px-8 py-4 md:px-10 md:py-5 bg-amber-500 text-black text-sm md:text-base font-semibold rounded-full hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2 disabled:opacity-50"
          >
            {loadingMain ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                Зареждане...
              </>
            ) : (
              <>
                Вземи 3 системи — 24 €
                <i className="ri-arrow-right-line" />
              </>
            )}
          </button>

          <p className="text-xs text-white/25 mt-4">
            7-дневна гаранция. Без риск.
          </p>
        </div>
      </section>

      {/* Exit Intent Popup */}
      <ExitIntentPopup />

      {/* Sticky Mobile CTA — always visible on small screens */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#1C1C1E]/10 px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-[#1C1C1E] leading-tight">
            3 системи — 24 €
          </div>
          <div className="text-[10px] text-[#1C1C1E]/45">
            <i className="ri-shield-check-line text-emerald-500 text-[10px]" /> 7 дни гаранция
          </div>
        </div>
        <button
          onClick={handleMainCTA}
          disabled={loadingMain}
          className="shrink-0 px-6 py-2.5 bg-amber-500 text-black text-xs font-bold rounded-full hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"
        >
          {loadingMain ? (
            <>
              <i className="ri-loader-4-line animate-spin text-[10px]" />
              Момент...
            </>
          ) : (
            <>
              Вземи сега
              <i className="ri-arrow-right-line text-[10px]" />
            </>
          )}
        </button>
      </div>

      {/* Footer — extra padding-bottom on mobile for sticky CTA */}
      <footer className="w-full bg-white border-t border-[#1C1C1E]/6 py-6 px-4 md:px-8 pb-24 lg:pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#1C1C1E]/40">
            © 2026 ТАВОРА ЕООД. Всички права запазени.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-[11px] text-[#1C1C1E]/40 hover:text-[#1C1C1E]/70">
              Поверителност
            </Link>
            <Link to="/terms" className="text-[11px] text-[#1C1C1E]/40 hover:text-[#1C1C1E]/70">
              Условия
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}