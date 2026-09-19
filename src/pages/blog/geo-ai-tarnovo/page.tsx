import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const today = new Date().toISOString().split('T')[0];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/geo-ai-tarnovo#article',
      headline: 'GEO оптимизация — как да сте #1 в ChatGPT за Велико Търново 2026',
      description: 'Как да сте #1 в ChatGPT, Perplexity и Gemini за Велико Търново. GEO оптимизация с доказани резултати — K-Food вече е там. Практическо ръководство от ТАВОРА ЕООД.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' }, telephone: '+359885189724', email: 'tavoraagency@gmail.com' },
      datePublished: '2026-04-15',
      dateModified: today,
      inLanguage: 'bg',
      url: 'https://imashnujnoto.com/blog/geo-ai-tarnovo',
      wordCount: 1900,
      timeRequired: 'PT7M',
      image: { '@type': 'ImageObject', url: 'https://readdy.ai/api/search-image?query=AI%20artificial%20intelligence%20ChatGPT%20search%20engine%20optimization%20GEO%20generative%20engine%20futuristic%20technology%20clean%20minimal%20white%20background%20digital%20marketing%20Bulgaria&width=1200&height=630&seq=blog-geo-ai-hero&orientation=landscape', width: 1200, height: 630 },
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/geo-ai-tarnovo' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
          { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
          { '@type': 'ListItem', position: 3, name: 'GEO оптимизация Търново', item: 'https://imashnujnoto.com/blog/geo-ai-tarnovo' },
        ],
      },
      keywords: 'GEO оптимизация, ChatGPT оптимизация, AI търсачки, Perplexity SEO, дигитален маркетинг Велико Търново',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Какво е GEO оптимизация?', acceptedAnswer: { '@type': 'Answer', text: 'GEO (Generative Engine Optimization) е оптимизация на съдържанието за AI търсачки като ChatGPT, Perplexity и Gemini. За разлика от традиционното SEO, GEO се фокусира върху това AI системите да препоръчват вашия бизнес в отговорите си.' } },
        { '@type': 'Question', name: 'Защо GEO е важно за бизнеси в Търново?', acceptedAnswer: { '@type': 'Answer', text: 'Все повече хора питат AI: "Кой е най-добрият ресторант в Търново?" или "Препоръчай ми маркетинг агенция в Търново". Ако вашият бизнес не е оптимизиран за AI отговори, пропускате нов и бързо растящ канал за клиенти.' } },
        { '@type': 'Question', name: 'Как да оптимизирам бизнеса си за ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'Ключовите стъпки: 1) Структурирани данни Schema.org, 2) Ясно и конкретно съдържание с факти и цифри, 3) Споменавания в авторитетни източници, 4) Актуален Google Business Profile, 5) FAQ секции с директни отговори.' } },
        { '@type': 'Question', name: 'Колко време отнема GEO оптимизацията?', acceptedAnswer: { '@type': 'Answer', text: 'Първите резултати в AI търсачките се виждат за 2–4 седмици при правилна оптимизация. Това е значително по-бързо от класическото SEO, което отнема 2–6 месеца. GEO е все още ниско конкурентно поле.' } },
        { '@type': 'Question', name: 'Може ли малък бизнес да се появи в ChatGPT?', acceptedAnswer: { '@type': 'Answer', text: 'Да, локалните бизнеси имат предимство в GEO. Когато някой пита ChatGPT за услуги в конкретен град, AI търси локални източници. Ако имате правилна Schema.org оптимизация и Google Business Profile, шансът да бъдете цитирани е висок.' } },
      ],
    },
  ],
};

