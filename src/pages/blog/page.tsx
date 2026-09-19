import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const BLOG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://imashnujnoto.com/blog#page',
  name: 'SEO Блог — Дигитален маркетинг Велико Търново | ТАВОРА ЕООД',
  description: 'Практически статии за SEO, реклама и дигитален маркетинг за бизнеси от Велико Търново. Реални стратегии, реални резултати.',
  url: 'https://imashnujnoto.com/blog',
  publisher: {
    '@type': 'Organization',
    name: 'ТАВОРА ЕООД',
    url: 'https://imashnujnoto.com',
  },
  inLanguage: 'bg',
};

const ARTICLES = [
  {
    id: 'gorski-borovinki-seo',
    slug: '/blog/gorski-borovinki-nomer-edno-google',
    category: 'SEO казус',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Как Горски Боровинки стана #1 в Google и ChatGPT за горски боровинки',
    excerpt: 'SEO казус: как gorskiborovinki.com достигна #1 в Google за "горски боровинки" и в ChatGPT за "от кой сайт да си купя горски боровинки". Локално SEO, GEO и е-commerce стратегия.',
    readTime: '10 мин.',
    date: '8 Юли 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Fresh%20wild%20blueberries%20in%20rustic%20wooden%20basket%20forest%20background%20natural%20light%20soft%20focus%20purple%20berries%20organic%20produce%20editorial%20food%20photography%20warm%20tones%20high%20detail&width=800&height=500&seq=blog-gorski-borovinki-card-01&orientation=landscape',
    keywords: ['SEO горски боровинки', 'ChatGPT оптимизация', 'GEO SEO', 'gorskiborovinki.com'],
    featured: false,
  },
  {
    id: 'marketing-plodove',
    slug: '/blog/marketing-za-ecommerce-plodove-tarnovo',
    category: 'Маркетинг',
    categoryColor: 'bg-amber-50 text-amber-700',
    title: 'Маркетинг за плодове от гората — уроци от Горски Боровинки',
    excerpt: 'Реални маркетингови уроци от Горски Боровинки — как да продаваш сезонни, диви продукти онлайн без рекламен бюджет. Viber, SEO, доверие и общност.',
    readTime: '9 мин.',
    date: '8 Юли 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Hand%20picking%20wild%20blueberries%20in%20lush%20green%20Bulgarian%20mountain%20forest%20Stara%20Planina%20natural%20daylight%20close%20up%20authentic%20rustic%20editorial%20photography%20warm%20earth%20tones%20high%20detail%20organic%20harvesting&width=800&height=500&seq=blog-marketing-plodove-card-01&orientation=landscape',
    keywords: ['маркетинг плодове', 'Viber маркетинг', 'сезонен маркетинг', 'Горски Боровинки'],
    featured: false,
  },
  {
    id: 'ecommerce-sezonni',
    slug: '/blog/ecommerce-sezonni-produkti-gorski-borovinki',
    category: 'E-commerce',
    categoryColor: 'bg-teal-50 text-teal-700',
    title: 'E-commerce за сезонни продукти — стратегия от нулата с Горски Боровинки',
    excerpt: 'Как да създадеш e-commerce за сезонен продукт от нулата. Сайт, SEO, плащания, доставка и стратегия за целогодишен трафик — с реален пример.',
    readTime: '11 мин.',
    date: '8 Юли 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Small%20online%20shop%20packaging%20wild%20blueberries%20into%20eco%20friendly%20boxes%20rustic%20wooden%20table%20natural%20light%20smartphone%20showing%20order%20form%20Bulgarian%20mountain%20products%20editorial%20photography%20warm%20tones%20professional%20setup%20no%20text&width=800&height=500&seq=blog-ecommerce-sezonni-card-01&orientation=landscape',
    keywords: ['e-commerce сезонни продукти', 'онлайн магазин храна', 'e-commerce стратегия', 'Горски Боровинки'],
    featured: false,
  },
  {
    id: 'ai-business-blueprint',
    slug: '/blog/ai-business-blueprint-putyat-na-koprinata',
    category: 'AI & Бизнес',
    categoryColor: 'bg-violet-50 text-violet-700',
    title: 'AI Business Blueprint — Пътят на коприната: от AI промптиране до €1,000-8,000/месец',
    excerpt: '11-модулна система за изграждане на дигитален бизнес с AI. Всяка стъпка е тествана върху реални клиентски проекти — Sunrise Food, K-Food, NP Massage Studio.',
    readTime: '14 мин.',
    date: '7 Юли 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=dark%20minimalist%20futuristic%20AI%20business%20blueprint%20digital%20neural%20network%20glowing%20interconnected%20nodes%20deep%20black%20background%20dramatic%20red%20geometric%20accents%20clean%20professional%20cinematic%20atmosphere%20no%20text&width=800&height=500&seq=blog-ai-blueprint-card&orientation=landscape',
    keywords: ['AI бизнес обучение България', 'как да правя пари с изкуствен интелект', 'AI маркетинг'],
    featured: true,
  },
  {
    id: 'perfektnoto-video',
    slug: '/blog/perfektnoto-video-biznes-sistema',
    category: 'Видео продукция',
    categoryColor: 'bg-rose-50 text-rose-700',
    title: 'Перфектното Видео — от идея до готов продукт: пълната система за бизнес видео',
    excerpt: '9 модула + бонус инструменти. От диагностика и стратегия до снимачен ден и монтаж. За предприемачи и маркетолози.',
    readTime: '13 мин.',
    date: '7 Юли 2026',
    author: 'Владимир Атанасов & Натан Петков',
    image: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20filmmaking%20behind%20the%20scenes%20cinematic%20lighting%20setup%20camera%20on%20tripod%20dramatic%20shadows%20red%20and%20warm%20accent%20lights%20professional%20equipment%20editorial%20photography%20no%20text&width=800&height=500&seq=blog-video-card&orientation=landscape',
    keywords: ['видео маркетинг България', 'бизнес видео продукция', 'видео за бизнес обучение'],
    featured: false,
  },
  {
    id: 'marketing-basics',
    slug: '/blog/marketing-basics-palna-sistema',
    category: 'Маркетинг',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Marketing Basics — от основа до скалиране: пълната маркетинг система за бизнес',
    excerpt: '20 модула в 4 групи: позициониране, присъствие, трафик и превръщане. Системата, която всяка фирма трябва да има.',
    readTime: '12 мин.',
    date: '7 Юли 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=modern%20marketing%20strategy%20planning%20whiteboard%20with%20diagrams%20funnel%20charts%20sticky%20notes%20professional%20team%20brainstorming%20clean%20minimalist%20office%20bright%20natural%20light%20analytical%20business%20growth%20concepts%20editorial%20photography%20no%20text&width=800&height=500&seq=blog-marketing-card&orientation=landscape',
    keywords: ['маркетинг обучение България', 'маркетинг стратегия за бизнес', 'дигитален маркетинг система'],
    featured: false,
  },
  {
    id: 'digitalen-marketing-vt',
    slug: '/digitalen-marketing-veliko-tarnovo',
    category: 'Дигитален маркетинг',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Дигитален маркетинг Велико Търново — пълно ръководство 2026',
    excerpt: 'Как да изградите дигитално присъствие в Търново от нулата — SEO, реклами, видео и GEO за AI търсачки. Реални примери и цени.',
    readTime: '10 мин.',
    date: '28 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=digital%20marketing%20strategy%20Veliko%20Tarnovo%20Bulgaria%20professional%20office%20modern%20workspace%20analytics%20screens%20charts%20growth%20metrics%20clean%20minimal%20white%20background&width=800&height=500&seq=blog-dm-vt&orientation=landscape',
    keywords: ['дигитален маркетинг', 'Велико Търново', 'маркетинг агенция'],
    featured: true,
  },
  {
    id: 'reklama-vt',
    slug: '/blog-reklama-vt',
    category: 'Реклама',
    categoryColor: 'bg-orange-50 text-orange-700',
    title: 'Как да рекламирам бизнеса си във Велико Търново?',
    excerpt: 'Meta, Google, TikTok — кои платформи работят за местни бизнеси в Търново, какъв бюджет и как да избегнете грешките.',
    readTime: '8 мин.',
    date: '24 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Facebook%20Google%20TikTok%20advertising%20campaign%20dashboard%20analytics%20local%20business%20Bulgaria%20clean%20minimal%20light%20background%20professional&width=800&height=500&seq=blog-reklama-vt-card&orientation=landscape',
    keywords: ['реклама', 'Велико Търново', 'Facebook реклама'],
    featured: false,
  },
  {
    id: 'seo-vt',
    slug: '/blog-seo-vt',
    category: 'SEO',
    categoryColor: 'bg-sky-50 text-sky-700',
    title: 'Защо SEO е важно за малкия бизнес в Търново?',
    excerpt: 'Как SEO оптимизацията помага на малките бизнеси в Търново да се класират на първа страница в Google без да харчат за реклами.',
    readTime: '6 мин.',
    date: '20 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=SEO%20optimization%20search%20engine%20ranking%20Google%20first%20page%20small%20business%20Bulgaria%20clean%20minimal%20white%20background%20charts%20keywords&width=800&height=500&seq=blog-seo-vt-card&orientation=landscape',
    keywords: ['SEO', 'Велико Търново', 'Google класиране'],
    featured: false,
  },
  {
    id: 'geo-ai',
    slug: '/blog/geo-ai-tarnovo',
    category: 'GEO & AI',
    categoryColor: 'bg-violet-50 text-violet-700',
    title: 'GEO оптимизация — как да сте #1 в ChatGPT и Perplexity',
    excerpt: 'AI търсачките вече отговарят вместо Google. Как да оптимизирате сайта си за ChatGPT, Perplexity и Google AI Overview.',
    readTime: '7 мин.',
    date: '15 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=AI%20search%20engine%20optimization%20ChatGPT%20Perplexity%20GEO%20generative%20engine%20optimization%20futuristic%20clean%20minimal%20white%20background%20technology&width=800&height=500&seq=blog-geo-ai&orientation=landscape',
    keywords: ['GEO', 'AI оптимизация', 'ChatGPT'],
    featured: false,
  },
  {
    id: 'video-marketing',
    slug: '/video-produkciya-veliko-tarnovo',
    category: 'Видео',
    categoryColor: 'bg-rose-50 text-rose-700',
    title: 'Видео маркетинг за бизнеси в Търново — защо работи?',
    excerpt: 'Видеото конвертира 3 пъти по-добре от текст. Как да използвате видео продукция за да привлечете клиенти в Търново.',
    readTime: '5 мин.',
    date: '10 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20filming%20camera%20crew%20business%20marketing%20Veliko%20Tarnovo%20Bulgaria%20clean%20minimal%20studio%20setup&width=800&height=500&seq=blog-video-mkt&orientation=landscape',
    keywords: ['видео маркетинг', 'видео продукция', 'Велико Търново'],
    featured: false,
  },
  {
    id: 'sait-vt',
    slug: '/blog/izrabotka-na-sait-vt',
    category: 'Уеб дизайн',
    categoryColor: 'bg-teal-50 text-teal-700',
    title: 'Изработка на сайт Велико Търново — колко струва и какво да очаквате',
    excerpt: 'Цени, срокове и какво включва изработката на сайт за бизнес в Търново. Разлика между евтин и ефективен сайт.',
    readTime: '6 мин.',
    date: '5 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=web%20design%20development%20website%20creation%20laptop%20screen%20modern%20UI%20design%20clean%20minimal%20white%20background%20professional%20workspace&width=800&height=500&seq=blog-sait-vt&orientation=landscape',
    keywords: ['изработка на сайт', 'Велико Търново', 'уеб дизайн'],
    featured: false,
  },
  {
    id: 'google-business',
    slug: '/blog/google-business-vt',
    category: 'Локално SEO',
    categoryColor: 'bg-amber-50 text-amber-700',
    title: 'Google Business Profile — задължително за всеки бизнес в Търново',
    excerpt: 'Как да настроите Google Business Profile правилно и да се появявате в картата при търсения за Велико Търново.',
    readTime: '5 мин.',
    date: '1 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Google%20Business%20Profile%20local%20SEO%20map%20listing%20Veliko%20Tarnovo%20Bulgaria%20smartphone%20screen%20clean%20minimal%20white%20background&width=800&height=500&seq=blog-gbp&orientation=landscape',
    keywords: ['Google Business', 'локално SEO', 'Велико Търново'],
    featured: false,
  },
  {
    id: 'seo-2026',
    slug: '/blog/seo-optimizaciya-tarnovo-2026',
    category: 'SEO',
    categoryColor: 'bg-sky-50 text-sky-700',
    title: 'SEO оптимизация Велико Търново 2026: пълно ръководство',
    excerpt: 'Как да класирате бизнеса си на #1 в Google за Търново в 2026. Технически SEO, GEO за AI търсачки, LocalBusiness Schema и реални case studies с верифицируеми резултати.',
    readTime: '12 мин.',
    date: '28 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=SEO%20optimization%202026%20search%20engine%20ranking%20Google%20analytics%20dashboard%20professional%20workspace%20clean%20minimal%20white%20background%20charts%20data%20Bulgaria&width=800&height=500&seq=blog-seo-2026-card&orientation=landscape',
    keywords: ['SEO оптимизация', 'Велико Търново', '2026'],
    featured: false,
  },
  {
    id: 'izrabotka-sait-tarnovo',
    slug: '/blog/izrabotka-na-sait-tarnovo',
    category: 'Уеб дизайн',
    categoryColor: 'bg-teal-50 text-teal-700',
    title: 'Изработка на сайт Велико Търново 2026 — цени, срокове и какво да очаквате',
    excerpt: 'Реални цени от 999 €, case studies с K-Food и Sunrise Food. Защо сео от старт е задължително, 5 грешки които правят бизнесите и как да изберете агенция в Търново.',
    readTime: '10 мин.',
    date: '28 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=web%20design%20development%20website%20creation%20laptop%20screen%20modern%20UI%20design%20clean%20minimal%20white%20background%20professional%20workspace%20Bulgaria%202026&width=800&height=500&seq=blog-sait-tarnovo-card&orientation=landscape',
    keywords: ['изработка на сайт', 'Велико Търново', 'уеб дизайн'],
    featured: false,
  },
  {
    id: 'video-npo',
    slug: '/blog/video-npo-tarnovo',
    category: 'Видео',
    categoryColor: 'bg-rose-50 text-rose-700',
    title: 'Видео за НПО Търново — как да разкажете каузата си и да достигнете милиони',
    excerpt: 'Реални примери с Академика 245 и Амалипе — милиони импресии. 4 стъпки за успешно НПО видео, 5 грешки които организациите правят и как да изберете агенция за видео за НПО в Търново.',
    readTime: '9 мин.',
    date: '28 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=professional%20video%20production%20NGO%20social%20campaign%20filming%20crew%20Bulgaria%20Veliko%20Tarnovo%20documentary%20camera%20equipment%20outdoor%20authentic%20storytelling%20warm%20light&width=800&height=500&seq=blog-npo-video-card&orientation=landscape',
    keywords: ['видео за НПО', 'Велико Търново', 'видео продукция'],
    featured: false,
  },
  {
    id: 'meta-ads',
    slug: '/blog/meta-reklami-tarnovo',
    category: 'Meta реклами',
    categoryColor: 'bg-orange-50 text-orange-700',
    title: 'Как да правим Meta реклами за бизнес в Търново — реални примери',
    excerpt: 'Пълно ръководство за Facebook + Instagram реклами за локален бизнес в Търново. Реални примери, таргетиране, бюджети и 5-те грешки, които правят бизнесите.',
    readTime: '8 мин.',
    date: '28 Апр 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Meta%20Facebook%20Instagram%20advertising%20campaign%20small%20business%20budget%20optimization%20targeting%20analytics%20clean%20minimal%20white%20background%20professional&width=800&height=500&seq=blog-meta-ads&orientation=landscape',
    keywords: ['Meta реклами', 'Facebook реклама', 'малък бизнес'],
    featured: false,
  },
  {
    id: 'bezplaten-seo',
    slug: '/blog/bezplaten-seo-nomer-edno-google',
    category: 'SEO',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Безплатен SEO за номер 1 в Google — 8 тактики за бизнес в Търново',
    excerpt: 'Не винаги трябва да си платиш за номер 1 в Google. 8 безплатни SEO тактики — Google Business Profile, Schema.org, GSC, вътрешно свързване. Реални case studies.',
    readTime: '15 мин.',
    date: '5 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=free%20SEO%20optimization%20strategy%20small%20business%20zero%20budget%20Google%20ranking%20organic%20traffic%20growth%20green%20charts%20clean%20minimal%20white%20background%20professional&width=800&height=500&seq=blog-bezplaten-seo-card&orientation=landscape',
    keywords: ['безплатен SEO', 'SEO Търново', 'Google Business Profile'],
    featured: false,
  },
  {
    id: 'tiktok-youtube',
    slug: '/blog/tiktok-youtube-reklama-tarnovo',
    category: 'Видео',
    categoryColor: 'bg-rose-50 text-rose-700',
    title: 'TikTok и YouTube реклами за бизнес в Търново — пълно ръководство 2026',
    excerpt: 'Видеото е #1 ранкинг фактор. TikTok + YouTube стратегия за бизнес в Търново — органично съдържание, платени реклами, идеи и реални примери.',
    readTime: '14 мин.',
    date: '5 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=TikTok%20YouTube%20social%20media%20video%20marketing%20smartphone%20filming%20content%20creator%20clean%20minimal%20white%20background%20professional%20Bulgaria&width=800&height=500&seq=blog-tiktok-youtube-card&orientation=landscape',
    keywords: ['TikTok реклами', 'YouTube реклами', 'видео маркетинг Търново'],
    featured: false,
  },
  {
    id: 'video-marketing-biznes',
    slug: '/blog/video-marketing-biznes-tarnovo',
    category: 'Видео',
    categoryColor: 'bg-rose-50 text-rose-700',
    title: 'Видео маркетинг за бизнеси в Търново — стратегия за доминиране 2026',
    excerpt: 'TikTok, Reels, Shorts, YouTube Long — пълна стратегия за видео маркетинг. K-Food +280% трафик, Thalysta +190% продажби. 5 грешки и как да ги избегнете.',
    readTime: '13 мин.',
    date: '5 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=video%20marketing%20strategy%20professional%20camera%20filming%20content%20creation%20studio%20clean%20minimal%20white%20background%20Bulgaria%20business%202026&width=800&height=500&seq=blog-video-marketing-biznes-card&orientation=landscape',
    keywords: ['видео маркетинг', 'видео продукция Търново', 'TikTok бизнес'],
    featured: false,
  },
  {
    id: 'kak-da-izberete-agenciya',
    slug: '/blog/kak-da-izberete-agenciya-tarnovo',
    category: 'Маркетинг агенция',
    categoryColor: 'bg-sky-50 text-sky-700',
    title: 'Как да изберете маркетинг агенция в Търново — честен гид 2026',
    excerpt: '8 червени флага и 8 зелени флага при избор на агенция. Сравнение на 5 агенции в Търново. Цени, срокове и как да не изгорите.',
    readTime: '12 мин.',
    date: '5 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=marketing%20agency%20comparison%20checklist%20professional%20office%20consultation%20meeting%20clean%20minimal%20white%20background%20charts%20analysis&width=800&height=500&seq=blog-agenciya-card&orientation=landscape',
    keywords: ['маркетинг агенция Търново', 'SEO агенция', 'как да избера агенция'],
    featured: false,
  },
  {
    id: 'ecommerce-tarnovo',
    slug: '/blog/ecommerce-tarnovo-2026',
    category: 'E-commerce',
    categoryColor: 'bg-teal-50 text-teal-700',
    title: 'E-commerce стратегия за Търново 2026 — онлайн магазин от нулата',
    excerpt: 'Как да продавате онлайн от Велико Търново. Thalysta +340% продажби, Sunrise Food #1 в Google. SEO за e-commerce, реклами, плащания, доставка.',
    readTime: '13 мин.',
    date: '5 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=e-commerce%20online%20store%20shopping%20cart%20laptop%20product%20catalog%20digital%20marketing%20Bulgaria%20clean%20minimal%20white%20background%20professional&width=800&height=500&seq=blog-ecommerce-card&orientation=landscape',
    keywords: ['e-commerce', 'онлайн магазин', 'Велико Търново'],
    featured: false,
  },
  {
    id: 'seo-restoranti',
    slug: '/blog/seo-restoranti-veliko-tarnovo',
    category: 'SEO',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'SEO за ресторанти Велико Търново — #1 в Google без реклами',
    excerpt: 'Как ресторанти в Търново да се класират на #1. Google Business Profile, ключови думи, Schema.org за ресторант, рецензии и реални case studies.',
    readTime: '12 мин.',
    date: '5 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=elegant%20Bulgarian%20restaurant%20interior%20warm%20lighting%20traditional%20cuisine%20table%20setting%20wooden%20furniture%20cozy%20atmosphere%20Veliko%20Tarnovo%20old%20town%20ambiance%20professional%20photography&width=800&height=500&seq=blog-seo-restoranti-card&orientation=landscape',
    keywords: ['SEO ресторанти', 'Велико Търново', 'локално SEO'],
    featured: false,
  },
  {
    id: 'kolko-struva',
    slug: '/blog/kolko-struva-digitalen-marketing-tarnovo',
    category: 'Цени',
    categoryColor: 'bg-orange-50 text-orange-700',
    title: 'Колко струва дигитален маркетинг в Търново 2026 — прозрачни цени на всички агенции',
    excerpt: 'Пълен price sheet за SEO, реклами, сайтове и видео в Търново 2026. Сравнение между ТАВОРА, ТОРО РАНК, CreateX и други. Без скрити такси.',
    readTime: '14 мин.',
    date: '6 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=digital%20marketing%20agency%20transparent%20pricing%20comparison%20table%20professional%20clean%20minimal%20white%20background%20euro%20prices%20budget%20spreadsheet%20modern%20office%20Bulgaria%202026&width=800&height=500&seq=blog-ceni-tarnovo&orientation=landscape',
    keywords: ['колко струва SEO Търново', 'цена маркетинг агенция', 'изработка на сайт цена'],
    featured: false,
  },
  {
    id: 'ai-tursachki',
    slug: '/blog/ai-tursachki-biznes-tarnovo',
    category: 'GEO & AI',
    categoryColor: 'bg-violet-50 text-violet-700',
    title: 'AI търсачки и бизнес в Търново 2026 — GEO оптимизация пълно ръководство',
    excerpt: 'Как ChatGPT, Perplexity и Google AI Overview променят бизнеса в Търново. GEO оптимизация — Entity statements, Schema.org и реални стратегии.',
    readTime: '16 мин.',
    date: '6 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=AI%20search%20engine%20optimization%20ChatGPT%20Perplexity%20GEO%20generative%20engine%20futuristic%20technology%20digital%20brain%20neural%20network%20clean%20minimal%20white%20background%20professional%20Bulgaria%202026&width=800&height=500&seq=blog-ai-tursachki&orientation=landscape',
    keywords: ['AI търсачки Търново', 'GEO оптимизация', 'ChatGPT бизнес'],
    featured: false,
  },
  {
    id: 'gbp-vs-sait',
    slug: '/blog/google-business-vs-sait-tarnovo',
    category: 'Локално SEO',
    categoryColor: 'bg-amber-50 text-amber-700',
    title: 'Google Business Profile vs уеб сайт за бизнес в Търново — кое печели 2026?',
    excerpt: 'Провокативно сравнение: GBP или сайт — кое е по-важно за бизнес в Търново? Реални данни, цени и 4 сценария според бюджета.',
    readTime: '13 мин.',
    date: '6 Май 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Google%20Business%20Profile%20vs%20website%20comparison%20smartphone%20and%20laptop%20side%20by%20side%20local%20SEO%20strategy%20clean%20minimal%20white%20background%20modern%20technology%20professional%20Bulgaria%202026&width=800&height=500&seq=blog-gbp-vs&orientation=landscape',
    keywords: ['Google Business Profile Търново', 'уеб сайт vs GBP', 'локално SEO'],
    featured: false,
  },
  {
    id: 'lokalen-biznes-online',
    slug: '/blog/lokalen-biznes-ustoichivo-online-prisastvie',
    category: 'Локален бизнес',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Как локалните бизнеси могат да изградят устойчиво онлайн присъствие: пример от уелнес индустрията',
    excerpt: 'Практическо ръководство за изграждане на устойчиво онлайн присъствие за локален бизнес, базирано на опит с NP Massage Studio — предизвикателства, локално SEO и Google Business Profile.',
    readTime: '10 мин.',
    date: '10 Юни 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=small%20local%20business%20sustainable%20online%20presence%20digital%20strategy%20wellness%20industry%20massage%20studio%20warm%20natural%20light%20clean%20minimal%20white%20background%20professional%20photography%20Bulgaria&width=800&height=500&seq=blog-lokalen-biznes-card&orientation=landscape',
    keywords: ['локален бизнес', 'устойчиво онлайн присъствие', 'уелнес индустрия'],
    featured: false,
  },
  {
    id: 'marketing-masazhni',
    slug: '/blog/marketing-nablyudeniya-masazhni-uslugi',
    category: 'Уелнес индустрия',
    categoryColor: 'bg-teal-50 text-teal-700',
    title: 'Какво научихме от работата с бизнес в сферата на масажите и уелнес услугите',
    excerpt: 'Реални маркетингови наблюдения от уелнес сектора — как клиентите избират услуги, как търсят в Google, ролята на доверието и отзивите, с примери от NP Massage Studio.',
    readTime: '9 мин.',
    date: '11 Юни 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=professional%20massage%20studio%20wellness%20spa%20interior%20warm%20ambient%20lighting%20peaceful%20atmosphere%20clean%20minimal%20decor%20natural%20tones%20soft%20textures%20Bulgaria&width=800&height=500&seq=blog-masazhni-uslugi-card&orientation=landscape',
    keywords: ['маркетинг за масажи', 'уелнес услуги', 'потребителско поведение'],
    featured: false,
  },
  {
    id: 'lokalen-vs-masov',
    slug: '/blog/lokalen-vs-masov-marketing',
    category: 'Локален маркетинг',
    categoryColor: 'bg-amber-50 text-amber-700',
    title: 'Защо локалният маркетинг е различен от масовия маркетинг',
    excerpt: 'Фундаменталните разлики между национални кампании и локален маркетинг. Локално SEO, Google Maps, потребителско намерение — с казус от работата с NP Massage Studio.',
    readTime: '10 мин.',
    date: '12 Юни 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=local%20marketing%20vs%20national%20mass%20marketing%20comparison%20illustration%20contrasting%20approaches%20small%20business%20local%20storefront%20vs%20large%20billboard%20digital%20screen%20analytical%20concept%20clean%20minimal%20white%20background&width=800&height=500&seq=blog-lokalen-vs-masov-card&orientation=landscape',
    keywords: ['локален маркетинг', 'масов маркетинг', 'Google Maps'],
    featured: false,
  },
  {
    id: 'photo-tarnovo-nomer-edno',
    slug: '/blog/photo-tarnovo-street-portrait-nomer-edno',
    category: 'SEO казус',
    categoryColor: 'bg-amber-50 text-amber-700',
    title: 'Как Photo Tarnovo стана #1 в Google за street portrait фотография в Търново',
    excerpt: 'SEO казус: как Photo Tarnovo — street portrait фотограф на Царевец — стигна до #1 в Google за "photo tarnovo" и "street portrait Veliko Tarnovo" без рекламен бюджет.',
    readTime: '9 мин.',
    date: '20 Юни 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=Tsarevets%20Fortress%20Veliko%20Tarnovo%20Bulgaria%20street%20portrait%20photographer%20golden%20hour%20light%20ancient%20stone%20walls%20traveler%20portrait%20authentic%20moment%20professional%20camera%20setup&width=800&height=500&seq=blog-photo-tarnovo-1-card&orientation=landscape',
    keywords: ['Photo Tarnovo', 'street portrait', 'Велико Търново', 'SEO казус'],
    featured: false,
  },
  {
    id: 'marketing-za-fotografi',
    slug: '/blog/marketing-za-fotografi-tarnovo',
    category: 'Фотография',
    categoryColor: 'bg-rose-50 text-rose-700',
    title: 'Маркетинг за фотографи: какво научихме от работата с Photo Tarnovo за привличане на туристи',
    excerpt: 'Реални маркетингови уроци от Photo Tarnovo — как локация, моментална доставка и дигитална стратегия привличат туристи от цял свят без платена реклама.',
    readTime: '8 мин.',
    date: '20 Юни 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=tourist%20getting%20street%20portrait%20taken%20at%20Tsarevets%20Fortress%20Veliko%20Tarnovo%20Bulgaria%20professional%20photographer%20golden%20hour%20light%20ancient%20stone%20walls%20authentic%20travel%20moment%20candid%20photography&width=800&height=500&seq=blog-marketing-fotografi-card&orientation=landscape',
    keywords: ['маркетинг за фотографи', 'Photo Tarnovo', 'туристически бизнес', 'привличане на клиенти'],
    featured: false,
  },
  {
    id: 'turisticheski-sait',
    slug: '/blog/turisticheski-biznes-optimiziran-sait-tarnovo',
    category: 'Уеб дизайн',
    categoryColor: 'bg-teal-50 text-teal-700',
    title: 'Защо локалният туристически бизнес се нуждае от оптимизиран сайт: примерът на Photo Tarnovo',
    excerpt: 'Как оптимизираният сайт на Photo Tarnovo превърна street portrait фотографията на Царевец в #1 резултат в Google. Техническо SEO, Schema.org и двуезично съдържание.',
    readTime: '9 мин.',
    date: '20 Юни 2026',
    author: 'Владимир Атанасов',
    image: 'https://readdy.ai/api/search-image?query=modern%20optimized%20website%20design%20for%20local%20tourism%20business%20laptop%20screen%20showing%20photographer%20portfolio%20website%20Tsarevets%20Fortress%20Bulgaria%20professional%20clean%20layout%20responsive%20design%20warm%20ambient%20lighting&width=800&height=500&seq=blog-turisticheski-sait-card&orientation=landscape',
    keywords: ['туристически бизнес', 'оптимизиран сайт', 'Photo Tarnovo', 'Schema.org'],
    featured: false,
  },
];

