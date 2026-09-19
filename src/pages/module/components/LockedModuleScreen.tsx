import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { C } from '@/pages/module/constants';
import { getProgramTierForModuleId } from '@/pages/module/utils';
import { buildCheckoutUrl, formatPrice, getTierById } from '@/config/pricing';

interface LockedModuleScreenProps {
  moduleTitle: string;
  moduleId: string;
  onUnlock: (tier: string) => void;
  onRefresh: () => void;
}

export default function LockedModuleScreen({ moduleTitle, moduleId, onUnlock, onRefresh }: LockedModuleScreenProps) {
  const { user, hasFullAccess, unlockedModules } = useAuth();
  const isLoggedIn = !!user;

  const programTierId = getProgramTierForModuleId(moduleId);
  const program = getTierById(programTierId);

  // Случай „Стартов пакет + Revenue Blueprint“: потребителят притежава първите 10 модула,
  // но не и последния (s01-m11). Показваме „Надгради“, без да определяме доплащането тук —
  // реалната сума (50 EUR) се изчислява от backend в Промпт 3.
  const starterModules = ['s01-m01', 's01-m02', 's01-m03', 's01-m04', 's01-m05', 's01-m06', 's01-m07', 's01-m08', 's01-m09', 's01-m10'];
  const hasStarterOnly =
    moduleId === 's01-m11' &&
    starterModules.every((m) => unlockedModules?.includes(m)) &&
    !unlockedModules?.includes('s01-m11');
  const isUpgrade = hasStarterOnly;

  const handleGoogleLogin = async () => {
    // Връщаме потребителя към същия урок след вход (без чувствителни данни в URL).
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  return (
    <div className="flex items-center justify-center px-4 py-16" style={{ background: C.bg, minHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-lg w-full stagger-children">
        {/* Refresh access button */}
        <div className="mb-4 text-center">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all whitespace-nowrap"
            style={{ background: C.bg, border: `1px solid ${C.border}`, color: C.textDim }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textMuted; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
          >
            <i className="ri-refresh-line" style={{ fontSize: '12px' }} />
            Освежи достъпа
          </button>
        </div>

        {/* Status badge */}
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2" style={{ border: `1px solid ${C.accent}` }}>
            <i className="ri-lock-line text-xs" style={{ color: C.accent }} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.accent }}>
              {isUpgrade ? 'Надгради достъпа' : 'Заключен модул'}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-6" style={{ border: `2px solid ${C.accent}` }}>
            <i className="ri-lock-line" style={{ color: C.accent, fontSize: '28px' }} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight" style={{ color: C.text }}>
            {isUpgrade ? 'Надгради до пълната програма' : 'Продължи обучението си'}
          </h2>
          <p className="text-base leading-relaxed mb-2" style={{ color: C.textMuted }}>
            {isUpgrade
              ? `Вече имаш Стартовия пакет. За да отвориш ${moduleTitle}, надгради до пълната програма „${program?.name}“.`
              : `Този модул е част от програмата „${program?.name}“. Отключи я, за да продължиш.`}
          </p>
        </div>

        {/* What you get */}
        <div className="p-5 mb-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: C.textDim }}>Какво получаваш</p>
          <div className="space-y-3">
            {program?.includes.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm" style={{ color: C.textMuted }}>
                <span style={{ color: C.accent, fontWeight: 700 }}>//</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <span className="text-4xl font-bold tracking-tight" style={{ color: C.accent }}>{formatPrice(program?.price || 0)}</span>
          <p className="text-xs mt-2" style={{ color: C.textDim }}>Еднократно плащане · Доживотен достъп · 30-дневна доброволна гаранция за възстановяване на сумата</p>
        </div>

        {isLoggedIn ? (
          <>
            {!hasFullAccess && (
              <Link
                to={buildCheckoutUrl(programTierId)}
                className="block w-full px-6 py-4 text-sm font-bold text-center transition-all mb-3"
                style={{ background: C.accent, color: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
              >
                <i className="ri-lock-unlock-line mr-2" style={{ fontSize: '14px' }} />
                {isUpgrade ? 'Надгради до пълната програма' : `Вземи „${program?.name}“`}
              </Link>
            )}
            {!isUpgrade && (
              <Link
                to={buildCheckoutUrl('fullAccess')}
                className="block w-full px-6 py-3 text-sm font-medium text-center transition-colors mb-5"
                style={{ background: 'transparent', border: `1px solid ${C.accent}`, color: C.accent }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.accentDim; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Виж Пълен достъп — всички 46 модула
              </Link>
            )}
          </>
        ) : (
          <div className="space-y-3 mb-5">
            <button
              onClick={handleGoogleLogin}
              className="block w-full px-6 py-4 text-sm font-bold text-center transition-all"
              style={{ background: C.success, color: '#0a0a0a' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#33e06e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.success; }}
            >
              <i className="ri-google-fill mr-2" style={{ fontSize: '14px' }} />
              Влез, за да продължиш
            </button>
            <Link
              to="/login"
              className="block w-full px-6 py-3 text-sm font-medium text-center transition-colors"
              style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textDim }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textMuted; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
            >
              <i className="ri-mail-line mr-2" style={{ fontSize: '14px' }} />
              Влез с имейл
            </Link>
            <Link
              to="/register"
              className="block w-full px-6 py-3 text-sm font-medium text-center transition-colors"
              style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textDim }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textMuted; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
            >
              <i className="ri-user-add-line mr-2" style={{ fontSize: '14px' }} />
              Нямаш профил? Регистрирай се
            </Link>
          </div>
        )}

        <Link
          to="/kurs"
          className="block w-full px-6 py-3 text-sm font-medium text-center transition-colors"
          style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.textDim }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.textMuted; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}
        >
          Обратно към платформата
        </Link>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: C.textDim }}>
          <i className="ri-shield-check-line" style={{ color: C.success, fontSize: '12px' }} />
          <span>30-дневна доброволна гаранция за възстановяване на сумата</span>
        </div>
      </div>
    </div>
  );
}