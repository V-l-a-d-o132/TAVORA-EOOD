import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { metaPixel, academyPixel, generateEventId, getBrowserContext } from '@/lib/metaPixel';

/* ─── Brand System ─── */
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  surfaceHover: '#141414',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  successDim: '#0a1f0a',
};

type CheckoutTier =
  | 'systems-10'
  | 'koprinena-pateka'
  | 'perfektno-video'
  | 'marketing-basics'
  | 'premium-all'
  | 'strategic_access';

interface TierInfo {
  label: string;
  price: string;
  metaValue: number;
  modulesCount: string;
  lessonsCount: string;
  includes: string[];
  savingsNote?: string;
}

const TIER_INFO: Record<CheckoutTier, TierInfo> = {
  'systems-10': {
    label: 'Стартов пакет',
    price: '49 €',
    metaValue: 49,
    modulesCount: '10 модула',
    lessonsCount: '70+ урока',
    includes: [
      'Първите 10 модула от „Пътят на коприната“',
      '70+ интерактивни урока с тестове',
      'Без Revenue Blueprint (11-и модул)',
      'Доживотен достъп',
      '30 дни гаранция за връщане на парите',
    ],
  },
  'koprinena-pateka': {
    label: 'Пътят на коприната',
    price: '99 €',
    metaValue: 99,
    modulesCount: '11 модула',
    lessonsCount: '74+ урока',
    includes: [
      '11 модула — от AI Advantage до Revenue Blueprint',
      '74+ интерактивни урока с тестове',
      'Revenue Blueprint — оферти, ценообразуване, клиенти',
      'Доживотен достъп + бъдещи обновления',
      '30 дни гаранция за връщане на парите',
    ],
  },
  'perfektno-video': {
    label: 'Перфектното Видео',
    price: '99 €',
    metaValue: 99,
    modulesCount: '15 модула',
    lessonsCount: '241+ урока',
    includes: [
      '15 модула — от стратегия до монтаж',
      '241+ интерактивни урока',
      'От идея до готово бизнес видео',
      'Доживотен достъп + бъдещи обновления',
      '30 дни гаранция за връщане на парите',
    ],
  },
  'marketing-basics': {
    label: 'Marketing Basics',
    price: '129 €',
    metaValue: 129,
    modulesCount: '20 модула',
    lessonsCount: '177+ урока',
    includes: [
      '20 модула — от позициониране до продажби',
      '177+ интерактивни урока',
      'Google Business Profile, реклами, SEO, имейл маркетинг',
      'Доживотен достъп + бъдещи обновления',
      '30 дни гаранция за връщане на парите',
    ],
  },
  'premium-all': {
    label: 'Пълен достъп',
    price: '249 €',
    metaValue: 249,
    modulesCount: '46 модула',
    lessonsCount: '492+ урока',
    savingsNote: 'При отделна покупка: 327 €. Спестяваш 78 €.',
    includes: [
      'Всички 46 модула — трите пълни програми',
      '492+ интерактивни урока с тестове',
      'Тестове и практически материали',
      'Сертификат за завършване',
      'Доживотен достъп + бъдещи обновления',
      '30 дни гаранция за връщане на парите',
    ],
  },
  'strategic_access': {
    label: 'Пълен достъп + стратегически сесии',
    price: '497 €',
    metaValue: 497,
    modulesCount: '46 модула',
    lessonsCount: '492+ урока',
    includes: [
      'Всичко от пълния достъп',
      '2 индивидуални онлайн срещи по 60 мин. с Владимир Атанасов',
      '„Системата зад Академия TAVORA“ — практически ресурс',
      'Сертификат за завършване',
      'Доживотен достъп + бъдещи обновления',
    ],
  },
};

const DEFAULT_TIER: CheckoutTier = 'koprinena-pateka';

