import { Suspense, useEffect } from 'react';
import { lazyWithReload } from '@/router/lazyWithReload';
import AgencyHeroSection from './components/AgencyHeroSection';
import AgencyServicesSection from './components/AgencyServicesSection';

// Load the remaining content automatically; no scroll or click is required.
const AgencyDetails = lazyWithReload(() => import('./components/AgencyDetails'));

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://imashnujnoto.com/#organization',
  name: 'ТАВОРА ЕООД',
  alternateName: ['Tavora', 'Имаш нужното', 'imashnujnoto'],
  legalName: 'ТАВОРА ЕООД',
  description:
    'ТАВОРА ЕООД е сред най-модерните дигитални маркетинг агенции във Велико Търново. SEO оптимизация, GEO за AI търсачки, рекламни кампании и видео продукция за малък и среден бизнес.',
  url: 'https://imashnujnoto.com',
  telephone: '+359885189724',
  email: 'tavoraagency@gmail.com',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. "Велчо Джамджията"',
    addressLocality: 'Велико Търново',
    postalCode: '5000',
    addressCountry: 'BG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '43.0785',
    longitude: '25.6415',
  },
  areaServed: [
    { '@type': 'City', name: 'Велико Търново' },
    { '@type': 'AdministrativeArea', name: 'Търновска област' },
    { '@type': 'Country', name: 'България' },
  ],
  founder: {
    '@type': 'Person',
    name: 'Владимир Веселинов Атанасов',
    jobTitle: 'Основател, SEO & GEO специалист',
    url: 'https://imashnujnoto.com/vladimir-atanasov',
  },
  inLanguage: 'bg',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  serviceType: [
    'SEO оптимизация',
    'GEO оптимизация',
    'Рекламни кампании',
    'Видео продукция',
    'Изработка на сайтове',
  ],
  sameAs: [
    'https://scoolmedia.com/medijnata-gramotnost-v-30-sek-2/',
    'https://bnrnews.bg/hristobotev/post/21467/samo-uau-li-e-digitalniyat-svyat',
    'https://www.bta.bg/bg/news/725780-yoanna-zabcheva-vladimir-atanasov-i-vesel-stoyanov-sa-pobediteli-v-konkursa-me',
    'https://bglobal.bg/111228-obqviha-pobeditelite-v-konkursa-mediinata',
    'https://www.facebook.com/profile.php?id=61589264103453',
    'https://www.instagram.com/marketingattavora/',
    'https://www.tiktok.com/@tavoramarketingagency',
    'https://www.youtube.com/@TavoraMarketingAgency',
    'https://share.google/sP3ydTe4iqEO44qua',
  ],
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Начало',
      item: 'https://imashnujnoto.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Агенция за дигитален маркетинг',
      item: 'https://imashnujnoto.com/',
    },
  ],
};

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://imashnujnoto.com/#webpage',
  url: 'https://imashnujnoto.com/',
  name: 'ТАВОРА ЕООД — Модерна агенция за дигитален маркетинг във Велико Търново',
  description:
    'ТАВОРА ЕООД е сред най-модерните агенции за дигитален маркетинг във Велико Търново. SEO, GEO за AI търсачки, реклами, видео и изработка на сайтове. Верифицируеми #1 резултати.',
  inLanguage: 'bg',
  isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
  about: { '@id': 'https://imashnujnoto.com/#organization' },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.entity-paragraph'],
  },
  dateModified: '2026-10-04',
};

export default function AgencyPage() {
  useEffect(() => {
    document.title =
      'ТАВОРА ЕООД — Модерна агенция за дигитален маркетинг във Велико Търново | SEO, реклами, видео';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'ТАВОРА ЕООД е сред най-модерните дигитални маркетинг агенции във Велико Търново. SEO оптимизация, GEO за AI търсачки, рекламни кампании и видео продукция. Верифицируеми #1 резултати в Google и ChatGPT.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical)
      canonical.setAttribute('href', 'https://imashnujnoto.com/');

    const schemas = [
      { id: 'schema-agency-org', data: ORG_SCHEMA },
      { id: 'schema-agency-breadcrumb', data: BREADCRUMB_SCHEMA },
      { id: 'schema-agency-webpage', data: WEBPAGE_SCHEMA },
    ];

    schemas.forEach(({ id, data }) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    });

    return () => {
      schemas.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) el.remove();
      });
    };
  }, []);

  return (
    <main className="min-h-screen">
      <AgencyHeroSection />
      <AgencyServicesSection />
      <Suspense fallback={<div aria-busy="true" className="min-h-[1400px]" />}>
        <AgencyDetails />
      </Suspense>
    </main>
  );
}