const CATEGORIES = ['Всички', 'AI & Бизнес', 'Маркетинг', 'SEO', 'Реклама', 'Дигитален маркетинг', 'Видео', 'GEO & AI', 'Уеб дизайн', 'Локално SEO', 'Meta реклами', 'Маркетинг агенция', 'E-commerce', 'Цени', 'Локален бизнес', 'Уелнес индустрия', 'Локален маркетинг', 'SEO казус', 'Фотография'];

export default function BlogPage() {
  useEffect(() => {
    const id = 'schema-blog-page';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(BLOG_SCHEMA);

    document.title = 'SEO Блог — Дигитален маркетинг Велико Търново | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Практически статии за SEO, реклама и дигитален маркетинг за бизнеси от Велико Търново. Реални стратегии, реални резултати от ТАВОРА ЕООД.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog');

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, []);

  const featured = ARTICLES.find((a) => a.featured);
  const rest = ARTICLES.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      {/* Hero */}
      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-20 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60">SEO Блог · ТАВОРА ЕООД</span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-light text-[#1C1C1E] leading-tight mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Дигитален маркетинг
            <br />
            <span className="italic text-[#0A2540]">Велико Търново</span>
          </h1>
          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed">
            Практически статии за SEO, реклама и дигитален маркетинг. Всяка статия е реален шанс за ранк в Google — за вас и за нас.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 md:px-16 py-12 md:py-16">

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs border transition-all cursor-pointer whitespace-nowrap ${
                cat === 'Всички'
                  ? 'bg-[#0A2540] text-white border-[#0A2540]'
                  : 'border-[#1C1C1E]/12 text-[#1C1C1E]/65 hover:border-[#0A2540]/30 hover:text-[#0A2540]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <Link to={featured.slug} className="block mb-10 group cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2 rounded-2xl border border-[#1C1C1E]/8 overflow-hidden hover:border-[#0A2540]/20 transition-all">
              <div className="w-full h-[240px] lg:h-[340px] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="p-5 md:p-10 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${featured.categoryColor}`}>
                    {featured.category}
                  </span>
                  <span className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase">Препоръчано</span>
                </div>
                <h2
                  className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-3 group-hover:text-[#0A2540] transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {featured.title}
                </h2>
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[#1C1C1E]/70">
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime} четене</span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm text-[#0A2540] font-medium">
                  Прочети статията
                  <i className="ri-arrow-right-line text-sm group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Articles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((article) => (
            <Link
              key={article.id}
              to={article.slug}
              className="group flex flex-col rounded-2xl border border-[#1C1C1E]/8 overflow-hidden hover:border-[#0A2540]/20 transition-all cursor-pointer bg-white"
            >
              <div className="w-full h-[180px] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-4 md:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${article.categoryColor}`}>
                    {article.category}
                  </span>
                </div>
                <h3
                  className="text-base font-light text-[#1C1C1E] leading-snug mb-2 group-hover:text-[#0A2540] transition-colors flex-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {article.title}
                </h3>
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between text-[10px] text-[#1C1C1E]/70 mt-auto">
                  <span>{article.date}</span>
                  <span>{article.readTime} четене</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sitemap-style link block — hidden on mobile to reduce scroll */}
        <section className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#1C1C1E]/6 hidden md:block">
          <div className="text-[10px] text-[#1C1C1E]/70 tracking-widest uppercase mb-4">Всички статии</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ARTICLES.map((article) => (
              <Link
                key={article.id}
                to={article.slug}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-[#1C1C1E]/6 hover:border-[#0A2540]/15 hover:bg-[#F9F9F7] transition-all group"
              >
                <i className="ri-arrow-right-line text-[10px] text-[#0A2540]/65 group-hover:text-[#0A2540]/60 transition-colors shrink-0" />
                <span className="text-xs text-[#1C1C1E]/65 group-hover:text-[#1C1C1E] transition-colors leading-snug">{article.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO text block — hidden on mobile */}
        <section className="mt-10 md:mt-16 pt-6 md:pt-10 border-t border-[#1C1C1E]/6 hidden md:block">
          <div className="max-w-3xl">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Дигитален маркетинг за бизнеси от <strong>Велико Търново</strong>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-3">
              ТАВОРА ЕООД е маркетинг агенция от Велико Търново, специализирана в <strong>SEO оптимизация</strong>, рекламни кампании и видео продукция. Работим с малки и средни бизнеси от Търново и цяла България.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-3">
              В този блог публикуваме практически статии за <strong>дигитален маркетинг Велико Търново</strong> — реални стратегии, реални резултати. Без теория, без bullshit.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Ако искате да сте #1 в Google за вашата ниша в Търново — <Link to="/kontakt" className="text-[#0A2540] hover:underline">свържете се с нас</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-8 md:mt-12 p-5 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за ранк #1?</div>
              <div
                className="text-2xl md:text-3xl font-light leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Консултация за дигитален маркетинг
                <br />
                <span className="italic text-white/60">Велико Търново — 50 €</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/kontakt"
                className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
              >
                Поискайте консултация →
              </Link>
              <Link
                to="/uslugi"
                className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
              >
                Вижте услугите
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SharedFooter />
    </div>
  );
}