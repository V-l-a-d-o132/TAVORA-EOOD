import { useEffect } from 'react';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import PerfektnoVideoHero from './components/PerfektnoVideoHero';
import PerfektnoVideoForWho from './components/PerfektnoVideoForWho';
import PerfektnoVideoProblem from './components/PerfektnoVideoProblem';
import PerfektnoVideoProgram from './components/PerfektnoVideoProgram';
import PerfektnoVideoWhyTavora from './components/PerfektnoVideoWhyTavora';
import PerfektnoVideoFAQ from './components/PerfektnoVideoFAQ';
import PerfektnoVideoFinalCTA from './components/PerfektnoVideoFinalCTA';
import ProgramPricing from '@/pages/kurs/components/ProgramPricing';
import ProgramGuarantee from '@/pages/kurs/components/ProgramGuarantee';
import ProgramContact from '@/pages/kurs/components/ProgramContact';
import ProgramMobileCTA from '@/pages/kurs/components/ProgramMobileCTA';
import { academyPixel } from '@/lib/metaPixel';
import { getTierById } from '@/config/pricing';

const perfectVideo = getTierById('perfectVideo');

const FAQ_ITEMS = [
  {
    q: 'Колко струва Перфектното Видео на Академия TAVORA?',
    a: `Пълната програма (15 модула, 241+ урока) е ${perfectVideo?.price} EUR еднократно. Модул 01 (Диагностика, стратегия и психология на вниманието) е безплатен и не изисква карта.`,
  },
  {
    q: 'Трябва ли ми скъпа техника, за да започна?',
    a: 'Не. Модул 07 (Мобилна видеография) показва как да снимаш професионално само с телефон. Модул 13 покрива работа с професионална продукция — когато си готов да мащабираш.',
  },
  {
    q: 'За колко време мога да завърша програмата?',
    a: 'Перфектното Видео съдържа 20+ часа съдържание в 15 модула (241 урока). С темпо от 3-4 часа седмично се покрива за около 5-7 седмици. Всеки модул е самостоятелен.',
  },
  {
    q: 'Чувствам се неудобно пред камера — ще ми помогне ли програмата?',
    a: 'Да. Модули 01-03 се случват преди да включиш камера — стратегия, послание, психология. Когато знаеш точно какво ще кажеш и как, страхът намалява.',
  },
  {
    q: 'Ще мога ли да предлагам видео продукция като платена услуга?',
    a: 'Да. Модул 13 покрива бюджетиране, казуси по ниши и клиентски workflow. След програмата имаш и система, и портфолио от практическите задачи.',
  },
  {
    q: 'Каква е разликата с гледане на YouTube туториали?',
    a: 'YouTube дава изолирани техники. Перфектното Видео дава FRAME система — 15 модула в точната последователност от диагностика до анализ.',
  },
  {
    q: 'Има ли AI модули в програмата?',
    a: 'Да — Модул 12 е изцяло посветен на AI в целия видео процес. Но AI инструменти са вплетени и във всеки друг модул.',
  },
  {
    q: 'Гарантиран ли е конкретен финансов резултат?',
    a: 'Не. Академията предоставя знания, процеси и практически инструменти, но резултатите зависят от избраната ниша, изпълнението, пазара и отделеното време.',
  },
];

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kurs/perfektnoto-video#webpage',
      url: 'https://imashnujnoto.com/kurs/perfektnoto-video',
      name: 'Перфектното Видео — видео съдържание с ясна стратегия | Академия TAVORA',
      description: 'Практическа програма за видео продукция от идеята и сценария до заснемането, монтажа, публикуването и анализа на резултатите. 15 модула, 241+ урока. ТАВОРА ЕООД.',
      inLanguage: 'bg',
      dateModified: today,
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Академия TAVORA', item: 'https://imashnujnoto.com/kurs' },
          { '@type': 'ListItem', position: 3, name: 'Перфектното Видео', item: 'https://imashnujnoto.com/kurs/perfektnoto-video' },
        ],
      },
    },
    {
      '@type': 'Course',
      '@id': 'https://imashnujnoto.com/kurs/perfektnoto-video#course',
      name: 'Перфектното Видео',
      description: '15-модулна FRAME система за бизнес видео продукция. Покрива диагностика, послание и психология, камера и композиция, осветление и цвят, звук, снимачен ден, мобилна видеография, batch filming, монтаж, SEO и платформени стратегии, YouTube аналитика, AI в целия процес, професионална продукция и финален FRAME сертификационен проект. 241 урока, 20+ часа.',
      url: 'https://imashnujnoto.com/kurs/perfektnoto-video',
      provider: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      courseMode: 'online',
      inLanguage: 'bg',
      educationalLevel: 'Beginner to Advanced',
      timeRequired: 'PT20H',
      teaches: ['Видео продукция', 'Видео маркетинг', 'Снимачни техники', 'Видео монтаж', 'Осветление и цвят', 'Звук и аудио', 'AI за видео', 'Мобилна видеография', 'YouTube аналитика'],
      offers: {
        '@type': 'Offer',
        name: 'Перфектното Видео',
        price: String(perfectVideo?.price ?? 99),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
      numberOfModules: 15,
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://imashnujnoto.com/kurs/perfektnoto-video#faq',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
    {
      '@type': 'Organization',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      alternateName: ['Tavora', 'Имаш нужното', 'Академия TAVORA'],
      url: 'https://imashnujnoto.com',
      telephone: '+359885189724',
      address: { '@type': 'PostalAddress', streetAddress: 'ул. "Велчо Джамджията"', addressLocality: 'Велико Търново', postalCode: '5000', addressCountry: 'BG' },
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов', url: 'https://imashnujnoto.com/ekip' },
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
    },
  ],
};

export default function PerfektnotoVideoFunnelPage() {
  useEffect(() => {
    document.title = 'Перфектното Видео — видео съдържание с ясна стратегия | Академия TAVORA';
    academyPixel.viewContent('Перфектното Видео');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Практическа програма за видео продукция от идеята и сценария до заснемането, монтажа, публикуването и анализа на резултатите. 15 модула, 241+ урока. ТАВОРА ЕООД.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/kurs/perfektnoto-video');

    const id = 'schema-perfektno-video-funnel';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);

    return () => { const existing = document.getElementById(id); if (existing) existing.remove(); };
  }, []);

  const keyword = 'FRAME система за бизнес видео продукция';

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />
      <main>
        <PerfektnoVideoHero keyword={keyword} />
        <PerfektnoVideoForWho />
        <PerfektnoVideoProblem />
        <PerfektnoVideoProgram />
        <ProgramPricing primaryTierId="perfectVideo" showFullAccess showStrategic />
        <ProgramGuarantee />
        <PerfektnoVideoWhyTavora />
        <PerfektnoVideoFAQ />
        <PerfektnoVideoFinalCTA />
        <ProgramContact programName="Перфектното Видео" />
      </main>
      <SharedFooter />
      <ProgramMobileCTA tierId="perfectVideo" ctaLabel="Вземи Перфектното Видео" />
    </div>
  );
}