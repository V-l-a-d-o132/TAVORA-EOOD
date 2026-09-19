import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const PRIVACY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/privacy#webpage',
  url: 'https://imashnujnoto.com/privacy',
  name: 'Политика за поверителност | ТАВОРА ЕООД',
  description:
    'Политика за поверителност на ТАВОРА ЕООД (ЕИК 208438650). Информация за обработката на лични данни съгласно GDPR за клиенти от Велико Търново и България.',
  inLanguage: 'bg',
  dateModified: '2026-05-05',
  isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
};

export default function PrivacyPage() {
  useEffect(() => {
    const id = 'schema-privacy';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(PRIVACY_SCHEMA);
    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#0A2540]/30" />
            <span className="text-xs text-[#1C1C1E]/60">Правна информация</span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Политика за поверителност
          </h1>
          <p className="text-sm text-[#1C1C1E]/65">
            Последна актуализация: 11 април 2026 г. &nbsp;·&nbsp; В сила от: 11 април 2026 г.
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-10 text-[#1C1C1E]/65 leading-relaxed text-sm">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              1. Администратор на лични данни
            </h2>
            <p>
              Администратор на личните ви данни е <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> (ЕИК 208438650), по-нататък „Ние", „нас" или „Администраторът".
              За въпроси, свързани с обработката на лични данни, можете да се свържете с нас на:
            </p>
            <div className="mt-3 p-4 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
              <p className="mb-1"><strong className="text-[#1C1C1E]">Имейл:</strong> tavoraagency@gmail.com</p>
              <p className="mb-1"><strong className="text-[#1C1C1E]">Управител:</strong> Владимир Веселинов Атанасов</p>
              <p><strong className="text-[#1C1C1E]">Адрес:</strong> гр. Велико Търново (5000), ул. \"Велчо Джамджията\", България</p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              2. Какви лични данни събираме
            </h2>
            <p>Събираме следните категории лични данни:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Идентификационни данни: три имена',
                'Данни за контакт: имейл адрес, телефонен номер',
                'Данни за кандидатурата: описание на опит и бизнес контекст',
                'Технически данни: IP адрес, тип браузър, бисквитки (cookies)',
                'Данни за плащане: обработват се от сертифициран платежен доставчик – ние не съхраняваме данни за карти',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A2540]/40 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              3. Цели и правно основание за обработка
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1C1C1E]/10">
                    <th className="text-left py-2 pr-4 text-[#1C1C1E]/65 font-medium">Цел</th>
                    <th className="text-left py-2 pr-4 text-[#1C1C1E]/65 font-medium">Правно основание (GDPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1E]/6">
                  {[
                    ['Обработка на заявка за записване', 'Чл. 6(1)(б) – изпълнение на договор'],
                    ['Изпращане на потвърждения и информация за курса', 'Чл. 6(1)(б) – изпълнение на договор'],
                    ['Маркетингови съобщения (само при съгласие)', 'Чл. 6(1)(а) – съгласие'],
                    ['Подобряване на уебсайта и анализ', 'Чл. 6(1)(е) – легитимен интерес'],
                    ['Спазване на законови задължения', 'Чл. 6(1)(в) – правно задължение'],
                  ].map(([goal, basis]) => (
                    <tr key={goal}>
                      <td className="py-2.5 pr-4 text-[#1C1C1E]/60">{goal}</td>
                      <td className="py-2.5 text-[#1C1C1E]/60">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              4. Срок на съхранение
            </h2>
            <p>
              Съхраняваме личните ви данни само за периода, необходим за постигане на целите, за които са събрани:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Данни от заявки за записване: до 3 години след последния контакт',
                'Данни за сключени договори: 5 години (счетоводно задължение)',
                'Маркетингови данни: до оттегляне на съгласието',
                'Технически данни (логове): до 12 месеца',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]/40 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              5. Вашите права по GDPR
            </h2>
            <p>Съгласно Регламент (ЕС) 2016/679 (GDPR), имате следните права:</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: 'ri-eye-line', title: 'Право на достъп', desc: 'Да получите копие от данните, които обработваме за вас' },
                { icon: 'ri-edit-line', title: 'Право на коригиране', desc: 'Да поискате корекция на неточни данни' },
                { icon: 'ri-delete-bin-line', title: 'Право на изтриване', desc: '„Право да бъдете забравени" при определени условия' },
                { icon: 'ri-pause-circle-line', title: 'Право на ограничаване', desc: 'Да ограничите обработката на вашите данни' },
                { icon: 'ri-download-line', title: 'Право на преносимост', desc: 'Да получите данните си в машинно-четим формат' },
                { icon: 'ri-close-circle-line', title: 'Право на възражение', desc: 'Да се противопоставите на обработка въз основа на легитимен интерес' },
              ].map((right) => (
                <div key={right.title} className="p-4 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className={`${right.icon} text-[#0A2540]/60 text-sm`} />
                    <span className="text-xs font-medium text-[#1C1C1E]">{right.title}</span>
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65">{right.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              За упражняване на правата си изпратете имейл на <strong className="text-[#1C1C1E]">privacy@tavora.bg</strong>.
              Ще отговорим в срок до 30 дни. Имате право и да подадете жалба до{' '}
              <strong className="text-[#1C1C1E]">Комисията за защита на личните данни (КЗЛД)</strong> – www.cpdp.bg.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              6. Предаване на данни на трети страни
            </h2>
            <p>
              Не продаваме и не отдаваме под наем личните ви данни. Можем да споделяме данни с:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Доставчици на платежни услуги (за обработка на плащания)',
                'Доставчици на имейл услуги (за изпращане на потвърждения)',
                'Счетоводни и правни консултанти (при законово задължение)',
                'Компетентни органи (при законово изискване)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A2540]/40 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Всички обработващи данни са обвързани с договори за обработка на данни (DPA) и спазват GDPR.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              7. Бисквитки (Cookies)
            </h2>
            <p>
              Използваме бисквитки съгласно нашата{' '}
              <Link to="/cookies" className="text-[#0A2540] underline underline-offset-2 hover:text-[#1B4332] transition-colors">
                Политика за бисквитки
              </Link>
              . Можете да управлявате предпочитанията си по всяко време.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              8. Промени в политиката
            </h2>
            <p>
              Запазваме правото да актуализираме тази политика. При съществени промени ще ви уведомим
              по имейл или чрез известие на уебсайта. Препоръчваме периодично да преглеждате тази страница.
            </p>
          </section>
        </div>
        {/* Cross-links — prevents orphan page */}
        <div className="mt-16 pt-10 border-t border-[#1C1C1E]/8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">Свързани страници</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Политика за бисквитки', link: '/cookies', desc: 'Управление на бисквитките в сайта' },
              { title: 'Общи условия', link: '/terms', desc: 'Права и задължения при използване на услугите' },
              { title: 'Право на отказ', link: '/withdrawal', desc: '14-дневен срок за отказ от договор' },
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
