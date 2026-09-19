import { Link } from 'react-router-dom';
import { metaPixel } from '@/lib/metaPixel';
import { formatPrice, INDIVIDUAL_TOTAL, STANDALONE_PROGRAMS } from '@/config/pricing';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  greenBg: '#0a1f0a',
};

interface MainTier {
  id: string;
  name: string;
  price: number;
  route: string;
  recommended?: boolean;
  note?: string;
  includes: string[];
  extra?: { title: string; body: string };
}

const MAIN_TIERS: MainTier[] = [
  {
    id: 'starter',
    name: 'Стартов пакет',
    price: 49,
    route: '/kurs/ai-business-blueprint',
    includes: [
      'Първите 10 модула от „Пътят на коприната“',
      'Доживотен достъп до избраните модули',
    ],
    note: 'Подходящ за човек, който първо иска да изгради основите.',
    extra: {
      title: 'Какво не е включено',
      body: 'Revenue Blueprint (последния, 11-и модул) и двете други програми — „Перфектното Видео“ и „Marketing Basics“.',
    },
  },
  {
    id: 'fullAccess',
    name: 'Пълен достъп',
    price: 249,
    route: '/kurs/checkout?tier=premium-all',
    recommended: true,
    includes: [
      'Всички 46 модула',
      '492+ урока',
      'Трите пълни програми',
      'Тестове и практически материали',
      'Доживотен достъп',
      'Бъдещи обновления',
      'Сертификат за завършване',
    ],
    note: `При отделна покупка: ${formatPrice(INDIVIDUAL_TOTAL)}. Пълен достъп: ${formatPrice(249)}. Спестяваш ${formatPrice(INDIVIDUAL_TOTAL - 249)}.`,
    extra: {
      title: 'За сертификата',
      body: 'Това е сертификат за завършено обучение, а не държавно призната професионална квалификация.',
    },
  },
  {
    id: 'strategicAccess',
    name: 'Пълен достъп + стратегически сесии',
    price: 497,
    route: '/kurs/checkout?tier=strategic_access',
    includes: [
      'Всичко от пълния достъп',
      '2 индивидуални онлайн стратегически срещи по 60 минути с Владимир Атанасов',
      'Първа среща: анализ на идеята, офертата, позиционирането и плана',
      'Втора среща: преглед на изпълнението, корекции и следващи действия',
      '„Системата зад Академия TAVORA“ — практически ресурс',
    ],
  },
];

export default function AkademiyaEnrollmentSection() {
  const handleCheckout = (tier: MainTier) => {
    metaPixel.track('AddToCart', {
      content_name: `Академия TAVORA — ${tier.name}`,
      content_category: 'Академия TAVORA',
      value: tier.price,
      currency: 'EUR',
    });
  };

  return (
    <section id="akademiya-enrollment" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Цени</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Избери как да започнеш
          </h2>
          <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: C.textMuted }}>
            Три ясни избора. Без скрити такси и без автоматично подновяване.
          </p>
        </div>

        {/* Main tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {MAIN_TIERS.map((tier) => {
            const isRecommended = tier.recommended;
            return (
              <div
                key={tier.id}
                className="p-6 md:p-7 flex flex-col relative"
                style={{
                  background: isRecommended ? C.accentDim : C.surface,
                  border: isRecommended ? `2px solid ${C.accent}` : `1px solid ${C.border}`,
                }}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-bold px-3 py-1 whitespace-nowrap" style={{ background: C.accent, color: '#fff' }}>
                      ПРЕПОРЪЧАН
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-2" style={{ color: C.text }}>{tier.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight" style={{ color: isRecommended ? C.accent : C.text }}>
                      {formatPrice(tier.price)}
                    </span>
                    <span className="text-xs" style={{ color: C.textDim }}>еднократно</span>
                  </div>
                </div>

                {tier.note && (
                  <p className="text-xs leading-relaxed mb-4" style={{ color: isRecommended ? C.accent : C.textMuted }}>
                    {tier.note}
                  </p>
                )}

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: C.textMuted }}>
                      <i className="ri-check-line text-sm shrink-0 mt-0.5" style={{ color: isRecommended ? C.accent : C.success }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {tier.extra && (
                  <div className="p-3.5 mb-5" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: C.textDim }}>
                      {tier.extra.title}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{tier.extra.body}</p>
                  </div>
                )}

                <Link
                  to={tier.route}
                  onClick={() => handleCheckout(tier)}
                  className="w-full py-3.5 text-sm font-bold text-center transition-all whitespace-nowrap cursor-pointer"
                  style={{ background: isRecommended ? C.accent : 'transparent', border: isRecommended ? 'none' : `1px solid ${C.borderHover}`, color: isRecommended ? '#fff' : C.text }}
                  onMouseEnter={(e) => {
                    if (isRecommended) e.currentTarget.style.background = '#ff5555';
                    else { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }
                  }}
                  onMouseLeave={(e) => {
                    if (isRecommended) e.currentTarget.style.background = C.accent;
                    else { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }
                  }}
                >
                  {isRecommended ? 'Избери пълен достъп' : 'Избери пакет'}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Guarantee note */}
        <div className="mt-6 p-4 flex items-start gap-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: C.greenBg, border: '1px solid #113311' }}>
            <i className="ri-shield-check-line text-base" style={{ color: C.success }} />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
            <strong style={{ color: C.text }}>30-дневна доброволна гаранция за възстановяване на сумата.</strong>{' '}
            Подробностите са в секцията „Гаранция“ по-долу.
          </p>
        </div>

        {/* Standalone programs */}
        <div className="mt-16 md:mt-20">
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ color: C.text }}>
              Предпочиташ само една програма?
            </h3>
            <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: C.textMuted }}>
              Трите програми можеш да вземеш и поотделно.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {STANDALONE_PROGRAMS.map((p) => (
              <Link
                key={p.id}
                to={p.route || '/kurs'}
                className="p-5 flex flex-col items-center text-center transition-all cursor-pointer"
                style={{ background: C.surface, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >
                <div className="text-sm font-semibold mb-1" style={{ color: C.text }}>{p.name}</div>
                <div className="text-xs mb-3" style={{ color: C.textDim }}>{p.description}</div>
                <div className="text-xl font-bold" style={{ color: C.accent }}>{formatPrice(p.price)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}