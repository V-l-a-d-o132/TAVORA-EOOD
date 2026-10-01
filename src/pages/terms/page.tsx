import { useEffect } from 'react';
import { ACADEMY_CATALOG_VERIFIED_ON, ACADEMY_PROGRAM_STATS, ACADEMY_TOTAL_STATS } from '@/config/academy-catalog';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const TERMS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/terms#webpage',
  url: 'https://imashnujnoto.com/terms',
  name: 'Общи условия за ползване | ТАВОРА ЕООД',
  description:
    'Общи условия за онлайн обученията на Академия TAVORA (ТАВОРА ЕООД, ЕИК 208438650). Формат на програмите, пакети, плащане, достъп и права на участниците.',
  inLanguage: 'bg',
  dateModified: ACADEMY_CATALOG_VERIFIED_ON,
  isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
};

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Общи условия за Академия TAVORA | ТАВОРА ЕООД';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', TERMS_SCHEMA.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', TERMS_SCHEMA.url);
    const id = 'schema-terms';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(TERMS_SCHEMA);
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
          <h1
            className="text-4xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Общи условия за ползване
          </h1>
          <p className="text-sm text-[#1C1C1E]/65">
            Последна актуализация: 1 октомври 2026 г. &nbsp;·&nbsp; Първа редакция: 11 април 2026 г.
          </p>
        </div>

        <div className="space-y-10 text-[#1C1C1E]/65 leading-relaxed text-sm">

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              1. Страни по договора
            </h2>
            <p>
              Настоящите Общи условия уреждат отношенията между <strong className="text-[#1C1C1E]">ТАВОРА ЕООД</strong> (ЕИК 208438650),
              управлявано от Владимир Веселинов Атанасов, с адрес: гр. Велико Търново (5000), ул. \"Велчо Джамджията\", България
              {' '}(„Доставчик") и физическото или юридическото лице, което се записва за обучение („Участник").
              С попълването на формата за записване Участникът приема настоящите условия изцяло.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              2. Описание на услугата
            </h2>
            <p>
              Академия TAVORA предоставя три самостоятелни онлайн програми. Публикуваният каталог към 1 октомври 2026 г. включва {ACADEMY_TOTAL_STATS.moduleCount} модула и {ACADEMY_TOTAL_STATS.lessonCount} урока. Достъпът зависи от избрания пакет:
            </p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                `„Пътят на коприната“ — 11 модула, ${ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} урока; „Перфектното Видео“ — 15 модула, ${ACADEMY_PROGRAM_STATS.perfectVideo.lessonCount} урока; Marketing Basics — 20 модула, ${ACADEMY_PROGRAM_STATS.marketingBasics.lessonCount} урока`,
                'Онлайн текстови и интерактивни уроци, казуси, самостоятелни задачи, шаблони и проверки',
                'AI Advantage от „Пътят на коприната“ е безплатният пробен модул; регистрацията сама по себе си не отключва платените програми',
                'Стартовият пакет включва първите 10 модула от „Пътят на коприната“; пълният достъп включва трите програми',
                'Пакетът „Пълен достъп + стратегически сесии“ включва две индивидуални онлайн срещи по 60 минути с Владимир Атанасов и „Системата зад Академия TAVORA“',
                'Сертификатът в пакетите с пълен достъп е за завършено обучение и не е държавно призната професионална квалификация',
                'Доживотен достъп до закупеното съдържание',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A2540]/40 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              3. Цени и плащане
            </h2>
            <p>
              Цените на пакетите на Академията и валутата на плащане са в евро (EUR). Крайната сума за избрания пакет е показана преди потвърждаване на плащането и включва ДДС, когато е приложимо.
              Плащането се извършва еднократно преди предоставяне на достъп до платформата.
              Доставчикът си запазва правото да променя цените, като промените не засягат вече сключени договори.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              4. Право на отказ (14-дневен срок)
            </h2>
            <p>
              Съгласно Директива 2011/83/ЕС и Закона за защита на потребителите, потребителите имат право
              да се откажат от договора в срок от <strong className="text-[#1C1C1E]">14 календарни дни</strong> от датата на сключването му,
              без да посочват причина. Подробности:{' '}
              <Link to="/withdrawal" className="text-[#0A2540] underline underline-offset-2 hover:text-[#1B4332] transition-colors">
                Политика за право на отказ
              </Link>.
            </p>
            <div className="mt-3 p-4 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
              <p className="text-xs text-[#1C1C1E]/65">
                <strong className="text-[#1C1C1E]">Важно:</strong> Ако Участникът изрично поиска незабавен достъп до дигиталното съдържание
                преди изтичане на 14-дневния срок и потвърди, че е запознат с последиците,
                правото на отказ се погасява при пълното предоставяне на услугата.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              5. Интелектуална собственост
            </h2>
            <p>
              Цялото съдържание на платформата – видеа, текстове, шаблони, графики и материали –
              е собственост на Академия TAVORA (ТАВОРА ЕООД) и е защитено от авторско право. Участникът получава
              личен, непрехвърляем лиценз за ползване само за лични, нетърговски цели.
            </p>
            <p className="mt-3">
              Забранено е: копирането, разпространението, препродажбата или публичното показване
              на материалите без изрично писмено разрешение.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              6. Отговорност и гаранции
            </h2>
            <p>
              Доставчикът полага всички усилия за качество на съдържанието, но не гарантира конкретни
              финансови резултати. Резултатите зависят от индивидуалното усилие и прилагане на наученото.
              Доставчикът не носи отговорност за косвени или последващи вреди.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              7. Поведение на участниците
            </h2>
            <p>Участниците се задължават да:</p>
            <ul className="mt-3 space-y-2 list-none">
              {[
                'Не споделят данни за достъп с трети лица',
                'Не записват и не разпространяват съдържанието',
                'Спазват уважителен тон при общуване с екипа и другите участници',
                'Не използват платформата за незаконни цели',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]/40 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Нарушението може да доведе до незабавно прекратяване на достъпа без право на възстановяване.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              8. Приложимо право и разрешаване на спорове
            </h2>
            <p>
              Настоящите условия се уреждат от законодателството на <strong className="text-[#1C1C1E]">Република България</strong>.
              При спорове страните се стремят към извънсъдебно уреждане. При невъзможност,
              компетентен е съответният български съд.
            </p>
            <p className="mt-3">
              Информация за извънсъдебното решаване на потребителски спорове и признатите органи за алтернативно решаване на спорове е достъпна в портала на Европейската комисия:{' '}
              <a
                href="https://consumer-redress.ec.europa.eu/index_bg"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-[#0A2540] underline underline-offset-2 hover:text-[#1B4332] transition-colors"
              >
                Consumer Redress in the EU
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem' }}>
              9. Контакт
            </h2>
            <div className="p-4 bg-[#F9F9F9] rounded-xl border border-[#1C1C1E]/6">
              <p className="mb-1"><strong className="text-[#1C1C1E]">Фирма:</strong> ТАВОРА ЕООД · ЕИК 208438650</p>
              <p className="mb-1"><strong className="text-[#1C1C1E]">Управител:</strong> Владимир Веселинов Атанасов</p>
              <p className="mb-1"><strong className="text-[#1C1C1E]">Имейл:</strong> tavoraagency@gmail.com</p>
              <p><strong className="text-[#1C1C1E]">Адрес:</strong> гр. Велико Търново (5000), ул. \"Велчо Джамджията\", България</p>
            </div>
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
              { title: 'Политика за поверителност', link: '/privacy', desc: 'Защита на личните данни и GDPR' },
              { title: 'Политика за бисквитки', link: '/cookies', desc: 'Видове бисквитки и управление' },
              { title: 'Право на отказ', link: '/withdrawal', desc: '14-дневен срок за онлайн услуги' },
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