const sections = [
  { id: 'kakvo-e-geo', title: 'Какво е GEO оптимизация?', content: `GEO (Generative Engine Optimization) е новото поле в дигиталния маркетинг — оптимизация за AI търсачки.\n\nДокато традиционното SEO оптимизира за Google, GEO оптимизира за ChatGPT, Perplexity, Gemini и Google AI Overview. Тези системи вече отговарят директно на въпроси, без потребителят да кликва на линкове.\n\nЗа бизнеси в Търново това означава: когато някой пита ChatGPT "Кой е най-добрият маркетинг специалист в Търново?" — вашият бизнес трябва да е в отговора.` },
  { id: 'zashto-vt', title: 'Защо GEO е важно за бизнеси в Търново?', content: `Статистиката е ясна: 40% от потребителите под 35 г. вече използват AI за местни препоръки. Тази цифра расте с 20% на тримесечие.\n\nВ Търново конкуренцията за GEO позиции все още е ниска. Повечето бизнеси дори не знаят какво е GEO. Това е вашият прозорец.\n\n**K-Food Велико Търново** е пример за успешна GEO оптимизация — появява се в отговорите на ChatGPT за "корейска храна Велико Търново". Проверете сами — питайте ChatGPT.` },
  { id: 'razlika-seo-geo', title: 'Разлика между SEO и GEO', content: `**SEO (Search Engine Optimization)** — Оптимизация за Google. Целта е да се появявате на първа страница в резултатите от търсенето. Работи с ключови думи, backlinks и технически оптимизации.\n\n**GEO (Generative Engine Optimization)** — Оптимизация за AI. Целта е AI системите да ви препоръчват в отговорите си. Работи с структурирани данни, авторитетно съдържание и ясни факти.\n\nВажно: SEO и GEO не се изключват взаимно — те се допълват. Добрата SEO оптимизация помага на GEO и обратно.` },
  { id: 'kak-raboti', title: 'Как работи GEO оптимизацията?', content: `AI системите като ChatGPT и Perplexity "четат" интернет и извличат информация от различни източници. За да се появявате в отговорите им, трябва:\n\n**1. Структурирани данни (Schema.org)** — Маркирайте бизнеса си с LocalBusiness, Service, FAQ schema. AI системите обичат структурирани данни.\n\n**2. Ясно и конкретно съдържание** — Пишете директни отговори на въпроси. "ТАВОРА ЕООД е маркетинг агенция в Търново, специализирана в SEO и реклами" е по-добро от "Ние сме водеща агенция".\n\n**3. Факти и цифри** — AI системите предпочитат конкретни данни. "SEO пакетът е 390 €" е по-добро от "конкурентни цени".\n\n**4. Споменавания в авторитетни източници** — Медии, директории, партньорски сайтове. Колкото повече авторитетни сайтове ви споменават, толкова по-вероятно е AI да ви препоръча.` },
  { id: 'prakticheski-saveti', title: 'Практически съвети за GEO в Търново', content: `**Съвет 1: Оптимизирайте Google Business Profile** — AI системите използват GBP данни. Попълнете всичко — описание, категории, снимки, работно време.\n\n**Съвет 2: Пишете FAQ секции** — Въпроси и отговори са идеален формат за AI. "Колко струва SEO в Търново?" с директен отговор.\n\n**Съвет 3: Споменавайте местоположението** — "Велико Търново", "Търновска област", "Горна Оряховица" — конкретни географски маркери помагат на AI да ви асоциира с региона.\n\n**Съвет 4: Актуализирайте съдържанието** — AI системите предпочитат актуална информация. Обновявайте сайта редовно.\n\n**Съвет 5: Изградете авторитет** — Публикувайте в местни медии, участвайте в директории, получавайте споменавания от авторитетни сайтове.` },
  { id: 'rezultati', title: 'Реални GEO резултати от Търново', content: `**K-Food Велико Търново** — Питайте ChatGPT: "Кой е най-добрият корейски ресторант в Търново?" или "Препоръчай ми корейска храна в Търново". K-Food се появява в отговора. Сайт: k-foodvelikotarnovo.com\n\nТова е резултат от комбинация от SEO + GEO оптимизация, направена от ТАВОРА ЕООД. Не е случайно — е стратегия.` },
];

