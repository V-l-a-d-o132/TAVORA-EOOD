import { useState, useRef } from 'react';
import { metaPixel } from '@/lib/metaPixel';

const SUPABASE_FUNCTIONS_URL = 'https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1';

interface FunnelPricingSectionProps {
  activeTier: string | null;
  onTierChange: (tier: string | null) => void;
}

export default function FunnelPricingSection({ activeTier, onTierChange }: FunnelPricingSectionProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  const handleBuy = async (tier: string) => {
    setLoadingTier(tier);
    setError('');

    try {
      try {
        const value = tier === 'single' ? 12 : tier === 'bundle' ? 24 : 78;
        const name = tier === 'single' ? '1 System' : tier === 'bundle' ? '3 Systems Bundle' : 'Complete 10 Systems';
        metaPixel.initiateCheckout(name, value);
      } catch {
        // Ignore pixel errors
      }

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/stripe-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || `HTTP ${res.status}`);
        setLoadingTier(null);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Грешка при свързване. Проверете интернета и опитайте отново.');
      setLoadingTier(null);
    }
  };

  const systems = [
    'Промптиране и AI',
    'Дизайн в Readdy',
    'SEO и GEO',
    'Съдържание',
    'Социални мрежи',
    'Конверсия',
    'Технически основи',
    'Киберсигурност',
    'Аналитика',
    'Автоматизация',
  ];

  return (
    <>
      {/* Trust Badges Bar — BEFORE pricing for maximum confidence */}
      <section className="w-full bg-white py-6 md:py-8 px-4 md:px-8 border-t border-[#1C1C1E]/5">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-5 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <i className="ri-shield-check-line text-emerald-500 text-lg" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1C1C1E] leading-none mb-0.5">7 дни гаранция</div>
              <div className="text-[10px] text-[#1C1C1E]/40">100% връщане на парите</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#1C1C1E]/5 flex items-center justify-center">
              <i className="ri-lock-line text-[#1C1C1E]/50 text-lg" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1C1C1E] leading-none mb-0.5">Сигурно плащане</div>
              <div className="text-[10px] text-[#1C1C1E]/40">Stripe · SSL криптирано</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <i className="ri-flashlight-line text-amber-500 text-lg" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1C1C1E] leading-none mb-0.5">Мигновен достъп</div>
              <div className="text-[10px] text-[#1C1C1E]/40">Кодът идва веднага</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#1C1C1E]/5 flex items-center justify-center">
              <i className="ri-user-star-line text-[#1C1C1E]/50 text-lg" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1C1C1E] leading-none mb-0.5">500+ клиенти</div>
              <div className="text-[10px] text-[#1C1C1E]/40">Доверен избор от 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section ref={sectionRef} className="w-full bg-[#FAFAF8] py-12 md:py-20 px-4 md:px-8 lg:px-16 border-t border-[#1C1C1E]/5" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4 md:mb-6">
            <p className="text-[11px] text-[#1C1C1E]/40 tracking-widest uppercase mb-2 font-medium">
              ЕДНОКРАТНО ПЛАЩАНЕ · ДОЖИВОТЕН ДОСТЪП
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-[#1C1C1E] leading-tight mb-2">
              Избери своя пакет.{' '}
              <span className="text-amber-600">Започни днес.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/50 max-w-md mx-auto leading-relaxed">
              3 системи са достатъчни за 80% от бизнеса. Повечето клиенти започват оттам.
            </p>

            {/* Limited-time urgency */}
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-red-50 border border-red-100">
              <i className="ri-timer-flash-line text-red-500 text-sm" />
              <span className="text-xs font-medium text-red-600">
                Цените са въвеждащи — от утре 24 € става 34 €
              </span>
            </div>
          </div>

          {error && (
            <div className="max-w-lg mx-auto mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <i className="ri-error-warning-line shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Pricing Cards — all buy buttons visible, no "Научи повече" toggle */}
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 lg:gap-5 max-w-4xl mx-auto">
            {/* 12€ — Entry */}
            <div className="flex-1 rounded-2xl border border-[#1C1C1E]/8 bg-white p-5 md:p-6 flex flex-col hover:border-[#1C1C1E]/15 transition-all">
              <div className="text-center mb-4">
                <div className="text-xs text-[#1C1C1E]/35 uppercase tracking-wider mb-1 font-medium">Старт</div>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-3xl md:text-4xl font-bold text-[#1C1C1E]">12 €</span>
                </div>
                <p className="text-[11px] text-[#1C1C1E]/45 mt-1">1 система по ваш избор</p>
              </div>

              <div className="mb-4 text-left flex-1">
                <p className="text-xs text-[#1C1C1E]/55 mb-3">Изберете една от 10-те системи:</p>
                <div className="grid grid-cols-2 gap-1">
                  {systems.slice(0, 6).map((s) => (
                    <div key={s} className="text-[10px] text-[#1C1C1E]/50 flex items-center gap-1">
                      <i className="ri-check-line text-[#1C1C1E]/25 text-[10px]" />
                      {s}
                    </div>
                  ))}
                  <div className="text-[10px] text-[#1C1C1E]/35 flex items-center gap-1">... и още 4</div>
                </div>
              </div>

              <button
                onClick={() => handleBuy('single')}
                disabled={loadingTier === 'single'}
                className="w-full py-3 rounded-full text-sm font-semibold border-2 border-[#1C1C1E] text-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-white transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
              >
                {loadingTier === 'single' ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    Зареждане...
                  </>
                ) : (
                  <>
                    Купи за 12 €
                    <i className="ri-arrow-right-line" />
                  </>
                )}
              </button>
            </div>

            {/* 24€ — BESTSELLER */}
            <div className="flex-1 rounded-2xl border-2 border-amber-400 bg-white p-5 md:p-6 flex flex-col relative shadow-lg shadow-amber-500/10 scale-[1.02] lg:scale-105 z-10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[11px] px-5 py-1.5 rounded-full font-bold tracking-wide whitespace-nowrap z-10">
                Препоръчан · Най-продаван
              </div>

              <div className="text-center mb-4 mt-1">
                <div className="text-xs text-amber-600/70 uppercase tracking-wider mb-1 font-semibold">За 80% от бизнесите</div>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-lg text-[#1C1C1E]/30 line-through">34 €</span>
                  <span className="text-4xl md:text-5xl font-bold text-[#1C1C1E]">24 €</span>
                </div>
                <p className="text-[11px] text-[#1C1C1E]/50 mt-1 font-medium">3 системи по ваш избор</p>
                <p className="text-[10px] text-red-500/70 font-medium mt-0.5">Въвеждаща цена — от утре 34 €</p>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                {[
                  '3 системи = 300 конкретни стъпки',
                  'Избираш кои 3 системи ти трябват',
                  'Доживотен достъп — без месечни такси',
                  '7-дневна гаранция за връщане',
                  'Мигновен достъп след плащане',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-check-line text-amber-500 text-xs" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy('bundle')}
                disabled={loadingTier === 'bundle'}
                className="w-full py-4 rounded-full text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 mt-auto shadow-md shadow-amber-500/20"
              >
                {loadingTier === 'bundle' ? (
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

              <p className="text-[10px] text-[#1C1C1E]/35 text-center mt-2">
                14-day money-back guarantee
              </p>
            </div>

            {/* 78€ — Complete */}
            <div className="flex-1 rounded-2xl border border-[#1C1C1E]/8 bg-white p-5 md:p-6 flex flex-col hover:border-[#1C1C1E]/15 transition-all">
              <div className="text-center mb-4">
                <div className="text-xs text-[#1C1C1E]/35 uppercase tracking-wider mb-1 font-medium">За агенции</div>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-lg text-[#1C1C1E]/30 line-through">120 €</span>
                  <span className="text-3xl md:text-4xl font-bold text-[#1C1C1E]">78 €</span>
                </div>
                <p className="text-[11px] text-[#1C1C1E]/45 mt-1">Всички 10 системи</p>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                {[
                  '1000 стъпки — пълната методология',
                  'Всички 10 системи наведнъж',
                  'Спестяваш 42 € спрямо единични',
                  'За агенции и сериозен бизнес',
                  'Приоритетна поддръжка',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                      <i className="ri-check-line text-[#1C1C1E]/40 text-xs" />
                    </div>
                    <span className="text-xs text-[#1C1C1E]/65 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy('complete')}
                disabled={loadingTier === 'complete'}
                className="w-full py-3 rounded-full text-sm font-semibold border-2 border-[#1C1C1E] text-[#1C1C1E] hover:bg-[#1C1C1E] hover:text-white transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2 mt-auto"
              >
                {loadingTier === 'complete' ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    Зареждане...
                  </>
                ) : (
                  <>
                    Купи за 78 €
                    <i className="ri-arrow-right-line" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Payment methods row */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
            <div className="flex items-center gap-1.5">
              <i className="ri-bank-card-line text-[#1C1C1E]/25 text-sm" />
              <span className="text-[10px] text-[#1C1C1E]/35">Карта, GPay, Apple Pay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="ri-lock-line text-[#1C1C1E]/25 text-sm" />
              <span className="text-[10px] text-[#1C1C1E]/35">Сигурно през Stripe</span>
            </div>
            <div className="flex items-center gap-1.5">
              <i className="ri-shield-check-line text-[#1C1C1E]/25 text-sm" />
              <span className="text-[10px] text-[#1C1C1E]/35">7 дни гаранция за връщане</span>
            </div>
          </div>

          {/* Stripe + Security badges */}
          <div className="flex items-center justify-center gap-5 mt-5">
            <div className="flex items-center gap-1.5 text-[10px] text-[#1C1C1E]/30">
              <i className="ri-shield-flash-line text-xs" />
              SSL Encrypted
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#1C1C1E]/30">
              <i className="ri-secure-payment-line text-xs" />
              Powered by Stripe
            </div>
          </div>
        </div>
      </section>
    </>
  );
}