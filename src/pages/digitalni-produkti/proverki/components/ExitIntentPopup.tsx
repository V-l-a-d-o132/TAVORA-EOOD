import { useState, useEffect, useCallback, useRef } from 'react';
import { metaPixel } from '@/lib/metaPixel';

const SUPABASE_FUNCTIONS_URL = 'https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1';

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(15);
  const shownRef = useRef(false);
  const maxScrollRef = useRef(0);
  const lastYRef = useRef(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showPopup = useCallback(() => {
    if (shownRef.current) return;
    shownRef.current = true;
    setVisible(true);
    setCountdown(15);
    metaPixel.trackCustom('ExitIntentShown');
  }, []);

  const closePopup = useCallback(() => {
    setVisible(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    metaPixel.trackCustom('ExitIntentClosed');
  }, []);

  // Countdown timer
  useEffect(() => {
    if (visible && countdown > 0) {
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [visible, countdown]);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && e.relatedTarget === null) {
        showPopup();
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxH = document.documentElement.scrollHeight - window.innerHeight;
      if (maxH <= 0) return;

      const pct = scrollY / maxH;
      maxScrollRef.current = Math.max(maxScrollRef.current, pct);

      if (maxScrollRef.current > 0.4 && pct < 0.25 && lastYRef.current > scrollY) {
        showPopup();
      }
      lastYRef.current = scrollY;
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const maxH = document.documentElement.scrollHeight - window.innerHeight;
        if (maxH > 0 && maxScrollRef.current > 0.3) {
          showPopup();
        }
      }
    };

    const handleBeforeUnload = () => {
      sessionStorage.setItem('exit_intent_fired', '1');
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showPopup]);

  const handleBuy = async () => {
    setLoading(true);
    setError('');
    try {
      metaPixel.initiateCheckout('3 Systems Bundle — Exit Intent Offer', 24);
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/stripe-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: 'bundle' }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Грешка. Опитайте отново.');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Грешка при свързване. Проверете интернета.');
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={closePopup}
      />

      {/* Popup card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 md:p-8 shadow-2xl animate-[fadeIn_0.3s_ease] overflow-hidden">
        {/* Close X */}
        <button
          onClick={closePopup}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1C1C1E]/5 transition-colors cursor-pointer z-10"
          aria-label="Затвори"
        >
          <i className="ri-close-line text-[#1C1C1E]/50" />
        </button>

        {/* Countdown bar at top */}
        {countdown > 0 ? (
          <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-5 bg-red-500 py-2.5 px-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <i className="ri-timer-flash-line text-white text-sm" />
              <span className="text-white text-xs font-semibold">
                Офертата изтича след{' '}
                <span className="tabular-nums text-sm font-bold">{countdown} сек</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-5 bg-[#1C1C1E] py-2.5 px-6 text-center">
            <p className="text-white/60 text-[10px]">Офертата приключи</p>
          </div>
        )}

        <h3 className="text-lg md:text-xl font-bold text-[#1C1C1E] leading-tight mb-2">
          Изчакай — не си тръгвай без системата.
        </h3>
        <p className="text-sm text-[#1C1C1E]/55 leading-relaxed mb-4">
          80% от клиентите ни виждат резултат в първия месец.{' '}
          <strong className="text-[#1C1C1E]/80">И ти можеш.</strong>{' '}
          Конкуренцията не чака.
        </p>

        {/* Mini benefits */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { icon: 'ri-file-list-3-line', text: '300 стъпки' },
            { icon: 'ri-shield-check-line', text: '7 дни гаранция' },
            { icon: 'ri-flashlight-line', text: 'Достъп веднага' },
          ].map((b) => (
            <div key={b.text} className="text-center p-2 rounded-xl bg-[#FAFAF8] border border-[#1C1C1E]/5">
              <i className={`${b.icon} text-amber-500 text-sm mb-1 block`} />
              <span className="text-[10px] text-[#1C1C1E]/55 font-medium">{b.text}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full py-3.5 rounded-full text-sm font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 mb-3 shadow-lg shadow-amber-500/20"
        >
          {loading ? (
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

        <button
          onClick={closePopup}
          className="w-full py-2.5 rounded-full text-xs font-medium text-[#1C1C1E]/35 hover:text-[#1C1C1E]/55 hover:bg-[#1C1C1E]/3 transition-all cursor-pointer whitespace-nowrap"
        >
          Не, благодаря — ще го направя сам
        </button>

        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[#1C1C1E]/6">
          <div className="flex items-center gap-1">
            <i className="ri-shield-check-line text-emerald-500 text-xs" />
            <span className="text-[10px] text-[#1C1C1E]/35">7 дни гаранция</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="ri-lock-line text-[#1C1C1E]/25 text-xs" />
            <span className="text-[10px] text-[#1C1C1E]/35">Stripe Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}