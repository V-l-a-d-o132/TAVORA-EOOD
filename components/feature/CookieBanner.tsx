import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InlineIcon from '@/components/base/InlineIcon';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({ functional: true, analytics: false, marketing: false });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ functional: true, analytics: true, marketing: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ ...prefs, date: new Date().toISOString() }));
    setVisible(false);
  };

  const rejectAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({ functional: false, analytics: false, marketing: false, date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-2xl mx-auto bg-white border border-[#1C1C1E]/10 rounded-2xl overflow-hidden">
        {/* Main banner */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0A2540]/8 shrink-0">
              <i className="ri-shield-check-line text-[#0A2540] text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#1C1C1E] mb-1">Използваме бисквитки</h3>
              <p className="text-xs text-[#1C1C1E]/70 leading-relaxed">
                Използваме задължителни бисквитки за функционирането на сайта и, с вашето съгласие,
                аналитични бисквитки за подобряване на изживяването. Вижте нашата{' '}
                <Link to="/cookies" className="text-[#0A2540] underline underline-offset-1 hover:text-[#1B4332] transition-colors">
                  Политика за бисквитки
                </Link>.
              </p>
            </div>
          </div>

          {/* Detailed preferences */}
          {showDetails && (
            <div className="mb-5 space-y-3 border-t border-[#1C1C1E]/6 pt-4">
              {[
                { key: 'functional' as const, label: 'Задължителни', desc: 'Необходими за работата на сайта', locked: true },
                { key: 'analytics' as const, label: 'Аналитични', desc: 'Помагат ни да подобрим сайта', locked: false },
                { key: 'marketing' as const, label: 'Маркетингови', desc: 'Персонализирани реклами', locked: false },
              ].map((cat) => (
                <div key={cat.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-[#1C1C1E]">{cat.label}</div>
                    <div className="text-[10px] text-[#1C1C1E]/60">{cat.desc}</div>
                  </div>
                  <button
                    onClick={() => !cat.locked && setPrefs(p => ({ ...p, [cat.key]: !p[cat.key] }))}
                    className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer ${
                      (cat.locked || prefs[cat.key]) ? 'bg-[#0A2540]' : 'bg-[#1C1C1E]/15'
                    } ${cat.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                        (cat.locked || prefs[cat.key]) ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={acceptAll}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0A2540] text-white text-xs rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap"
            >
              Приемам всички
            </button>
            {showDetails ? (
              <button
                onClick={acceptSelected}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#1C1C1E]/15 text-[#1C1C1E]/60 text-xs rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap"
              >
                Запази избора
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="w-full sm:w-auto px-5 py-2.5 border border-[#1C1C1E]/15 text-[#1C1C1E]/60 text-xs rounded-full hover:border-[#0A2540]/30 hover:text-[#0A2540] transition-all cursor-pointer whitespace-nowrap"
              >
                Управление
              </button>
            )}
            <button
              onClick={rejectAll}
              className="w-full sm:w-auto px-5 py-2.5 text-[#1C1C1E]/60 text-xs hover:text-[#1C1C1E]/80 transition-all cursor-pointer whitespace-nowrap"
            >
              Само задължителни
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
