import { Link } from 'react-router-dom';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
  success: '#22c55e',
  greenBg: '#0a1f0a',
};

export default function AkademiyaGuaranteeSection() {
  return (
    <section id="akademiya-guarantee" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-4xl mx-auto">
        <div className="p-6 md:p-10" style={{ background: C.greenBg, border: `1px solid #113311` }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ background: C.bg, border: '1px solid #113311' }}>
              <i className="ri-shield-check-line text-xl" style={{ color: C.success }} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: C.text }}>
                30-дневна доброволна гаранция за възстановяване на сумата.
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: C.textMuted }}>
                Ако в рамките на 30 дни решиш, че Академията не е за теб, пиши ни и ще възстановим сумата.
                Целта е да започнеш спокойно — не да те „затворим“ в покупка.
              </p>
              <p className="text-xs leading-relaxed mb-4" style={{ color: C.textDim }}>
                Тази доброволна гаранция е отделна от законовото 14-дневно право на отказ,
                което остава на разположение за всеки клиент.
              </p>
              <Link
                to="/terms"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: C.success }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#33e06e'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.success; }}
              >
                Виж условията <i className="ri-arrow-right-line text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}