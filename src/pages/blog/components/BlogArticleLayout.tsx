import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const LOGO_URL =
  'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862';

export interface TocItem {
  id: string;
  label: string;
}

export interface RelatedItem {
  title: string;
  to: string;
}

export interface BuildArticleSchemaOptions {
  id: string;
  name: string;
  description: string;
  image: string;
  section: string;
  keywords: string;
  datePublished: string;
  breadcrumbLabel: string;
}

// eslint-disable-next-line react-refresh/only-export-components -- Existing blog pages import this schema helper from this component.
export function buildArticleSchema({
  id,
  name,
  description,
  image,
  section,
  keywords,
  datePublished,
  breadcrumbLabel,
}: BuildArticleSchemaOptions) {
  const url = `https://imashnujnoto.com/blog/${id}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        name,
        headline: name,
        description,
        author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
        publisher: {
          '@type': 'Organization',
          name: 'ТАВОРА ЕООД',
          url: 'https://imashnujnoto.com',
          telephone: '+359885189724',
          email: 'tavoraagency@gmail.com',
          logo: { '@type': 'ImageObject', url: LOGO_URL },
        },
        datePublished,
        dateModified: new Date().toISOString().split('T')[0],
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        inLanguage: 'bg',
        image,
        articleSection: section,
        keywords,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: breadcrumbLabel, item: url },
        ],
      },
    ],
  };
}

export function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-12">
      <h2
        className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function CtaButton({
  to,
  label,
  variant,
}: {
  to: string;
  label: string;
  variant: 'primary' | 'secondary';
}) {
  const base =
    variant === 'primary'
      ? 'px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium'
      : 'px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center';
  if (/^https?:\/\//.test(to)) {
    return (
      <a href={to} target="_blank" rel="noopener dofollow" className={base}>
        {label}
      </a>
    );
  }
  return (
    <Link to={to} className={base}>
      {label}
    </Link>
  );
}

interface BlogArticleLayoutProps {
  schemaId: string;
  schema: unknown;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  category: string;
  date: string;
  readTime: string;
  heroImage: string;
  heroAlt: string;
  breadcrumbLabel: string;
  title: ReactNode;
  intro: ReactNode;
  tocItems: TocItem[];
  related: RelatedItem[];
  ctaEyebrow?: string;
  ctaTitle?: ReactNode;
  ctaText?: string;
  ctaPrimaryTo?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryTo?: string;
  ctaSecondaryLabel?: string;
  children: ReactNode;
}

export default function BlogArticleLayout({
  schemaId,
  schema,
  seoTitle,
  seoDescription,
  canonical,
  category,
  date,
  readTime,
  heroImage,
  heroAlt,
  breadcrumbLabel,
  title,
  intro,
  tocItems,
  related,
  ctaEyebrow = 'Готови за повече клиенти?',
  ctaTitle,
  ctaText = 'Консултация 50 € — анализ, конкуренти и конкретен план. Сумата се приспада при договор.',
  ctaPrimaryTo = '/kontakt',
  ctaPrimaryLabel = 'Поискайте консултация →',
  ctaSecondaryTo = '/uslugi',
  ctaSecondaryLabel = 'Вижте услугите',
  children,
}: BlogArticleLayoutProps) {
  useEffect(() => {
    const id = schemaId;
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    document.title = seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seoDescription);
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', canonical);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [schemaId, schema, seoTitle, seoDescription, canonical]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-16">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6 pt-14 md:pt-20">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">{breadcrumbLabel}</span>
        </nav>

        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src={heroImage}
              alt={heroAlt}
              className="w-full h-full object-cover object-top"
              decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#0A2540]/6 text-[#0A2540] font-medium">{category}</span>
            <span className="text-[10px] text-[#1C1C1E]/70">{date}</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">{readTime}</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {title}
          </h1>

          <div className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">{intro}</div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#F9F9F7] border border-[#1C1C1E]/8 overflow-hidden">
              <img
                src="https://static.readdy.ai/image/658b459fcf05a7723f8029c45615de2f/7ba027e5c67ece54f762f57dda00407f.png"
                alt="Владимир Атанасов"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <div className="text-sm text-[#1C1C1E]/70">Владимир Атанасов</div>
              <div className="text-[10px] text-[#1C1C1E]/65">Дигитален маркетинг, ТАВОРА ЕООД</div>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-12">
          <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Съдържание</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tocItems.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 text-sm text-[#1C1C1E]/65 hover:text-[#0A2540] transition-colors"
              >
                <span className="text-[10px] text-[#0A2540]/65 w-5">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <article className="prose-sm max-w-none">
          {children}

          <section className="mb-12 p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">{ctaEyebrow}</div>
                <div
                  className="text-2xl md:text-3xl font-light leading-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {ctaTitle}
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">{ctaText}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <CtaButton to={ctaPrimaryTo} label={ctaPrimaryLabel} variant="primary" />
                {ctaSecondaryTo ? (
                  <CtaButton to={ctaSecondaryTo} label={ctaSecondaryLabel} variant="secondary" />
                ) : null}
              </div>
            </div>
          </section>

          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="group flex items-center justify-between gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer"
                >
                  <span className="text-sm text-[#1C1C1E]/70 group-hover:text-[#0A2540] transition-colors">{a.title}</span>
                  <i className="ri-arrow-right-line text-[#1C1C1E]/20 group-hover:text-[#0A2540]/65 text-sm shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <SharedFooter />
    </div>
  );
}