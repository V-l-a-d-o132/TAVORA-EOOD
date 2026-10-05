import type { ReactNode } from 'react';
import { EDITORIAL_IMAGE_ALT, EDITORIAL_IMAGE_URL } from '@/config/editorial-image';
import { getSilkRoadArticle, type SilkRoadArticleId } from '../silk-road-articles';
import BlogArticleLayout, { buildArticleSchema, type TocItem } from './BlogArticleLayout';

export default function SilkRoadArticleLayout({ id, toc, sources, children }: {
  id: SilkRoadArticleId;
  toc: TocItem[];
  sources: { title: string; url: string }[];
  children: ReactNode;
}) {
  const article = getSilkRoadArticle(id);
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
      ...article.related.map(relatedId => { const item = getSilkRoadArticle(relatedId); return { title: item.title, to: `/blog/${item.id}` }; }),
      { title: '„Пътят на коприната“: представяне на обучението', to: '/blog/ai-business-blueprint-putyat-na-koprinata' },
    ]}
    ctaEyebrow="Пътят на коприната" ctaTitle="Приложи наученото към свой проект"
    ctaText={article.ctaText} ctaPrimaryTo={article.ctaPrimaryTo} ctaPrimaryLabel={article.ctaPrimaryLabel}
    ctaSecondaryTo={article.ctaPrimaryTo === '/kurs/ai-business-blueprint' ? '/module/s01-m01?lesson=0' : '/kurs/ai-business-blueprint'}
    ctaSecondaryLabel={article.ctaPrimaryTo === '/kurs/ai-business-blueprint' ? 'Безплатен модул — с акаунт' : 'Виж програмата'}
  >
    <div className="text-base leading-7 text-[#1C1C1E]/80 [&_p]:mb-5 [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-lg [&_h3]:font-medium [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-5 [&_a]:text-[#0A2540] [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:mb-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[#0A2540]/30 [&_blockquote]:bg-[#F9F9F7] [&_blockquote]:p-5">
      {children}
      <section className="mb-12 border-t border-[#1C1C1E]/10 pt-6" aria-label="Източници">
        <h2 className="mb-4 text-lg font-medium">Източници и проверка</h2>
        <p className="text-sm">Източниците са проверени на 5 октомври 2026 г. Учебните примери са създадени за тази статия и не описват резултати на реален клиент.</p>
        <ul className="text-sm">{sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
      </section>
    </div>
  </BlogArticleLayout>;
}

export function ArticleTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: ReactNode[][] }) {
  return <div className="mb-7 max-w-full overflow-x-auto rounded-xl border border-[#1C1C1E]/10" role="region" aria-label={caption} tabIndex={0}>
    <table className="w-full min-w-[520px] border-collapse text-left text-sm leading-6">
      <caption className="px-4 py-3 text-left font-medium text-[#1C1C1E]">{caption}</caption>
      <thead className="bg-[#F9F9F7]"><tr>{headers.map(header => <th key={header} scope="col" className="px-4 py-3 font-medium">{header}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index} className="border-t border-[#1C1C1E]/10">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}
