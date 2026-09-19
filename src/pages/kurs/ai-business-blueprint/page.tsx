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

const FAQ_ITEMS = [
  {
    q: 'Колко струва „Пътят на коприната“ на Академия TAVORA?',
    a: `Пълната програма (11 модула, 74+ урока) е ${silkRoad?.price} EUR еднократно. Стартовият пакет с първите 10 модула е 49 EUR. Първият модул (AI Advantage) е безплатен и не изисква карта.`,
  },
  {
    q: 'Трябва ли ми технически опит, за да започна?',
    a: 'Не. Първият модул (AI Advantage) започва от абсолютна нула — учиш се да работиш с ChatGPT, Claude и Gemini като професионалист, без предварителни технически познания. Всеки следващ модул надгражда върху предишния.',
  },
  {
    q: 'За колко време мога да завърша цялата програма?',
    a: 'Програмата съдържа 11 модула и 32+ часа структурирано съдържание. С темпо от 4-6 часа седмично се покрива за около 6-8 седмици. Всеки модул е самостоятелен.',
  },
  {
    q: 'Кога ще видя първите резултати?',
    a: 'Първите 3 модула ти дават умения да създадеш оферта и сайт. Резултатите зависят от твоята ниша, изпълнение и отделено време — академията не гарантира конкретен финансов резултат.',
  },
  {
    q: 'Мога ли да купя само един модул, а не цялата програма?',
    a: 'Не. Програмата се закупува като пакет — Стартовият пакет (първите 10 модула) или пълната програма (11 модула). Първият модул е безплатен, за да тестваш подхода преди да решиш.',
  },
  {
    q: 'Гарантиран ли е конкретен финансов резултат?',
    a: 'Не. Академията предоставя знания, процеси и практически инструменти, но резултатите зависят от избраната ниша, изпълнението, пазара и отделеното време.',
  },
  {
    q: 'Какво става, ако не съм доволен?',
    a: 'Имаш 30-дневна доброволна гаранция за възстановяване на сумата. Първият модул е безплатен — това е начинът да тестваш програмата без риск.',
  },
];

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
        'Практическа програма за създаване на дигитална услуга с AI — от оферта и сайт до съдържание, намиране на клиенти и работна система. 11 модула, 74+ урока. ТАВОРА ЕООД.',
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
        '11-модулна програма за изграждане на дигитална услуга с изкуствен интелект. Покрива AI промптиране, уеб дизайн с Readdy, SEO и GEO оптимизация, копирайтинг, изграждане на аудитория и конверсионни системи. 32+ часа съдържание, 74+ урока.',
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
        'Уеб дизайн с Readdy AI',
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
        'Практическа програма за създаване на дигитална услуга с AI — от оферта и сайт до съдържание, намиране на клиенти и работна система. 11 модула, 74+ урока. ТАВОРА ЕООД.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://imashnujnoto.com/kurs/ai-business-blueprint');
    }

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