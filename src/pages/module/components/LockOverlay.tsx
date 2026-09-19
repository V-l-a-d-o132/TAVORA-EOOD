import { Link } from 'react-router-dom';
import { buildCheckoutUrl, formatPrice, getTierById } from '@/config/pricing';

const B = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  accent: '#e53e3e',
  accentHover: '#ff5555',
  accentDim: '#331111',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  successDim: '#0a1f0a',
};

interface LockOverlayProps {
  onReview: () => void;
}

export default function LockOverlay({ onReview }: LockOverlayProps) {
  const tier = getTierById('silkRoad');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto" style={{ background: B.bg }}>
      <div className="max-w-lg w-full py-8">
        {/* Headline */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto flex items-center justify-center mb-5" style={{ border: `2px solid ${B.accent}` }}>
            <i className="ri-lock-unlock-line" style={{ color: B.accent, fontSize: '28px' }} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight" style={{ color: B.text }}>
            Готов си да продължиш.
          </h2>
          <p className="text-base leading-relaxed mb-2" style={{ color: B.textMuted }}>
            Завърши първия модул. Следващите модули разкриват пълната система — от дизайн и SEO до съдържание и привличане на клиенти.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: B.textDim }}>
            Избери програмата „{tier?.name}“, за да продължиш с всички {tier?.moduleCount} модула.
          </p>
        </div>

        {/* What you get */}
        <div className="p-5 mb-5" style={{ background: B.surface, border: `1px solid ${B.border}` }}>
          <p className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: B.textDim }}>Какво получаваш</p>
          <div className="space-y-3">
            {tier?.includes.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: B.textMuted }}>
                <span style={{ color: B.accent, fontWeight: 700 }}>//</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <span className="text-4xl font-bold tracking-tight" style={{ color: B.accent }}>{formatPrice(tier?.price || 0)}</span>
          <p className="text-xs mt-2" style={{ color: B.textDim }}>Еднократно плащане · Доживотен достъп · 30-дневна доброволна гаранция за възстановяване на сумата</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            to={buildCheckoutUrl('silkRoad')}
            className="block w-full px-5 py-3.5 text-sm font-bold text-center whitespace-nowrap transition-colors"
            style={{ background: B.accent, color: '#fff' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = B.accentHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = B.accent; }}
          >
            <i className="ri-lock-unlock-line mr-2" style={{ fontSize: '12px' }} />
            Продължи с „Пътят на коприната“
          </Link>
          <button
            onClick={onReview}
            className="w-full px-5 py-2.5 text-sm transition-colors whitespace-nowrap"
            style={{ background: 'transparent', color: B.textDim, border: `1px solid ${B.border}` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = B.textMuted; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.color = B.textDim; }}
          >
            Прегледай отново урока
          </button>
        </div>

        {/* Guarantee */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs" style={{ color: B.textDim }}>
          <i className="ri-shield-check-line" style={{ color: B.success, fontSize: '12px' }} />
          <span>30-дневна доброволна гаранция за възстановяване на сумата</span>
        </div>
      </div>
    </div>
  );
}