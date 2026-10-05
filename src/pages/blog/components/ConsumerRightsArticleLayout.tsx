import type { ReactNode } from 'react';
import { EDITORIAL_IMAGE_ALT, EDITORIAL_IMAGE_URL } from '@/config/editorial-image';
import { getConsumerRightsArticle, type ConsumerRightsArticleId } from '../consumer-rights-articles';
import BlogArticleLayout, { buildArticleSchema, type TocItem } from './BlogArticleLayout';

export default function ConsumerRightsArticleLayout({ id, toc, sources, children }: {
  id: ConsumerRightsArticleId;
  toc: TocItem[];
  sources: { title: string; url: string }[];
  children: ReactNode;
}) {
  const article = getConsumerRightsArticle(id);
  const schema = buildArticleSchema({
    id, name: article.title, description: article.description,
    image: EDITORIAL_IMAGE_URL, section: article.category,
    keywords: article.keywords.join(', '), datePublished: '2026-10-05',
    dateModified: '2026-10-05', breadcrumbLabel: article.title,
  });
  return <BlogArticleLayout
    schemaId={`schema-${id}`} schema={schema}
    seoTitle={article.seoTitle} seoDescription={article.description}
    canonical={`https://imashnujnoto.com/blog/${id}`}
    category={article.category} date="5 октомври 2026" readTime={`${article.readTime} четене`}
    heroImage={EDITORIAL_IMAGE_URL} heroAlt={EDITORIAL_IMAGE_ALT}
    breadcrumbLabel={article.title} title={article.title} intro={article.description}
    tocItems={toc} related={[
      ...article.related.map(relatedId => { const item = getConsumerRightsArticle(relatedId); return { title: item.title, to: `/blog/${item.id}` }; }),
      { title: 'Създаване на сайт с AI: 9 проверки преди публикуване', to: '/blog/sait-s-ai-kakvo-da-proverish' },
    ]}
    ctaEyebrow="Вашият сайт" ctaTitle="Проверете целия път на отказа"
    ctaText="Изпратете адреса на сайта, платформата и какво продавате. Ще обсъдим техническата проверка на формуляра, записа и потвърждението. Правните условия за конкретния договор се уточняват с юрист."
    ctaPrimaryTo={article.ctaPrimaryTo} ctaPrimaryLabel={article.ctaPrimaryLabel}
    ctaSecondaryTo="/uslugi/izrabotka-na-sait" ctaSecondaryLabel="Изработка на сайт"
  >
    <div className="text-base leading-7 text-[#1C1C1E]/80 [&_p]:mb-5 [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-medium [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-5 [&_a]:text-[#0A2540] [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:mb-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[#0A2540]/30 [&_blockquote]:bg-[#F9F9F7] [&_blockquote]:p-5">
      <p className="rounded-xl bg-[#F9F9F7] p-4 text-sm">Актуално към 5 октомври 2026 г. Материалът обяснява правилата и техническото изпълнение; за прилагането към конкретен договор потърсете правна преценка. Примерите са измислени и не описват проверен клиентски магазин.</p>
      {children}
      <section className="mb-12 border-t border-[#1C1C1E]/10 pt-6" aria-label="Източници">
        <h2 className="mb-4 text-lg font-medium">Източници и проверка</h2>
        <p className="text-sm">Правните разпоредби и посочената документация са сверени на 5 октомври 2026 г. Препоръките за организация и тестове са разграничени от законовите изисквания в текста.</p>
        <ul className="text-sm">{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
      </section>
    </div>
  </BlogArticleLayout>;
}
