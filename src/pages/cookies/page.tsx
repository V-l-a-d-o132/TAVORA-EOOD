import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const COOKIES_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/cookies#webpage',
  url: 'https://imashnujnoto.com/cookies',
  name: 'Политика за бисквитки | ТАВОРА ЕООД',
  description:
    'Политика за бисквитки (cookies) на ТАВОРА ЕООД (ЕИК 208438650). Информация за видовете бисквитки и как да ги управлявате. Услуги за дигитален маркетинг във Велико Търново.',
  inLanguage: 'bg',
  dateModified: '2026-05-05',
  isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
};

export default function CookiesPage() {
  useEffect(() => {
    const id = 'schema-cookies';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(COOKIES_SCHEMA);
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30" />
            <span className="text-xs text-[#1C1C1E]/60">Правна информация</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Политика за бисквитки
          </h1>
          <p className="text-sm text-[#1C1C1E]/65">Последна актуализация: 11 април 2026 г.</p>
        </div>

        <div className="space-y-10 text-[#1C1C1E]/65 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              1. Какво са бисквитките?
            </h2>
            <p>
              Бисквитките (cookies) са малки текстови файлове, съхранявани на вашето устройство при посещение
              на уебсайт. Те позволяват на сайта да запомни вашите предпочитания и да подобри потребителското изживяване.
              Използването им е регламентирано от Директива 2009/136/ЕО и GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              2. Видове бисквитки, които използваме
            </h2>
            <div className="space-y-4">
              {[
                {
                  type: 'Задължителни бисквитки',
                  basis: 'Не изискват съгласие',
                  color: '#1B4332',
                  desc: 'Необходими за функционирането на сайта. Без тях сайтът не може да работи правилно. Включват: сесийни бисквитки, бисквитки за сигурност.',
                  examples: ['session_id', 'csrf_token', 'cookie_consent'],
                },
                {
                  type: 'Функционални бисквитки',
                  basis: 'Изискват съгласие',
                  color: '#0A2540',
                  desc: 'Запомнят вашите предпочитания (език, настройки) за по-добро изживяване.',
                  examples: ['lang_preference', 'ui_settings'],
                },
                {
                  type: 'Аналитични бисквитки',
                  basis: 'Изискват съгласие',
                  color: '#0A2540',
                  desc: 'Помагат ни да разберем как посетителите използват сайта, за да го подобрим. Данните са анонимизирани.',
                  examples: ['_ga (Google Analytics)', '_gid', '_gat'],
                },
                {
                  type: 'Маркетингови бисквитки',
                  basis: 'Изискват съгласие',
                  color: '#0A2540',
                  desc: 'Използват се за показване на релевантни реклами. Понастоящем не използваме маркетингови бисквитки.',
                  examples: ['Не се използват в момента'],
                },
              ].map((cat) => (
                <div key={cat.type} className="p-5 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1C1C1E]">{cat.type}</span>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.basis}
                    </span>
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 mb-2">{cat.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.examples.map((ex) => (
                      <span key={ex} className="text-[10px] px-2 py-0.5 bg-white border border-[#1C1C1E]/10 rounded text-[#1C1C1E]/65">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              3. Управление на бисквитките
            </h2>
            <p>
              Можете да управлявате или изтриете бисквитките по всяко време чрез настройките на вашия браузър.
              Имайте предвид, че деактивирането на задължителните бисквитки може да наруши функционалността на сайта.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { browser: 'Google Chrome', url: 'support.google.com/chrome/answer/95647' },
                { browser: 'Mozilla Firefox', url: 'support.mozilla.org/kb/cookies' },
                { browser: 'Safari', url: 'support.apple.com/guide/safari' },
                { browser: 'Microsoft Edge', url: 'support.microsoft.com/microsoft-edge' },
              ].map((b) => (
                <div key={b.browser} className="flex items-center gap-3 p-3 bg-[#F9F9F9] rounded-lg border border-[#1C1C1E]/6">
                  <i className="ri-global-line text-[#0A2540]/65" />
                  <div>
                    <div className="text-xs font-medium text-[#1C1C1E]">{b.browser}</div>
                    <div className="text-[10px] text-[#1C1C1E]/65">{b.url}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              4. Срок на съхранение
            </h2>
            <p>
              Сесийните бисквитки се изтриват при затваряне на браузъра. Постоянните бисквитки
              се съхраняват до 24 месеца или до ръчното им изтриване.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              5. Контакт
            </h2>
            <p>
              За въпроси относно бисквитките: <strong className="text-[#1C1C1E]">tavoraagency@gmail.com</strong>
              <br />
              <span className="text-[#1C1C1E]/65">ТАВОРА ЕООД · ЕИК 208438650 · гр. Велико Търново</span>
            </p>
          </section>
        </div>
        {/* Cross-links — helps Google understand this is not an orphan page */}
        <div className="mt-16 pt-10 border-t border-[#1C1C1E]/8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Други страници</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Политика за поверителност', link: '/privacy', desc: 'GDPR и защита на данните' },
              { title: 'Общи условия', link: '/terms', desc: 'Права и задължения на клиентите' },
              { title: 'Право на отказ', link: '/withdrawal', desc: '14-дневен срок по ЗЗП' },
            ].map((p) => (
              <Link
                key={p.title}
                to={p.link}
                className="group p-4 bg-white rounded-xl border border-[#1C1C1E]/8 hover:border-[#0A2540]/20 transition-all duration-200"
              >
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-1 group-hover:text-[#0A2540] transition-colors">{p.title}</h3>
                <p className="text-xs text-[#1C1C1E]/65">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}
