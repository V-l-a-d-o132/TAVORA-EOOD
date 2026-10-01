import { syncPageSocialMeta } from '@/lib/page-social-meta';
import { MARKETING_BASICS_FAQ } from '@/data/academy-public-faq';
import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
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

const FAQ_ITEMS = MARKETING_BASICS_FAQ;

const courseUpdated = '2026-09-30';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kurs/marketing-basics#webpage',
      url: 'https://imashnujnoto.com/kurs/marketing-basics',
      name: 'Marketing Basics — изгради маркетинг система | Академия TAVORA',
      description: `Практическа програма за разбиране на пазара, изграждане на оферта, създаване на съдържание и измерване на резултатите. ${ACADEMY_PROGRAM_STATS.marketingBasics.lessonCount} публикувани урока в 20 модула, практически проект и финален изпит. ТАВОРА ЕООД.`,
      inLanguage: 'bg',
      dateModified: courseUpdated,
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
      description: `20-модулна маркетинг система за малък и локален бизнес. GEO, AI агенти и автоматизация са вградени директно в ${ACADEMY_PROGRAM_STATS.marketingBasics.lessonCount} публикувани урока с финален практически проект и изпит. От позициониране до измерване на резултатите.`,
      url: 'https://imashnujnoto.com/kurs/marketing-basics',
      provider: { '@type': 'Organization', '@id': 'https://imashnujnoto.com/#organization', name: 'ТАВОРА ЕООД', legalName: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com' },
      courseMode: 'online', inLanguage: 'bg', educationalLevel: 'Beginner to Advanced',
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
    if (metaDesc) metaDesc.setAttribute('content', `Практическа програма за разбиране на пазара, изграждане на оферта, създаване на съдържание и измерване на резултатите. ${ACADEMY_PROGRAM_STATS.marketingBasics.lessonCount} публикувани урока в 20 модула, практически проект и финален изпит. ТАВОРА ЕООД.`);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/kurs/marketing-basics');

    const restoreSocialMeta = syncPageSocialMeta();

    const id = 'schema-marketing-basics-funnel';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    return () => {
      restoreSocialMeta();
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
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
