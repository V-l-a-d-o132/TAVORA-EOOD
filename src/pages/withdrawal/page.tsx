import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const WITHDRAWAL_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/withdrawal#webpage',
  url: 'https://imashnujnoto.com/withdrawal',
  name: 'Право на отказ от онлайн услуги | ТАВОРА ЕООД',
  description:
    'Информация за правото на отказ от договор съгласно Директива 2011/83/ЕС и Закона за защита на потребителите. ТАВОРА ЕООД (ЕИК 208438650) — дигитален маркетинг Велико Търново.',
  inLanguage: 'bg',
  dateModified: '2026-05-05',
  isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
};

export default function WithdrawalPage() {
  useEffect(() => {
    const id = 'schema-withdrawal';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(WITHDRAWAL_SCHEMA);
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
            <span className="text-xs text-[#1C1C1E]/60">Права на потребителя · ЕС</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Право на отказ
          </h1>
          <p className="text-sm text-[#1C1C1E]/65">
            Съгласно Директива 2011/83/ЕС и Закона за защита на потребителите (ЗЗП)
          </p>
        </div>

        {/* Highlighted box */}
        <div className="p-6 bg-[#0A2540]/4 border border-[#0A2540]/15 rounded-2xl mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A2540]/10 shrink-0">
              <i className="ri-information-line text-[#0A2540]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#1C1C1E] mb-2">Стандартна информация за правото на отказ</h3>
              <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
                Имате право да се откажете от настоящия договор в срок от{' '}
                <strong className="text-[#1C1C1E]">14 дни</strong> без да посочвате причина.
                Срокът за отказ изтича след 14 дни от датата на сключване на договора.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 text-[#1C1C1E]/65 leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              1. Как да упражните правото си на отказ
            </h2>
            <p>
              За да упражните правото на отказ, трябва да ни уведомите за решението си чрез ясно
              изявление (например писмо, изпратено по пощата или по имейл):
            </p>
            <div className="mt-4 p-5 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
              <p className="font-medium text-[#1C1C1E] mb-2">Данни за контакт:</p>
              <p className="mb-1"><strong>ТАВОРА ЕООД</strong> · ЕИК 208438650</p>
              <p className="mb-1">Управител: Владимир Веселинов Атанасов</p>
              <p className="mb-1">Имейл: <strong className="text-[#0A2540]">tavoraagency@gmail.com</strong></p>
              <p>Адрес: гр. Велико Търново (5000), ул. \"Велчо Джамджията\", България</p>
            </div>
            <p className="mt-4">
              Можете да използвате стандартния формуляр за отказ по-долу, но това не е задължително.
              За да спазите срока за отказ, е достатъчно да изпратите съобщението си преди изтичането му.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              2. Последици от отказа
            </h2>
            <p>
              Ако се откажете от договора, ще ви възстановим всички плащания, получени от вас,
              без неоправдано забавяне и не по-късно от{' '}
              <strong className="text-[#1C1C1E]">14 дни</strong> от датата, на която сме информирани
              за решението ви. Възстановяването се извършва по същия начин на плащане.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              3. Изключения от правото на отказ
            </h2>
            <div className="p-4 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
              <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
                Правото на отказ <strong className="text-[#1C1C1E]">не се прилага</strong> за договори за
                доставка на цифрово съдържание, което не се доставя на материален носител, ако изпълнението
                е започнало с изричното предварително съгласие на потребителя и потвърждение, че губи
                правото си на отказ (чл. 57, ал. 1, т. 13 от ЗЗП и чл. 16(м) от Директива 2011/83/ЕС).
              </p>
            </div>
          </section>

          {/* Standard withdrawal form */}
          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              4. Стандартен формуляр за отказ
            </h2>
            <p className="mb-4 text-xs text-[#1C1C1E]/65 italic">
              (Попълнете и изпратете настоящия формуляр само ако желаете да се откажете от договора)
            </p>
            <div className="p-6 border border-[#1C1C1E]/10 rounded-xl bg-[#F9F9F9] space-y-4 text-sm text-[#1C1C1E]/60">
              <p>До: <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> – tavoraagency@gmail.com</p>
              <p>
                С настоящото уведомявам/уведомяваме*, че се отказвам/отказваме* от сключения от мен/нас*
                договор за покупка на следната услуга:
              </p>
              <div className="border-b border-[#1C1C1E]/10 pb-2">
                <p className="text-xs text-[#1C1C1E]/65">Наименование на услугата: ___________________________</p>
              </div>
              <div className="border-b border-[#1C1C1E]/10 pb-2">
                <p className="text-xs text-[#1C1C1E]/65">Поръчано на: ___________________________</p>
              </div>
              <div className="border-b border-[#1C1C1E]/10 pb-2">
                <p className="text-xs text-[#1C1C1E]/65">Три имена на потребителя: ___________________________</p>
              </div>
              <div className="border-b border-[#1C1C1E]/10 pb-2">
                <p className="text-xs text-[#1C1C1E]/65">Адрес на потребителя: ___________________________</p>
              </div>
              <div className="border-b border-[#1C1C1E]/10 pb-2">
                <p className="text-xs text-[#1C1C1E]/65">Имейл адрес: ___________________________</p>
              </div>
              <div className="border-b border-[#1C1C1E]/10 pb-2">
                <p className="text-xs text-[#1C1C1E]/65">Дата: ___________________________</p>
              </div>
              <p className="text-xs text-[#1C1C1E]/65">Подпис (само при хартиен формуляр): ___________________________</p>
              <p className="text-xs text-[#1C1C1E]/70 italic mt-2">* Ненужното се зачертава.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              5. Алтернативно решаване на спорове
            </h2>
            <p>
              Европейската комисия предоставя платформа за онлайн решаване на спорове (ОРС),
              достъпна на адрес:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-[#0A2540] underline underline-offset-2 hover:text-[#1B4332] transition-colors"
              >
                https://ec.europa.eu/consumers/odr
              </a>
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
              { title: 'Политика за поверителност', link: '/privacy', desc: 'GDPR и защита на личните данни' },
              { title: 'Политика за бисквитки', link: '/cookies', desc: 'Управление на бисквитките' },
              { title: 'Общи условия', link: '/terms', desc: 'Права и задължения при услугите' },
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
