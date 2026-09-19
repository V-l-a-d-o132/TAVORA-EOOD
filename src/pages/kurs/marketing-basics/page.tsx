import { useEffect } from 'react';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import MarketingBasicsHero from './components/MarketingBasicsHero';
import MarketingBasicsForWho from './components/MarketingBasicsForWho';
import MarketingBasicsProblem from './components/MarketingBasicsProblem';
import MarketingBasicsProgram from './components/MarketingBasicsProgram';
import MarketingBasicsWhyTavora from './components/MarketingBasicsWhyTavora';
import MarketingBasicsFAQ from './components/MarketingBasicsFAQ';
import MarketingBasicsFinalCTA from './components/MarketingBasicsFinalCTA';
import ProgramPricing from '@/pages/kurs/components/ProgramPricing';
import ProgramGuarantee from '@/pages/kurs/components/ProgramGuarantee';
import ProgramContact from '@/pages/kurs/components/ProgramContact';
import ProgramMobileCTA from '@/pages/kurs/components/ProgramMobileCTA';
import { academyPixel } from '@/lib/metaPixel';
import { getTierById } from '@/config/pricing';

const marketingBasics = getTierById('marketingBasics');

const FAQ_ITEMS = [
  { q: 'Колко струва Marketing Basics на Академия TAVORA?', a: `Пълната програма (20 модула, 177+ урока) е ${marketingBasics?.price} EUR еднократно. Първият модул е безплатен и не изисква карта.` },
  { q: 'Колко време отнема цялата програма?', a: 'Marketing Basics съдържа 18+ часа в 20 модула (177 урока). Препоръчително темпо: по 1 модул на седмица — 20 седмици общо. Всеки модул е самостоятелен.' },
  { q: 'Трябва ли ми предишен маркетинг опит?', a: 'Не. Започваме от абсолютната основа — "кой си ти, за кого си и защо теб" (Модул 01). Всеки следващ модул надгражда логически.' },
  { q: 'Ще мога ли веднага да приложа наученото в моя бизнес?', a: 'Да. Всеки урок завършва с конкретна практическа задача за твоя бизнес. След Група 1 ще имаш ясно позициониране. След Група 2 — пълно онлайн присъствие.' },
  { q: 'Как Marketing Basics се различава от „Пътят на коприната“?', a: 'Marketing Basics е чисто маркетингова програма за малък и локален бизнес. „Пътят на коприната“ е по-широка бизнес система с AI, дизайн и технически умения. Двете са самостоятелни и се допълват.' },
  { q: 'Подходящо ли е за локален бизнес?', a: 'Да — програмата е проектирана специално за малък и локален бизнес. Модули 06-09 покриват GBP, ревюта, Schema, локално SEO и GEO.' },
  { q: 'Трябват ли ми пари за реклами?', a: 'Не. Модули 01-10 не изискват рекламен бюджет. Модули 11-16 покриват платени канали, но с фокус върху започване с малък бюджет и мащабиране при възвръщаемост.' },
  { q: 'Гарантиран ли е конкретен финансов резултат?', a: 'Не. Академията предоставя знания, процеси и практически инструменти, но резултатите зависят от избраната ниша, изпълнението, пазара и отделеното време.' },
];

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kurs/marketing-basics#webpage',
      url: 'https://imashnujnoto.com/kurs/marketing-basics',
      name: 'Marketing Basics — изгради маркетинг система | Академия TAVORA',
      description: 'Практическа програма за разбиране на пазара, изграждане на оферта, създаване на съдържание и измерване на резултатите. 20 модула, 177+ урока. ТАВОРА ЕООД.',
      inLanguage: 'bg',
      dateModified: today,
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Академия TAVORA', item: 'https://imashnujnoto.com/kurs' },
          { '@type': 'ListItem', position: 3, name: 'Marketing Basics', item: 'https://imashnujnoto.com/kurs/marketing-basics' },
        ],
      },
    },
    {
      '@type': 'Course',
      '@id': 'https://imashnujnoto.com/kurs/marketing-basics#course',
      name: 'Marketing Basics',
      description: '20-модулна маркетинг система за малък и локален бизнес. GEO, AI агенти и автоматизация са вградени директно в 177 урока. От позициониране до измерване на резултатите.',
      url: 'https://imashnujnoto.com/kurs/marketing-basics',
      provider: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', legalName: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
      courseMode: 'online', inLanguage: 'bg', educationalLevel: 'Beginner to Advanced', timeRequired: 'PT18H',
      teaches: ['Маркетинг стратегия', 'Позициониране', 'Локално SEO', 'GEO оптимизация', 'Google Business Profile', 'Meta Advantage+', 'Google AI Max', 'Имейл маркетинг', 'Конверсионна оптимизация', 'Маркетинг аналитика'],
      offers: {
        '@type': 'Offer',
        name: 'Marketing Basics',
        price: String(marketingBasics?.price ?? 129),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
      numberOfModules: 20,
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://imashnujnoto.com/kurs/marketing-basics#faq',
      mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
    },
    {
      '@type': 'Organization',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД', alternateName: ['Tavora', 'Имаш нужното', 'Академия TAVORA'],
      url: 'https://imashnujnoto.com', telephone: '+359885189724',
      address: { '@type': 'PostalAddress', streetAddress: 'ул. "Велчо Джамджията"', addressLocality: 'Велико Търново', postalCode: '5000', addressCountry: 'BG' },
      founder: { '@type': 'Person', name: 'Владимир Веселинов Атанасов', url: 'https://imashnujnoto.com/ekip' },
      legalName: 'ТАВОРА ЕООД', taxID: '208438650',
    },
  ],
};

export default function MarketingBasicsFunnelPage() {
  useEffect(() => {
    document.title = 'Marketing Basics — изгради маркетинг система | Академия TAVORA';
    academyPixel.viewContent('Marketing Basics');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Практическа програма за разбиране на пазара, изграждане на оферта, създаване на съдържание и измерване на резултатите. 20 модула, 177+ урока. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/kurs/marketing-basics');

    const id = 'schema-marketing-basics-funnel';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    return () => { const existing = document.getElementById(id); if (existing) existing.remove(); };
  }, []);

  const keyword = 'маркетинг система за малък бизнес';

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />
      <main>
        <MarketingBasicsHero keyword={keyword} />
        <MarketingBasicsForWho />
        <MarketingBasicsProblem />
        <MarketingBasicsProgram />
        <ProgramPricing primaryTierId="marketingBasics" showFullAccess showStrategic />
        <ProgramGuarantee />
        <MarketingBasicsWhyTavora />
        <MarketingBasicsFAQ />
        <MarketingBasicsFinalCTA />
        <ProgramContact programName="Marketing Basics" />
      </main>
      <SharedFooter />
      <ProgramMobileCTA tierId="marketingBasics" ctaLabel="Вземи Marketing Basics" />
    </div>
  );
}