import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { academyPixel, generateEventId, getBrowserContext } from '@/lib/metaPixel';

/* ─── Brand System ─── */
const C = {
  bg: '#0a0a0a',
  surface: '#111111',
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

type VerifyState = 'loading' | 'success' | 'error';

/** Send server-side CAPI event to our own edge function */
async function sendCapiEvent(
  eventName: string,
  value: number,
  tier: string,
  eventId: string,
  email?: string,
  browserCtx?: { userAgent: string; fbc: string; fbp: string }
) {
  try {
    const url = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/meta-conversions-api`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pixel_id: '1742675203594120',
        event_name: eventName,
        event_id: eventId,
        action_source: 'website',
        event_source_url: window.location.href,
        user_data: {
          ...(email ? { em: email } : {}),
          ...(browserCtx?.userAgent ? { client_user_agent: browserCtx.userAgent } : {}),
          ...(browserCtx?.fbc ? { fbc: browserCtx.fbc } : {}),
          ...(browserCtx?.fbp ? { fbp: browserCtx.fbp } : {}),
        },
        custom_data: {
          value,
          currency: 'EUR',
          content_ids: [tier],
          content_type: 'product',
          num_items: 1,
        },
      }),
    });
  } catch {
    // CAPI is non-blocking — ignore errors
  }
}

export default function KursPotvardjeniePage() {
  const { refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [state, setState] = useState<VerifyState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [unlockedModules, setUnlockedModules] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [verifyResponse, setVerifyResponse] = useState<any>(null);

  const verifyPayment = useCallback(async () => {
    if (!sessionId) {
      setState('error');
      setErrorMsg('Липсва идентификатор на сесията.');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const userId = session?.user?.id;

      const url = `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/academy-stripe-verify`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const json = await res.json();

      // Handle payment still processing
      if (res.status === 402) {
        setTimeout(() => verifyPayment(), 3000);
        return;
      }

      // Handle HTTP errors
      if (!res.ok) {
        setState('error');
        setErrorMsg(json.error || json.detail || 'Грешка при верификация.');
        return;
      }

      setVerifyResponse(json);

      // Check if modules were ACTUALLY unlocked
      if (json.access_granted === false) {
        console.warn('[kurs-potvardjenie] access_granted=false, method:', json.method);
        // If this is the first or second attempt, retry the whole verify
        if (retryCount < 2) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => verifyPayment(), 2000);
          return;
        }
        // After 3 attempts, show error with details
        setState('error');
        setErrorMsg('Модулите не можаха да бъдат отключени автоматично. Моля, свържи се с поддръжката или опитай отново.');
        return;
      }

      // Success — modules were unlocked
      setState('success');

      // Refresh auth context so other pages see the unlocked state immediately
      try { await refreshProfile(); } catch { /* ignore */ }

      // Fire Academy Meta Pixel Purchase (browser + CAPI server-side)
      const tier = json.tier || 'premium';
      const PURCHASE_VALUES: Record<string, number> = {
        'systems-10': 49,
        'koprinena-pateka': 99,
        'premium': 99,
        'perfektno-video': 99,
        'marketing-basics': 129,
        'premium-all': 249,
        'strategic_access': 497,
      };
      const purchaseValue = PURCHASE_VALUES[tier] || 99;
      const PURCHASE_NAMES: Record<string, string> = {
        'systems-10': 'Пътят на коприната — 10 модула (Стартов пакет)',
        'koprinena-pateka': 'Пътят на коприната — 11 модула',
        'premium': 'Пътят на коприната — 11 модула',
        'perfektno-video': 'Перфектното Видео — 15 модула',
        'marketing-basics': 'Marketing Basics — 20 модула',
        'premium-all': 'Пълен достъп — всички секции',
        'strategic_access': 'Пълен достъп + стратегически сесии',
      };
      const purchaseName = PURCHASE_NAMES[tier] || 'Академия TAVORA';

      // Browser pixel (academy only) — with shared event_id for CAPI dedup
      const purchaseEventId = generateEventId();
      const browserCtx = getBrowserContext();

      academyPixel.purchase(purchaseValue, 'EUR', {
        content_name: purchaseName,
        content_category: 'Академия TAVORA',
        content_ids: [tier],
        num_items: 1,
      }, purchaseEventId);

      // Server-side CAPI backup (works even with ad blockers)
      sendCapiEvent('Purchase', purchaseValue, tier, purchaseEventId, json.email, browserCtx);

      // Poll for unlock status with retries (verification that DB was updated)
      if (userId) {
        const pollUnlockStatus = async (retries: number = 6) => {
          for (let i = 0; i < retries; i++) {
            await new Promise((r) => setTimeout(r, 2000));
            try {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('unlocked_modules, has_full_access')
                .eq('id', userId)
                .maybeSingle();
              if (profileData) {
                const mods = profileData.unlocked_modules || [];
                if (mods.length > 0) {
                  setUnlockedModules(mods);
                  return;
                }
              }
              console.log(`[kurs-potvardjenie] Poll ${i + 1}/${retries}: still empty`);
            } catch { /* ignore poll errors */ }
          }
          // Final attempt
          try {
            const { data: finalData } = await supabase
              .from('profiles')
              .select('unlocked_modules, has_full_access')
              .eq('id', userId)
              .maybeSingle();
            if (finalData) {
              setUnlockedModules(finalData.unlocked_modules || []);
            }
          } catch { /* ignore */ }
        };

        pollUnlockStatus();
      }
    } catch {
      setState('error');
      setErrorMsg('Грешка при свързване. Опитай пак.');
    }
  }, [sessionId, retryCount, refreshProfile]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="text-center px-4">
          <div className="w-12 h-12 mx-auto mb-4 border-2 animate-spin" style={{ borderColor: C.border, borderTopColor: C.accent, borderRadius: '50%' }} />
          <p className="text-base" style={{ color: C.textMuted }}>Потвърждаваме плащането...</p>
          <p className="text-xs mt-2" style={{ color: C.textDim }}>Това отнема до 15 секунди</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="text-center px-4 max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-5" style={{ border: `2px solid ${C.accent}` }}>
            <i className="ri-error-warning-line" style={{ color: C.accent, fontSize: '28px' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: C.text }}>Нещо се обърка</h2>
          <p className="text-sm mb-6" style={{ color: C.textMuted }}>{errorMsg || 'Опитай да refresh-неш страницата.'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setRetryCount(0); setState('loading'); setTimeout(() => verifyPayment(), 100); }}
              className="px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap"
              style={{ background: C.accent, color: '#fff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
            >
              Опитай пак
            </button>
            <Link
              to="/kurs"
              className="px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap"
              style={{ border: `1px solid ${C.border}`, color: C.textMuted }}
            >
              Към платформата
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  const hasS01 = unlockedModules.some((m) => m.startsWith('s01-'));
  const moduleCount = unlockedModules.length;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto flex items-center justify-center mb-6" style={{ border: `3px solid ${C.success}` }}>
          <i className="ri-check-double-line" style={{ color: C.success, fontSize: '36px' }} />
        </div>

        <h1 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight" style={{ color: C.text }}>
          Браво! Ти си вътре.
        </h1>
        <p className="text-sm md:text-base mb-10 max-w-sm mx-auto leading-relaxed" style={{ color: C.textMuted }}>
          Плащането е потвърдено. Всички модули са отключени. Вече имаш достъп до {moduleCount > 0 ? `${moduleCount} модула` : 'обучението'}.
        </p>

        {/* What's unlocked */}
        {unlockedModules.length > 0 && (
          <div className="p-5 mb-8 text-left" style={{ background: C.successDim, border: `1px solid #113311` }}>
            <p className="text-xs font-bold uppercase tracking-[0.1em] mb-3" style={{ color: C.success }}>Отключени модули</p>
            <div className="space-y-1.5">
              {unlockedModules.slice(0, 6).map((mid) => (
                <div key={mid} className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
                  <i className="ri-check-line text-xs" style={{ color: C.success }} />
                  <span>{mid}</span>
                </div>
              ))}
              {unlockedModules.length > 6 && (
                <p className="text-xs mt-2" style={{ color: C.textDim }}>+ още {unlockedModules.length - 6} модула</p>
              )}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-3">
          {hasS01 && (
            <Link
              to="/module/s01-m01"
              className="block w-full px-5 py-4 text-sm font-bold transition-all whitespace-nowrap"
              style={{ background: C.accent, color: '#fff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
            >
              <i className="ri-play-circle-line mr-2" style={{ fontSize: '14px' }} />
              ЗАПОЧНИ ПЪРВИЯ МОДУЛ
            </Link>
          )}

          <Link
            to="/dashboard"
            className="block w-full px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
          >
            <i className="ri-dashboard-line mr-2" style={{ fontSize: '12px' }} />
            Към таблото
          </Link>

          <Link
            to="/kurs"
            className="block w-full px-5 py-3 text-sm transition-colors whitespace-nowrap"
            style={{ color: C.textDim }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.textMuted; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textDim; }}
          >
            Към платформата
          </Link>
        </div>

        {/* Next steps */}
        <div className="mt-10 p-5 text-left" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: C.text }}>Какво следва</h3>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Започни с AI Advantage', desc: 'Първият модул те учи да работиш с AI като професионалист.' },
              { num: '2', title: 'Премини през всеки модул', desc: 'Всеки модул има интерактивни уроци и тестове.' },
              ...(verifyResponse?.tier === 'premium-all' || verifyResponse?.tier === 'premium-all-upsell'
                ? [{ num: '3', title: 'Вземи сертификата', desc: 'След като завършиш всички модули — получаваш сертификат.' }]
                : [{ num: '3', title: 'Завърши секцията', desc: 'Премини всички модули от избраната секция и получи практическите умения.' }]
              ),
            ].map((step) => (
              <div key={step.num} className="flex gap-3">
                <div className="w-7 h-7 flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: C.accent, color: '#fff' }}>
                  {step.num}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>{step.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: C.textDim }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs" style={{ color: C.textDim }}>
          Ако имаш въпроси — пиши на{' '}
          <a href="mailto:tavoraagency@gmail.com" className="underline" style={{ color: C.accent }}>
            tavoraagency@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}