export default function GeoAITarnovoPage() {
  useEffect(() => {
    const id = 'schema-geo-ai';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) { el = document.createElement('script'); el.id = id; el.type = 'application/ld+json'; document.head.appendChild(el); }
    el.textContent = JSON.stringify(SCHEMA);
    document.title = 'GEO оптимизация | #1 в ChatGPT за бизнеса | ТАВОРА';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Как да сте #1 в ChatGPT, Perplexity и Gemini за Велико Търново. GEO оптимизация с доказани резултати — K-Food вече е там. ТАВОРА ЕООД.');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/geo-ai-tarnovo');
    return () => { const e = document.getElementById(id); if (e) e.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden relative">
        <img src="https://readdy.ai/api/search-image?query=AI%20artificial%20intelligence%20ChatGPT%20search%20engine%20optimization%20GEO%20generative%20engine%20futuristic%20technology%20clean%20minimal%20white%20background%20digital%20marketing%20Bulgaria&width=1200&height=630&seq=blog-geo-ai-hero&orientation=landscape" alt="GEO оптимизация за AI търсачки — Велико Търново" title="GEO оптимизация ChatGPT Търново" className="w-full h-full object-cover object-top" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 md:left-16"><span className="text-xs text-white/60 tracking-widest uppercase">Блог · ТАВОРА ЕООД</span></div>
      </div>
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 mb-8 text-xs text-[#1C1C1E]/65">
          <Link to="/" className="hover:text-[#0A2540] transition-colors">Начало</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-[#0A2540] transition-colors">Блог</Link>
          <span>/</span>
          <span className="text-[#1C1C1E]/65">GEO оптимизация Търново</span>
        </nav>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">GEO & AI · Велико Търново</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            GEO оптимизация —
            <br /><span className="italic text-[#0A2540]">как да сте #1 в ChatGPT</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#1C1C1E]/65">
            <span>Владимир Атанасов · ТАВОРА ЕООД</span><span>·</span><span>15 Апр 2026</span><span>·</span><span>7 мин. четене</span>
            <span>·</span><span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-medium">GEO & AI</span>
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] mb-10">
          <div className="text-xs font-medium text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Съдържание</div>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-[#0A2540] hover:underline decoration-dotted cursor-pointer">
                <span className="text-[10px] text-[#1C1C1E]/70 w-4">{i + 1}.</span>{s.title}
              </a>
            ))}
          </div>
        </div>
        <p className="text-base text-[#1C1C1E]/60 leading-relaxed mb-10 border-l-2 border-[#0A2540]/20 pl-4">
          AI търсачките вече отговарят вместо Google. ChatGPT, Perplexity и Gemini препоръчват бизнеси директно — без потребителят да кликва на линк. Ако не сте оптимизирани за тях, пропускате нов канал за клиенти, който расте с 20% на тримесечие. Ето как да сте #1 в AI отговорите за Велико Търново.
        </p>
        <article className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h4 className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <a href={`#${section.id}`} className="hover:text-[#0A2540] transition-colors"><strong>{section.title}</strong></a>
              </h4>
              <div className="space-y-3">
                {section.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('**') && para.includes('**\n')) {
                    const [boldPart, ...rest] = para.split('\n');
                    return (<div key={i}><div className="text-sm font-semibold text-[#1C1C1E] mb-1">{boldPart.replace(/\*\*/g, '')}</div><p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{rest.join(' ')}</p></div>);
                  }
                  return <p key={i} className="text-sm text-[#1C1C1E]/65 leading-relaxed">{para.replace(/\*\*/g, '')}</p>;
                })}
              </div>
            </section>
          ))}
        </article>
        <div className="mt-14 p-6 md:p-8 rounded-2xl bg-[#0F1F35]">
          <div className="text-xs text-white/75 tracking-widest uppercase mb-3">Готови ли сте за GEO?</div>
          <div className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Искате бизнесът ви да е #1 в ChatGPT?</div>
          <p className="text-sm text-white/75 mb-5">K-Food Велико Търново вече е там — проверете. GEO оптимизацията е включена в SEO пакета от 390 €. Консултацията е 50 € и се приспада при договор. Не чакайте конкурентите да ви изпреварят.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/kontakt" className="px-7 py-3.5 bg-white text-[#0F1F35] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium">Поискайте GEO одит →</Link>
            <Link to="/uslugi/seo-geo" className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center">SEO & GEO услуга →</Link>
          </div>
        </div>
        <div className="mt-10">
          <div className="text-xs text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/blog-seo-vt" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Защо SEO е важно за малкия бизнес в Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">6 мин. четене</div>
            </Link>
            <Link to="/blog/google-business-vt" className="p-4 rounded-xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all cursor-pointer group">
              <div className="text-sm font-medium text-[#1C1C1E] group-hover:text-[#0A2540] transition-colors mb-1">Google Business Profile за Търново</div>
              <div className="text-xs text-[#1C1C1E]/65">5 мин. четене</div>
            </Link>
          </div>
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
