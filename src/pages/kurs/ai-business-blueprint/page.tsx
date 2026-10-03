import { syncPageSocialMeta } from '@/lib/page-social-meta';
import { SILK_ROAD_FAQ } from '@/data/academy-public-faq';
import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
import { useEffect } from 'react';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import AiBlueprintHero from './components/AiBlueprintHero';
import AiBlueprintForWho from './components/AiBlueprintForWho';
import AiBlueprintProblem from './components/AiBlueprintProblem';
import AiBlueprintProgram from './components/AiBlueprintProgram';
import AiBlueprintWhyTavora from './components/AiBlueprintWhyTavora';
import AiBlueprintFAQ from './components/AiBlueprintFAQ';
import AiBlueprintFinalCTA from './components/AiBlueprintFinalCTA';
import ProgramPricing from '@/pages/kurs/components/ProgramPricing';
import ProgramGuarantee from '@/pages/kurs/components/ProgramGuarantee';
import ProgramContact from '@/pages/kurs/components/ProgramContact';
import ProgramMobileCTA from '@/pages/kurs/components/ProgramMobileCTA';
import { academyPixel } from '@/lib/metaPixel';
import { getTierById } from '@/config/pricing';

const silkRoad = getTierById('silkRoad');

const FAQ_ITEMS = SILK_ROAD_FAQ;

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kurs/ai-business-blueprint#webpage',
      url: 'https://imashnujnoto.com/kurs/ai-business-blueprint',
      name: 'Пътят на коприната — изгради дигитална услуга с AI | Академия TAVORA',
      description:
        `Практическа програма за създаване на дигитална услуга с AI — от оферта и сайт до съдържание, намиране на клиенти и работна система. 11 модула, ${ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} урока. ТАВОРА ЕООД.`,
      inLanguage: 'bg',
      dateModified: today,
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Академия TAVORA', item: 'https://imashnujnoto.com/kurs' },
          { '@type': 'ListItem', position: 3, name: 'Пътят на коприната', item: 'https://imashnujnoto.com/kurs/ai-business-blueprint' },
        ],
      },
    },
    {
      '@type': 'Course',
      '@id': 'https://imashnujnoto.com/kurs/ai-business-blueprint#course',
      name: 'Пътят на коприната (AI Business Blueprint)',
      description:
        `11-модулна програма за изграждане на малък продукт или дигитална услуга. Покрива формулиране на проблем, ясни задания към AI, уеб дизайн, SEO и GEO, копирайтинг, аудитория, завършено действие и автоматизация. ${ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} урока с казуси и проверки. Първи модул безплатен.`,
      url: 'https://imashnujnoto.com/kurs/ai-business-blueprint',
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
      timeRequired: 'PT32H',
      teaches: [
        'AI за бизнес',
        'Уеб дизайн и проверка на работеща страница',
        'SEO и GEO оптимизация',
        'Копирайтинг и съдържание',
        'Изграждане на аудитория',
        'Конверсионни системи',
        'Автоматизация с AI',
      ],
      offers: {
        '@type': 'Offer',
        name: 'Пътят на коприната',
        price: String(silkRoad?.price ?? 99),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
      numberOfModules: 11,
      educationalCredentialAwarded: 'Certificate of Completion',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://imashnujnoto.com/kurs/ai-business-blueprint#faq',
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
      description: 'Дигитален маркетинг агенция и AI бизнес академия. SEO оптимизация, GEO за AI търсачки, рекламни кампании, видео продукция и AI бизнес обучение.',
      url: 'https://imashnujnoto.com',
      telephone: '+359885189724',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. "Велчо Джамджията"',
        addressLocality: 'Велико Търново',
        postalCode: '5000',
        addressCountry: 'BG',
      },
      founder: {
        '@type': 'Person',
        name: 'Владимир Веселинов Атанасов',
        url: 'https://imashnujnoto.com/ekip',
      },
      legalName: 'ТАВОРА ЕООД',
      taxID: '208438650',
    },
  ],
};

export default function AiBusinessBlueprintFunnelPage() {
  useEffect(() => {
    document.title = 'Пътят на коприната — изгради дигитална услуга с AI | Академия TAVORA';
    academyPixel.viewContent('Пътят на коприната');

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        `Практическа програма за създаване на дигитална услуга с AI — от оферта и сайт до съдържание, намиране на клиенти и работна система. 11 модула, ${ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} урока. ТАВОРА ЕООД.`
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://imashnujnoto.com/kurs/ai-business-blueprint');
    }

    const restoreSocialMeta = syncPageSocialMeta();

    const id = 'schema-ai-blueprint-funnel';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    return () => {
      restoreSocialMeta();
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  const keyword = 'как да изградя онлайн бизнес с изкуствен интелект';

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main>
        <AiBlueprintHero keyword={keyword} />
        <AiBlueprintForWho />
        <AiBlueprintProblem />
        <AiBlueprintProgram />
        <ProgramPricing primaryTierId="silkRoad" showStarter showFullAccess showStrategic />
        <ProgramGuarantee />
        <AiBlueprintWhyTavora />
        <AiBlueprintFAQ />
        <AiBlueprintFinalCTA />
        <ProgramContact programName="Пътят на коприната" />
      </main>

      <SharedFooter />
      <ProgramMobileCTA tierId="silkRoad" ctaLabel="Вземи Пътят на коприната" />
    </div>
  );
}
