import { syncPageSocialMeta } from '@/lib/page-social-meta';
import { PERFECT_VIDEO_FAQ } from '@/data/academy-public-faq';
import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
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

const FAQ_ITEMS = PERFECT_VIDEO_FAQ;

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kurs/perfektnoto-video#webpage',
      url: 'https://imashnujnoto.com/kurs/perfektnoto-video',
      name: 'Перфектното Видео — видео съдържание с ясна стратегия | Академия TAVORA',
      description: `Практическа програма за видео продукция от идеята и сценария до заснемането, монтажа, публикуването и анализа на резултатите. 15 модула, ${ACADEMY_PROGRAM_STATS.perfectVideo.lessonCount} урока. ТАВОРА ЕООД.`,
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
      description: `15-модулна FRAME система за бизнес видео продукция. Покрива диагностика, послание и психология, камера и композиция, осветление и цвят, звук, снимачен ден, мобилна видеография, batch filming, монтаж, публикуване, аналитика, AI, професионална продукция и финален практичен проект с изпити. ${ACADEMY_PROGRAM_STATS.perfectVideo.lessonCount} урока.`,
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
      metaDesc.setAttribute('content', `Практическа програма за видео продукция от идеята и сценария до заснемането, монтажа, публикуването и анализа на резултатите. 15 модула, ${ACADEMY_PROGRAM_STATS.perfectVideo.lessonCount} урока. ТАВОРА ЕООД.`);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/kurs/perfektnoto-video');

    const restoreSocialMeta = syncPageSocialMeta();

    const id = 'schema-perfektno-video-funnel';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);

    return () => {
      restoreSocialMeta();
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
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
