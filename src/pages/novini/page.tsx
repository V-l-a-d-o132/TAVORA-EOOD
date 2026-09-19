import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  published: boolean;
  image_url: string;
}

const CATEGORIES = ['Всички', 'Агенция', 'SEO', 'Реклами', 'Видео', 'Клиенти', 'Обяви'];

/* ── Schema.org ── */
function buildNewsSchema(items: NewsItem[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://imashnujnoto.com/novini#webpage',
        url: 'https://imashnujnoto.com/novini',
        name: 'Новини | ТАВОРА ЕООД — Дигитален маркетинг Велико Търново',
        description: 'Новини, обновления и анонси от ТАВОРА ЕООД — дигитален маркетинг агенция във Велико Търново. SEO, реклами, видео и нови клиенти.',
        inLanguage: 'bg',
        dateModified: '2026-05-06',
        isPartOf: { '@id': 'https://imashnujnoto.com/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
            { '@type': 'ListItem', position: 2, name: 'Новини', item: 'https://imashnujnoto.com/novini' },
          ],
        },
      },
      {
        '@type': 'Blog',
        '@id': 'https://imashnujnoto.com/novini#blog',
        name: 'Новини ТАВОРА ЕООД',
        url: 'https://imashnujnoto.com/novini',
        description: 'Последни новини от дигитален маркетинг агенция ТАВОРА ЕООД, Велико Търново.',
        inLanguage: 'bg',
        publisher: { '@id': 'https://imashnujnoto.com/#organization' },
        blogPost: items.map((item, i) => ({
          '@type': 'BlogPosting',
          '@id': `https://imashnujnoto.com/novini#post-${item.id}`,
          headline: item.title,
          description: item.summary,
          url: `https://imashnujnoto.com/novini`,
          datePublished: item.date,
          author: { '@type': 'Person', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com/za-tavora' },
          publisher: { '@id': 'https://imashnujnoto.com/#organization' },
          articleSection: item.category,
          image: item.image_url ? { '@type': 'ImageObject', url: item.image_url } : undefined,
          position: i + 1,
        })),
      },
    ],
  };
}

export default function NoviniPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('Всички');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });
      if (data) setNews(data as NewsItem[]);
      setLoading(false);
    };
    fetchNews();
  }, []);

  useEffect(() => {
    document.title = 'Новини | ТАВОРА ЕООД — Дигитален маркетинг Велико Търново';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Новини, обновления и анонси от ТАВОРА ЕООД — дигитален маркетинг агенция във Велико Търново. SEO, реклами, видео и нови клиенти.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/novini');

    const id = 'schema-novini';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    if (news.length > 0) {
      el.textContent = JSON.stringify(buildNewsSchema(news));
    }

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [news]);

  const filtered = filterCat === 'Всички' ? news : news.filter((n) => n.category === filterCat);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      {/* Hero */}
      <section className="px-4 md:px-16 pt-14 pb-10 md:pt-20 md:pb-14 max-w-6xl mx-auto">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-8">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">Новини</span>
        </nav>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Новини & Обновления</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Последното от
          <br />
          <span className="italic text-[#0A2540]">ТАВОРА ЕООД.</span>
        </h1>
        <p className="text-sm text-[#1C1C1E]/65 max-w-lg leading-relaxed">
          Нови клиенти, резултати, услуги и актуализации от екипа. Всичко, което се случва в агенцията.
        </p>
      </section>

      {/* Category filter */}
      <div className="px-4 md:px-16 max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-1.5 rounded-full text-xs border transition-all cursor-pointer whitespace-nowrap ${
                filterCat === cat
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'border-[#1C1C1E]/12 text-[#1C1C1E]/65 hover:border-[#0A2540]/25 hover:text-[#0A2540]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News grid */}
      <div className="px-4 md:px-16 max-w-6xl mx-auto pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#0A2540]/20 border-t-[#0A2540] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <i className="ri-newspaper-line text-[#1C1C1E]/15 text-4xl mb-4 block" />
            <p className="text-sm text-[#1C1C1E]/65">Няма новини в тази категория.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item, i) => (
              <article
                key={item.id}
                itemScope
                itemType="https://schema.org/BlogPosting"
                className={`group rounded-2xl border border-[#1C1C1E]/8 bg-white overflow-hidden hover:-translate-y-0.5 transition-all duration-300 ${i === 0 && filterCat === 'Всички' ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                {item.image_url && (
                  <div className={`w-full overflow-hidden ${i === 0 && filterCat === 'Всички' ? 'h-52 md:h-64' : 'h-44'}`}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      itemProp="image"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span itemProp="articleSection" className="text-[10px] px-2.5 py-1 rounded-full border border-[#0A2540]/15 text-[#0A2540]/60 whitespace-nowrap">{item.category}</span>
                    <time itemProp="datePublished" dateTime={item.date} className="text-[10px] text-[#1C1C1E]/70">{new Date(item.date).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  </div>
                  <h2 itemProp="headline" className="text-base font-medium text-[#1C1C1E] mb-2 leading-snug group-hover:text-[#0A2540] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title}
                  </h2>
                  <p itemProp="description" className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3">{item.summary}</p>

                  {item.content && (
                    <>
                      {expanded === item.id && (
                        <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-3 border-t border-[#1C1C1E]/6 pt-3">{item.content}</p>
                      )}
                      <button
                        onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                        className="text-xs text-[#0A2540]/60 hover:text-[#0A2540] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {expanded === item.id ? 'Скрий' : 'Прочети повече'}
                        <i className={expanded === item.id ? 'ri-arrow-up-s-line text-sm' : 'ri-arrow-down-s-line text-sm'} />
                      </button>
                    </>
                  )}
                </div>
                <meta itemProp="author" content="ТАВОРА ЕООД" />
                <meta itemProp="publisher" content="ТАВОРА ЕООД" />
              </article>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="bg-[#F7F6F3] border-t border-[#1C1C1E]/8 px-4 md:px-16 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Искате да работим заедно?
            </h3>
            <p className="text-sm text-[#1C1C1E]/65">Консултацията е 50 € — реална работа, не разговор.</p>
          </div>
          <Link to="/kontakt" className="px-6 py-3 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap">
            Поискайте оферта →
          </Link>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
