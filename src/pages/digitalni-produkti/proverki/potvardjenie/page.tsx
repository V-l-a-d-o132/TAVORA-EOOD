import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import ModulePicker from '@/pages/digitalni-produkti/proverki/components/ModulePicker';
import { metaPixel, generateEventId, getBrowserContext } from '@/lib/metaPixel';

const SUPABASE_FUNCTIONS_URL = 'https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1';

type TierKey = 'single' | 'bundle' | 'complete';

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
        pixel_id: '1417762636838758',
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
          num_items: tier === 'single' ? 1 : tier === 'bundle' ? 3 : 10,
        },
      }),
    });
  } catch {
    // CAPI is non-blocking — ignore errors
  }
}

export default function DigitalniProduktiPotvardjeniePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  const [accessCode, setAccessCode] = useState('');
  const [tier, setTier] = useState<TierKey | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [modulesSelected, setModulesSelected] = useState(false);

  useEffect(() => {
    document.title = 'Плащането е успешно — Вашият код за достъп | ТАВОРА';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/digitalni-produkti/proverki/potvardjenie');

    if (!sessionId) {
      setState('error');
      setErrorMsg('Липсва информация за плащането. Моля, опитайте отново от страницата с цените.');
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async (retryCount = 0) => {
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/stripe-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await res.json();
      console.log('[Potvardjenie] stripe-verify response:', data);

      if (!res.ok) {
        // If payment is still processing, auto-retry on the client side too
        if (res.status === 402 && retryCount < 3) {
          console.log(`[Potvardjenie] Payment still processing, retrying (${retryCount + 1}/3)...`);
          setErrorMsg('Плащането се обработва... Опитваме отново след момент.');
          await new Promise((r) => setTimeout(r, 2000));
          return verifyPayment(retryCount + 1);
        }

        setState('error');
        const detail = data.detail ? ` (${data.detail})` : '';
        setErrorMsg((data.error || 'Плащането не е потвърдено. Свържете се с нас.') + detail);
        return;
      }

      setAccessCode(data.access_code);
      setTier(data.tier || 'single');
      setState('success');

      // Meta Pixel — Purchase via TAVORA pixel with product info (browser + CAPI)
      const purchaseValue = data.tier === 'single' ? 12 : data.tier === 'bundle' ? 24 : 78;
      const contentIds: Record<string, string[]> = {
        single: ['checklist-single'],
        bundle: ['checklist-bundle'],
        complete: ['checklist-complete'],
      };
      const contentNames: Record<string, string> = {
        single: '1 System',
        bundle: '3 Systems Bundle',
        complete: 'Complete 10 Systems',
      };
      const t = data.tier || 'single';

      const purchaseEventId = generateEventId();
      const browserCtx = getBrowserContext();

      metaPixel.purchase(purchaseValue, 'EUR', {
        content_name: contentNames[t],
        content_ids: contentIds[t],
        num_items: t === 'single' ? 1 : t === 'bundle' ? 3 : 10,
      }, purchaseEventId);

      // Server-side CAPI backup (works even with ad blockers)
      sendCapiEvent('Purchase', purchaseValue, t, purchaseEventId, data.email, browserCtx);
    } catch {
      setState('error');
      setErrorMsg('Грешка при свързване. Проверете интернета и опитайте отново.');
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleModulesSelected = () => {
    setModulesSelected(true);
    // Auto-redirect to dostap after 1.5s
    setTimeout(() => {
      navigate(`/digitalni-produkti/proverki/dostap?code=${encodeURIComponent(accessCode)}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-20 px-4 md:px-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60 tracking-wider">ПОТВЪРЖДЕНИЕ</span>
          </div>

          {state === 'loading' && (
            <div className="bg-white border border-[#1C1C1E]/8 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540]/5 flex items-center justify-center mx-auto mb-5">
                <i className="ri-loader-4-line animate-spin text-2xl text-[#0A2540]/70" />
              </div>
              <h2
                className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Потвърждаваме плащането...
              </h2>
              <p className="text-sm text-[#1C1C1E]/60">
                Момент, генерираме вашия уникален код за достъп.
              </p>
            </div>
          )}

          {state === 'error' && (
            <div className="bg-white border border-[#1C1C1E]/8 rounded-2xl p-8 md:p-12">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <i className="ri-error-warning-line text-2xl text-red-500" />
              </div>
              <h2
                className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Възникна проблем
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">{errorMsg}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/digitalni-produkti/proverki"
                  className="px-6 py-3 border border-[#1C1C1E]/15 text-[#1C1C1E] text-sm rounded-full hover:bg-[#1C1C1E]/5 transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  ← Обратно към цените
                </Link>
                <a
                  href="mailto:tavoraagency@gmail.com"
                  className="px-6 py-3 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Свържете се с нас
                </a>
              </div>
            </div>
          )}

          {state === 'success' && (
            <div className="bg-white border border-[#1C1C1E]/8 rounded-2xl p-5 md:p-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
                <i className="ri-check-line text-2xl text-emerald-600" />
              </div>
              <h2
                className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {tier === 'complete'
                  ? 'Цялата система е ваша!'
                  : 'Плащането е успешно!'}
              </h2>
              <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6">
                Това е вашият <strong className="text-[#1C1C1E]/85">уникален код за достъп</strong>.
                Запазете го — с него влизате във вашата система. Копирайте го сега.
              </p>

              {/* Access code */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 bg-[#F9F9F7] border border-[#1C1C1E]/10 rounded-xl px-5 py-4">
                  <code className="text-lg md:text-xl font-mono text-[#0A2540] tracking-wider select-all">
                    {accessCode}
                  </code>
                </div>
                <button
                  onClick={copyCode}
                  className="shrink-0 px-5 py-4 border border-[#1C1C1E]/12 text-[#1C1C1E]/70 text-sm rounded-xl hover:bg-[#F9F9F7] hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <i className="ri-check-line text-emerald-600" />
                      Копирано
                    </>
                  ) : (
                    <>
                      <i className="ri-file-copy-line" />
                      Копирай
                    </>
                  )}
                </button>
              </div>

              {/* Module picker for single/bundle */}
              {tier && tier !== 'complete' && !modulesSelected && (
                <ModulePicker
                  tier={tier}
                  accessCode={accessCode}
                  onComplete={handleModulesSelected}
                />
              )}

              {modulesSelected && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-start gap-2">
                  <i className="ri-checkbox-circle-line shrink-0 mt-0.5" />
                  <span>Модулите са запазени! Пренасочваме ви към системата...</span>
                </div>
              )}

              <Link
                to={`/digitalni-produkti/proverki/dostap?code=${encodeURIComponent(accessCode)}`}
                className="w-full px-6 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 mb-4"
              >
                <i className="ri-lock-unlock-line text-base" />
                Виж системата →
              </Link>

              <p className="text-[10px] text-[#1C1C1E]/50 text-center leading-relaxed">
                Кодът е само за вас. Ако имате проблем —{' '}
                <a href="mailto:tavoraagency@gmail.com" className="text-[#0A2540] hover:underline">tavoraagency@gmail.com</a>
              </p>
            </div>
          )}
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}