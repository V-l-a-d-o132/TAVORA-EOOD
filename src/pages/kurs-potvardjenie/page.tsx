import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Brand System ─── */
const C = {
  bg: "#0a0a0a",
  surface: "#111111",
  border: "#1a1a1a",
  borderHover: "#2a2a2a",
  accent: "#e53e3e",
  accentHover: "#ff5555",
  accentDim: "#331111",
  text: "#ffffff",
  textMuted: "#a0a0a0",
  textDim: "#666666",
  success: "#22c55e",
  successDim: "#0a1f0a",
};

type VerifyState = "loading" | "success" | "error";

export default function KursPotvardjeniePage() {
  const { refreshProfile, user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const [state, setState] = useState<VerifyState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [unlockedModules, setUnlockedModules] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [verifyResponse, setVerifyResponse] = useState<{ tier: string } | null>(
    null,
  );

  useEffect(() => {
    if (loading || !user) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    setState("loading");
    const verify = async (attempt: number) => {
      try {
        if (!sessionId) throw new Error("Липсва идентификатор на сесията.");
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          import.meta.env.VITE_PUBLIC_SUPABASE_URL +
            "/functions/v1/academy-stripe-verify",
          {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + session?.access_token,
            },
            body: JSON.stringify({ session_id: sessionId }),
          },
        );
        if (controller.signal.aborted) return;
        if (res.status === 402 && attempt < 5) {
          timer = setTimeout(() => void verify(attempt + 1), 2500);
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            res.status === 402
              ? "Плащането още се обработва. Проверете отново след малко."
              : "Плащането не може да бъде потвърдено за този профил.",
          );
        }
        if (!data.access_granted) {
          throw new Error(
            "За това плащане няма активен достъп. Свържете се с поддръжката.",
          );
        }
        if (controller.signal.aborted) return;
        setUnlockedModules(data.unlocked_modules || []);
        setVerifyResponse(data);
        setState("success");
        await refreshProfile();
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMsg(
            error instanceof Error ? error.message : "Грешка при свързване.",
          );
          setState("error");
        }
      }
    };
    void verify(0);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [sessionId, user, loading, refreshProfile, retryCount]);

  if (!loading && !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Link
          to={"/login?redirect=" +
            encodeURIComponent("/kurs/potvardjenie?session_id=" + sessionId)}
        >
          Влез в профила, с който плати
        </Link>
      </main>
    );
  }

  // Loading state
  if (state === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg }}
      >
        <div className="text-center px-4">
          <div
            className="w-12 h-12 mx-auto mb-4 border-2 animate-spin"
            style={{
              borderColor: C.border,
              borderTopColor: C.accent,
              borderRadius: "50%",
            }}
          />
          <p className="text-base" style={{ color: C.textMuted }}>
            Потвърждаваме плащането...
          </p>
          <p className="text-xs mt-2" style={{ color: C.textDim }}>
            Това отнема до 15 секунди
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: C.bg }}
      >
        <div className="text-center px-4 max-w-md">
          <div
            className="w-16 h-16 mx-auto flex items-center justify-center mb-5"
            style={{ border: `2px solid ${C.accent}` }}
          >
            <i
              className="ri-error-warning-line"
              style={{ color: C.accent, fontSize: "28px" }}
            />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: C.text }}>
            Нещо се обърка
          </h2>
          <p className="text-sm mb-6" style={{ color: C.textMuted }}>
            {errorMsg || "Опитай да refresh-неш страницата."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setRetryCount((n) => n + 1)}
              className="px-5 py-3 text-sm font-bold transition-colors whitespace-nowrap"
              style={{ background: C.accent, color: "#fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.accent;
              }}
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
  const hasS01 = unlockedModules.some((m) => m.startsWith("s01-"));
  const moduleCount = unlockedModules.length;

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-xl mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
        {/* Success icon */}
        <div
          className="w-20 h-20 mx-auto flex items-center justify-center mb-6"
          style={{ border: `3px solid ${C.success}` }}
        >
          <i
            className="ri-check-double-line"
            style={{ color: C.success, fontSize: "36px" }}
          />
        </div>

        <h1
          className="text-2xl md:text-4xl font-bold mb-3 tracking-tight"
          style={{ color: C.text }}
        >
          Браво! Ти си вътре.
        </h1>
        <p
          className="text-sm md:text-base mb-10 max-w-sm mx-auto leading-relaxed"
          style={{ color: C.textMuted }}
        >
          Плащането е потвърдено. Закупеният пакет е отключен. Вече имаш достъп
          до {moduleCount > 0 ? `${moduleCount} модула` : "обучението"}.
        </p>

        {/* What's unlocked */}
        {unlockedModules.length > 0 && (
          <div
            className="p-5 mb-8 text-left"
            style={{ background: C.successDim, border: `1px solid #113311` }}
          >
            <p
              className="text-xs font-bold uppercase tracking-[0.1em] mb-3"
              style={{ color: C.success }}
            >
              Отключени модули
            </p>
            <div className="space-y-1.5">
              {unlockedModules.slice(0, 6).map((mid) => (
                <div
                  key={mid}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: C.textMuted }}
                >
                  <i
                    className="ri-check-line text-xs"
                    style={{ color: C.success }}
                  />
                  <span>{mid}</span>
                </div>
              ))}
              {unlockedModules.length > 6 && (
                <p className="text-xs mt-2" style={{ color: C.textDim }}>
                  + още {unlockedModules.length - 6} модула
                </p>
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
              style={{ background: C.accent, color: "#fff" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.accentHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.accent;
              }}
            >
              <i
                className="ri-play-circle-line mr-2"
                style={{ fontSize: "14px" }}
              />
              ЗАПОЧНИ ПЪРВИЯ МОДУЛ
            </Link>
          )}

          <Link
            to="/dashboard"
            className="block w-full px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.borderHover;
              e.currentTarget.style.color = C.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.textMuted;
            }}
          >
            <i
              className="ri-dashboard-line mr-2"
              style={{ fontSize: "12px" }}
            />
            Към таблото
          </Link>

          <Link
            to="/kurs"
            className="block w-full px-5 py-3 text-sm transition-colors whitespace-nowrap"
            style={{ color: C.textDim }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.textMuted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.textDim;
            }}
          >
            Към платформата
          </Link>
        </div>

        {/* Next steps */}
        <div
          className="mt-10 p-5 text-left"
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: C.text }}>
            Какво следва
          </h3>
          <div className="space-y-4">
            {[
              {
                num: "1",
                title: "Започни с AI Advantage",
                desc:
                  "Първият модул те учи да работиш с AI като професионалист.",
              },
              {
                num: "2",
                title: "Премини през всеки модул",
                desc: "Всеки модул има интерактивни уроци и тестове.",
              },
              ...(verifyResponse?.tier === "premium-all" ||
                  verifyResponse?.tier === "premium-all-upsell"
                ? [{
                  num: "3",
                  title: "Вземи сертификата",
                  desc:
                    "След като завършиш всички модули — получаваш сертификат.",
                }]
                : [{
                  num: "3",
                  title: "Завърши секцията",
                  desc:
                    "Премини всички модули от избраната секция и получи практическите умения.",
                }]),
            ].map((step) => (
              <div key={step.num} className="flex gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ background: C.accent, color: "#fff" }}
                >
                  {step.num}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: C.text }}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: C.textDim }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs" style={{ color: C.textDim }}>
          Ако имаш въпроси — пиши на{" "}
          <a
            href="mailto:tavoraagency@gmail.com"
            className="underline"
            style={{ color: C.accent }}
          >
            tavoraagency@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
