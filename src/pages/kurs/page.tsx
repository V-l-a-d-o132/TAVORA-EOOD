import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { metaPixel } from '@/lib/metaPixel';
import { academyPixel } from '@/lib/metaPixel';
import { STANDALONE_PROGRAMS, getTierById } from '@/config/pricing';
import SharedNav from '@/components/feature/SharedNav';
import LearningPlatform from './components/LearningPlatform';
import AkademiyaHeroSection from './components/AkademiyaHeroSection';
import AkademiyaOutcomesSection from './components/AkademiyaOutcomesSection';
import AkademiyaPathSection from './components/AkademiyaPathSection';
import AkademiyaProgramsSection from './components/AkademiyaProgramsSection';
import AcademyAccessSection from './components/AcademyAccessSection';
import Module1PreviewSection from './components/Module1PreviewSection';
import AkademiyaEnrollmentSection from './components/AkademiyaEnrollmentSection';
import AkademiyaResultsSection from './components/AkademiyaResultsSection';
import AkademiyaFounderSection from './components/AkademiyaFounderSection';
import AkademiyaGuaranteeSection from './components/AkademiyaGuaranteeSection';
import AkademiyaFAQSection from './components/AkademiyaFAQSection';
import KursFooter from './components/KursFooter';
import MobileBottomBar from './components/MobileBottomBar';
import KursStickyNav from './components/KursStickyNav';

const fullAccess = getTierById('fullAccess');

const AKADEMIYA_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://imashnujnoto.com/kurs#webpage',
      url: 'https://imashnujnoto.com/kurs',
      name: 'Академия TAVORA — AI, маркетинг и видео обучение | ТАВОРА ЕООД',
      description:
        'Практическа академия по AI, маркетинг и видео. Научи се да създаваш и продаваш дигитални услуги — от оферта и сайт до съдържание и привличане на клиенти.',
      inLanguage: 'bg',
      isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Академия TAVORA', item: 'https://imashnujnoto.com/kurs' },
        ],
      },
    },
    {
      '@type': 'Course',
      '@id': 'https://imashnujnoto.com/kurs#course',
      name: 'Академия TAVORA — AI, маркетинг и видео',
      description:
        'Практическа академия за създаване и продажба на дигитални услуги: AI, маркетинг и видео продукция. Три самостоятелни програми и пълен достъп.',
      url: 'https://imashnujnoto.com/kurs',
      provider: {
        '@type': 'Organization',
        '@id': 'https://imashnujnoto.com/#organization',
        name: 'ТАВОРА ЕООД',
        legalName: 'ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com',
      },
      courseMode: 'online',
      inLanguage: 'bg',
      teaches: ['AI за бизнес', 'Дигитален маркетинг', 'Видео продукция', 'Изграждане на сайтове'],
      offers: {
        '@type': 'Offer',
        name: fullAccess?.name || 'Пълен достъп',
        price: fullAccess ? String(fullAccess.price) : '249',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://imashnujnoto.com/kurs#programs',
      name: 'Програми в Академия TAVORA',
      itemListElement: STANDALONE_PROGRAMS.map((p, i) => ({
        '@type': 'Course',
        position: i + 1,
        name: p.name,
        description: p.description,
        url: `https://imashnujnoto.com${p.route}`,
        provider: {
          '@type': 'Organization',
          '@id': 'https://imashnujnoto.com/#organization',
          name: 'ТАВОРА ЕООД',
        },
        offers: {
          '@type': 'Offer',
          price: String(p.price),
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
        },
      })),
    },
  ],
};

export default function KursPage() {
  const { user, loading } = useAuth();

  // Meta Pixel + SEO
  useEffect(() => {
    const id = 'schema-kurs';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(AKADEMIYA_SCHEMA);

    document.title = 'Академия TAVORA — AI, маркетинг и видео обучение | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Практическа академия по AI, маркетинг и видео. Научи се да създаваш и продаваш дигитални услуги — от оферта и сайт до съдържание и привличане на клиенти.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/kurs');

    // Meta Pixel ViewContent
    metaPixel.viewContent('Академия TAVORA — Образователна страница', 'Академия TAVORA');
    academyPixel.viewContent('Академия TAVORA — Образователна страница');

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 animate-spin" style={{ borderColor: '#1a1a1a', borderTopColor: '#e53e3e', borderRadius: '50%' }} />
          <p className="text-sm" style={{ color: '#a0a0a0' }}>Зареждаме...</p>
        </div>
      </div>
    );
  }

  // If logged in, always show LearningPlatform (it handles locked/unlocked & purchase CTAs itself)
  if (user) {
    return <LearningPlatform />;
  }

  return (
    <>
      <SharedNav variant="dark" />
      <KursStickyNav />
      <main className="min-h-screen pb-20 md:pb-0" style={{ background: '#0a0a0a' }}>
        {/* 1. HERO */}
        <AkademiyaHeroSection />

        {/* Direct access + free module 1 preview */}
        <AcademyAccessSection />
        <Module1PreviewSection />

        {/* 2. Practical outcomes */}
        <AkademiyaOutcomesSection />

        {/* 3. Path through the Academy */}
        <AkademiyaPathSection />

        {/* 4. Programs */}
        <AkademiyaProgramsSection />

        {/* 5. Pricing */}
        <AkademiyaEnrollmentSection />

        {/* 6. Proof */}
        <AkademiyaResultsSection />

        {/* 7. Who's behind */}
        <AkademiyaFounderSection />

        {/* 8. Guarantee */}
        <AkademiyaGuaranteeSection />

        {/* 9. FAQ */}
        <AkademiyaFAQSection />

        <KursFooter />

        {/* MOBILE BOTTOM BAR */}
        <MobileBottomBar />
      </main>
    </>
  );
}