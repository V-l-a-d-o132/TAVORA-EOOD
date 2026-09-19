import { Link } from 'react-router-dom';
import { metaPixel } from '@/lib/metaPixel';
import {
  buildCheckoutUrl,
  formatPrice,
  getTierById,
  INDIVIDUAL_TOTAL,
  type PricingTier,
} from '@/config/pricing';

interface ProgramPricingProps {
  /** Вътрешен ID на основната програма на страницата (silkRoad | perfectVideo | marketingBasics). */
  primaryTierId: string;
  /** Дали да покаже Стартовия пакет (само за „Пътят на коприната“). */
  showStarter?: boolean;
  /** Дали да покаже Пълен достъп като втори избор. */
  showFullAccess?: boolean;
  /** Дали да покаже стратегическия пакет като отделна възможност. */
  showStrategic?: boolean;
  anchorId?: string;
}

export default function ProgramPricing({
  primaryTierId,
  showStarter = false,
  showFullAccess = true,
  showStrategic = true,
  anchorId = 'cena',
}: ProgramPricingProps) {
  const primary = getTierById(primaryTierId);
  const fullAccess = getTierById('fullAccess');
  const starter = getTierById('starter');
  const strategic = getTierById('strategicAccess');

  if (!primary || !fullAccess) return null;

  const track = (tier: PricingTier) => {
    metaPixel.track('AddToCart', {
      content_name: `Академия TAVORA — ${tier.name}`,
      content_category: 'Академия TAVORA',
      value: tier.price,
      currency: 'EUR',
    });
  };

  const cards: PricingTier[] = [
    ...(showStarter && starter ? [starter] : []),
    primary,
    ...(showFullAccess ? [fullAccess] : []),
  ];

  return (
    <section id={anchorId} className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Цени</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Избери как да продължиш
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-8 max-w-xl">
        Ясни избори, без скрити такси и без автоматично подновяване.
      </p>

      <div className={`grid grid-cols-1 ${cards.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4 md:gap-5`}>
        {cards.map((tier) => {
          const isPrimary = tier.id === primaryTierId;
          const isFull = tier.id === 'fullAccess';
          return (
            <div
              key={tier.id}
              className="p-6 md:p-7 flex flex-col rounded-2xl"
              style={{
                background: isPrimary ? '#fff' : '#F9F9F7',
                border: isPrimary ? '2px solid #e53e3e' : '1px solid rgba(28,28,30,0.08)',
              }}
            >
              <div className="mb-4">
                <h3 className="text-base font-semibold text-[#1C1C1E] mb-1">{tier.name}</h3>
                <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-3xl font-light" style={{ color: isPrimary ? '#e53e3e' : '#1C1C1E', fontFamily: "'Cormorant Garamond', serif" }}>
                  {formatPrice(tier.price)}
                </span>
                <span className="text-xs text-[#1C1C1E]/55">еднократно</span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-[#1C1C1E]/70">
                    <i className="ri-check-line text-sm shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {tier.id === 'starter' && (
                <div className="p-3 mb-5 rounded-lg bg-[#F9F9F7] border border-[#1C1C1E]/8">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1C1C1E]/55 mb-1">Какво не е включено</div>
                  <p className="text-xs text-[#1C1C1E]/60 leading-relaxed">
                    Revenue Blueprint (последния, 11-и модул) и двете други програми — „Перфектното Видео“ и „Marketing Basics“.
                  </p>
                </div>
              )}

              {isFull && (
                <p className="text-xs text-[#1C1C1E]/60 leading-relaxed mb-4">
                  При отделна покупка: {formatPrice(INDIVIDUAL_TOTAL)}. Пълен достъп: {formatPrice(fullAccess.price)}. Спестяваш {formatPrice(INDIVIDUAL_TOTAL - fullAccess.price)}.
                </p>
              )}

              {tier.includesCertificate && (
                <p className="text-[11px] text-[#1C1C1E]/50 leading-relaxed mb-4">
                  Сертификатът е за завършено обучение, а не държавно призната професионална квалификация.
                </p>
              )}

              <Link
                to={buildCheckoutUrl(tier.id)}
                onClick={() => track(tier)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-all cursor-pointer whitespace-nowrap"
                style={{
                  background: isPrimary ? '#e53e3e' : '#1C1C1E',
                  color: '#fff',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                {isPrimary ? `Вземи ${primary.name}` : tier.id === 'fullAccess' ? 'Избери пълен достъп' : 'Избери пакет'}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Стратегически пакет — отделна възможност */}
      {showStrategic && strategic && (
        <div className="mt-6 p-6 md:p-7 rounded-2xl bg-[#0F1F35] text-white">
          <div className="flex items-center gap-2 mb-2">
            <i className="ri-vip-crown-line text-lg text-white/80" />
            <h3 className="text-base font-semibold">{strategic.name}</h3>
          </div>
          <p className="text-sm text-white/75 leading-relaxed mb-4">{strategic.description}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {formatPrice(strategic.price)}
            </span>
            <Link
              to={buildCheckoutUrl(strategic.id)}
              onClick={() => track(strategic)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-full transition-all cursor-pointer whitespace-nowrap bg-white text-[#0A2540] hover:opacity-90"
            >
              Научи повече
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}