export default function CheckoutAkademiyaPage() {
  const [searchParams] = useSearchParams();
  const rawTier = searchParams.get('tier') || DEFAULT_TIER;
  const urlTier = (TIER_INFO[rawTier as CheckoutTier] ? rawTier : DEFAULT_TIER) as CheckoutTier;

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const info = TIER_INFO[urlTier];

  // ViewContent on mount + record abandoned checkout
  useEffect(() => {
    metaPixel.viewContent(`Checkout — ${info.label}`, 'Академия TAVORA');
    academyPixel.viewContent(`Checkout — ${info.label}`);

    // Record abandoned checkout for reminder email — only on first visit.
    if (user) {
      supabase
        .from('profiles')
        .select('abandoned_checkout_at')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data: current }) => {
          if (current?.abandoned_checkout_at) {
            return;
          }
          return supabase
            .from('profiles')
            .upsert({
              id: user.id,
              abandoned_checkout_at: new Date().toISOString(),
              abandoned_checkout_tier: urlTier,
              abandoned_cart_email_sent: false,
            }, { onConflict: 'id' });
        })
        .catch(() => { /* ignore */ });
    }
  }, [info.label, user, urlTier]);

  const handleCheckout = useCallback(async () => {
    if (!user) { setError('Трябва да влезеш в профила си, за да продължиш.'); return; }
    setLoading(true);
    setError('');

    const userEmail = user?.email || '';
    const eventId = generateEventId();
    const browserCtx = getBrowserContext();
    const userFullName = (user?.user_metadata?.full_name as string) || '';
    const nameParts = userFullName.trim().split(/\s+/);
    const fn = nameParts[0] || '';
    const ln = nameParts.slice(1).join(' ') || '';

    metaPixel.track('InitiateCheckout', {
      content_name: info.label,
      content_category: 'Академия TAVORA',
      value: info.metaValue,
      currency: 'EUR',
      external_id: userEmail,
    }, eventId);
    academyPixel.initiateCheckout(info.label);
    metaPixel.track('AddPaymentInfo', {
      content_name: info.label,
      content_category: 'Академия TAVORA',
      value: info.metaValue,
      currency: 'EUR',
    });

    // CAPI server-side event
    const capiUrl = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/meta-conversions-api`;
    try {
      fetch(capiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixel_id: '1417762636838758',
          event_name: 'InitiateCheckout',
          event_id: eventId,
          action_source: 'website',
          event_source_url: window.location.href,
          user_data: {
            em: userEmail || undefined,
            fn: fn || undefined,
            ln: ln || undefined,
            client_user_agent: browserCtx.userAgent,
            fbc: browserCtx.fbc || undefined,
            fbp: browserCtx.fbp || undefined,
          },
          custom_data: {
            value: info.metaValue,
            currency: 'EUR',
            content_name: info.label,
            content_category: 'Академия TAVORA',
            content_ids: [urlTier],
            num_items: 1,
          },
        }),
      }).catch(() => {});
    } catch { /* Ignore CAPI errors — don't block checkout */ }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const url = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/academy-stripe-checkout`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier: urlTier }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error || 'Грешка при създаване на плащане.');
      }
    } catch {
      setError('Грешка при свързване с платежната система.');
    } finally {
      setLoading(false);
    }
  }, [user, urlTier, info.label]);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Nav */}
      <nav className="px-4 md:px-8 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/kurs" className="flex items-center gap-2 text-sm transition-colors text-[#a0a0a0] hover:text-white">
            <i className="ri-arrow-left-line" />
            Обратно
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.accent }}>TAVORA</span>
            <span className="text-[10px]" style={{ color: C.textDim }}>Академия</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Headline */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight" style={{ color: C.text }}>
            Последната стъпка преди трансформацията
          </h1>
          <p className="text-sm md:text-base max-w-md mx-auto leading-relaxed" style={{ color: C.textMuted }}>
            След като завършиш плащането, всички модули се отключват автоматично. Без чакане. Без кодове.
          </p>
        </div>

        {/* Order summary */}
        <div className="p-5 md:p-7 mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: C.text }}>{info.label}</h2>
              <p className="text-xs" style={{ color: C.textDim }}>Академия TAVORA</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold tracking-tight" style={{ color: C.accent }}>{info.price}</span>
              <span className="block text-xs mt-1" style={{ color: C.textDim }}>еднократно</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: C.textDim }}>
            <span>{info.modulesCount}</span>
            <span style={{ color: C.borderHover }}>·</span>
            <span>{info.lessonsCount}</span>
          </div>

          {info.savingsNote && (
            <div className="flex items-center gap-2 mb-4 p-2.5" style={{ background: C.successDim, border: `1px solid #113311` }}>
              <i className="ri-arrow-up-circle-fill text-base" style={{ color: C.success }} />
              <span className="text-xs" style={{ color: C.success }}>{info.savingsNote}</span>
            </div>
          )}

          <div style={{ height: '1px', background: C.border, marginBottom: '16px' }} />

          <div className="space-y-2.5">
            {info.includes.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm" style={{ color: C.textMuted }}>
                <span style={{ color: C.success, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || !user}
            className="w-full mt-5 flex items-center justify-center gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer bg-[#e53e3e] hover:bg-[#ff5555] disabled:hover:bg-[#e53e3e] text-white whitespace-nowrap"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Пренасочване...
              </>
            ) : (
              <>
                <i className="ri-lock-unlock-line" style={{ fontSize: '16px' }} />
                ПЛАТИ {info.price}
              </>
            )}
          </button>
        </div>

        {/* Social proof */}
        <div className="p-4 mb-5 flex items-center gap-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="w-10 h-10 flex items-center justify-center shrink-0 text-sm" style={{ background: C.border, color: C.text }}>
            <i className="ri-group-line" />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: C.text }}>247+ колеги вече преминаха обучението</p>
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <i key={s} className="ri-star-fill" style={{ color: C.accent, fontSize: '10px' }} />
              ))}
              <span className="text-xs ml-1" style={{ color: C.textDim }}>4.9 / 5.0</span>
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.textDim }}>
            <i className="ri-shield-check-line" style={{ color: C.success, fontSize: '11px' }} />
            SSL криптирано
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.textDim }}>
            <i className="ri-visa-line" style={{ color: C.textDim, fontSize: '11px' }} />
            Visa
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.textDim }}>
            <i className="ri-mastercard-line" style={{ color: C.textDim, fontSize: '11px' }} />
            Mastercard
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.textDim }}>
            <i className="ri-secure-payment-line" style={{ color: C.textDim, fontSize: '11px' }} />
            Stripe
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: C.textDim }}>
            <i className="ri-refund-2-line" style={{ color: C.success, fontSize: '11px' }} />
            30 дни гаранция
          </div>
        </div>

        {!user && (
          <p className="text-center mt-3 text-xs" style={{ color: C.textDim }}>
            <Link to="/login?redirect=/kurs/checkout" className="underline" style={{ color: C.accent }}>Влез в профила си</Link>, за да продължиш
          </p>
        )}

        {error && (
          <div className="mt-4 p-3 text-center text-sm" style={{ background: '#1a0505', border: `1px solid ${C.accent}`, color: C.accent }}>
            {error}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-10 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.1em] mb-4" style={{ color: C.textDim }}>Чести въпроси</h3>
          {[
            { q: 'Как ще получа достъп?', a: 'Веднага след плащането. Модулите се отключват автоматично — без кодове, без чакане.' },
            { q: 'Мога ли да върна парите?', a: 'Да. 30 дни гаранция. Пишеш ни и връщаме пълната сума. Без въпроси.' },
            { q: 'Колко време имам достъп?', a: 'Доживотен. Включително всички бъдещи обновления на модулите.' },
            { q: 'Трябва ли ми нещо допълнително?', a: 'Само интернет и желание да учиш. Всичко е в платформата.' },
          ].map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer text-sm" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}>
                {faq.q}
                <i className="ri-arrow-down-s-line transition-transform group-open:rotate-180" />
              </summary>
              <div className="p-4 text-xs leading-relaxed" style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: 'none', color: C.textDim }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center mt-10 text-xs" style={{ color: C.textDim }}>
          Tavora Digital · Велико Търново · България
        </p>
      </div>
    </div>
  );
}