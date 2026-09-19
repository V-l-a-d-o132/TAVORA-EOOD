import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/ecommerce-sezonni-produkti-gorski-borovinki#article',
      name: 'E-commerce за сезонни продукти — стратегия от нулата с Горски Боровинки',
      headline: 'E-commerce за сезонни продукти — стратегия от нулата с Горски Боровинки',
      description: 'Как да създадеш e-commerce за сезонен продукт от нулата — с Горски Боровинки като пример. Сайт, SEO, плащания, доставка и стратегия за целогодишен трафик.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-07-08',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/ecommerce-sezonni-produkti-gorski-borovinki',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/ecommerce-sezonni-produkti-gorski-borovinki' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=Small%20online%20shop%20packaging%20wild%20blueberries%20into%20eco%20friendly%20boxes%20rustic%20wooden%20table%20natural%20light%20smartphone%20showing%20order%20form%20Bulgarian%20mountain%20products%20editorial%20photography%20warm%20tones%20professional%20setup%20no%20text&width=1200&height=630&seq=blog-ecommerce-sezonni-hero-01&orientation=landscape',
      articleSection: 'E-commerce',
      keywords: 'e-commerce сезонни продукти, онлайн магазин храна, e-commerce стратегия България, Горски Боровинки, продажби онлайн',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'E-commerce за сезонни продукти', item: 'https://imashnujnoto.com/blog/ecommerce-sezonni-produkti-gorski-borovinki' },
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://imashnujnoto.com/#organization',
      name: 'ТАВОРА ЕООД',
      url: 'https://imashnujnoto.com',
      telephone: '+359885189724',
      email: 'tavoraagency@gmail.com',
    },
  ],
};

const TOC_ITEMS = [
  { id: 'sait', label: 'Сайтът: минимален, но функционален' },
  { id: 'produkti', label: 'Продуктови страници, които конвертират' },
  { id: 'plashtane', label: 'Плащане без сложна интеграция' },
  { id: 'dostavka', label: 'Доставка: Speedy, Econt, лично' },
  { id: 'seo-year-round', label: 'SEO, което работи целогодишно' },
  { id: 'greshki', label: '5 грешки при e-commerce за храна' },
];

export default function EcommerceSezonniProduktiPage() {
  useEffect(() => {
    const id = 'schema-ecommerce-sezonni';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    document.title = 'E-commerce за сезонни продукти — стратегия от нулата | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Как да създадеш e-commerce за сезонен продукт от нулата — с Горски Боровинки като пример. Сайт, SEO, плащания, доставка и стратегия за целогодишен трафик.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/ecommerce-sezonni-produkti-gorski-borovinki');

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      <main className="max-w-4xl mx-auto px-4 md:px-16">
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6 pt-14 md:pt-20">
          <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <Link to="/blog" className="hover:text-[#1C1C1E]/60 transition-colors">Блог</Link>
          <i className="ri-arrow-right-s-line text-xs" />
          <span className="text-[#1C1C1E]/65">E-commerce сезонни продукти</span>
        </nav>

        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=Small%20online%20shop%20packaging%20wild%20blueberries%20into%20eco%20friendly%20boxes%20rustic%20wooden%20table%20natural%20light%20smartphone%20showing%20order%20form%20Bulgarian%20mountain%20products%20editorial%20photography%20warm%20tones%20professional%20setup%20no%20text&width=1200&height=630&seq=blog-ecommerce-sezonni-hero-01&orientation=landscape"
              alt="E-commerce за сезонни продукти — стратегия от нулата"
              className="w-full h-full object-cover object-top"
              loading="lazy" decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-medium">E-commerce</span>
            <span className="text-[10px] text-[#1C1C1E]/70">8 Юли 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">11 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            E-commerce за сезонни продукти.
            <br />
            <span className="italic text-[#0A2540]">Стратегия от нулата.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            Как да създадеш онлайн магазин за <strong>сезонен продукт</strong> — без Shopify, без WooCommerce сложности, без месечни такси. Реална стратегия от работата с <a href="https://gorskiborovinki.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">gorskiborovinki.com</a>.
          </p>

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
              <div className="text-[10px] text-[#1C1C1E]/65">E-commerce стратег, ТАВОРА ЕООД</div>
            </div>
          </div>
        </section>

        <section className="p-6 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-12">
          <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Съдържание</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOC_ITEMS.map((item, i) => (
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

          <section id="sait" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Сайтът: <span className="italic text-[#0A2540]">минимален, но функционален.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Горски Боровинки не използва Shopify. Сайтът е light, бърз и фокусиран. Всяка страница има една цел — или да информира, или да продаде.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Задължителни страници</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· Начало с ясен H1 и CTA</li>
                  <li>· Продукти с цени и снимки</li>
                  <li>· Как работи — процес в 4 стъпки</li>
                  <li>· Реални клиентски скрийншоти</li>
                  <li>· FAQ с 25+ въпроса</li>
                  <li>· Контакт — Viber, WhatsApp, телефон</li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Технически изисквания</div>
                <ul className="space-y-1.5 text-sm text-[#1C1C1E]/65">
                  <li>· Зареждане под 2 секунди</li>
                  <li>· Mobile-first дизайн</li>
                  <li>· Schema.org за Product и FAQ</li>
                  <li>· HTTPS сертификат</li>
                  <li>· Оптимизирани изображения</li>
                  <li>· Чист URL структура</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Важно:</strong> Сайтът не е каталог. Сайтът е <strong>инструмент за доверие</strong>. Всеки елемент трябва да отговаря на въпроса: „Защо да купя от теб, а не от магазина?
            </p>
          </section>

          <section id="produkti" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Продуктови страници,{' '}
              <span className="italic text-[#0A2540]">които конвертират.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Продуктовата страница за храна е различна от тази за дрехи. Клиентът не може да пипне продукта. Трябва да <strong>види и повярва</strong>.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Елементи на продуктовата страница</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· <strong>Име:</strong> „Горски боровинки — ръчно набрани от Стара Планина, 500гр" — конкретно, описателно</li>
                <li>· <strong>Снимки:</strong> Минимум 4 — бера, сортиране, опаковане, доставка</li>
                <li>· <strong>Цена:</strong> Ясна, с включена доставка или без — но ясно казано</li>
                <li>· <strong>Произход:</strong> „От Стара Планина, България" — локацията е актив</li>
                <li>· <strong>Сезонност:</strong> „Налични до края на август" — спешност</li>
                <li>· <strong>CTA:</strong> Viber бутон за поръчка — не „Добави в количка"</li>
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Pro tip:</strong> За хранителни продукти, <strong>„Добави в количка"</strong> е прекалено безлично. <strong>„Поръчай в Viber"</strong> е лично. Хората купуват от хора.
            </p>
          </section>

          <section id="plashtane" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Плащане <span className="italic text-[#0A2540]">без сложна интеграция.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Горски Боровинки не използва Stripe, PayPal или други платежни портали. За българския пазар и за този тип продукт, по-простите методи работят по-добре.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {[
                { method: 'Наложен платеж', desc: 'Плащаш при получаване. Най-популярен метод в България.' },
                { method: 'Банков превод', desc: 'По сметка преди доставка. За по-големи поръчки.' },
                { method: 'Viber/Кеш', desc: 'Директно при лично предаване. За клиенти в региона.' },
              ].map((p) => (
                <div key={p.method} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white text-center">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{p.method}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Не инсталирай сложна платежна система, ако продуктът ти не изисква. Наложен платеж + Speedy = 90% от поръчките в България.
            </p>
          </section>

          <section id="dostavka" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Доставка: <span className="italic text-[#0A2540]">Speedy, Econt, лично.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Доставката е критичен елемент за пресни продукти. Боровинките не издържат 5 дни в колет. Затова стратегията е <strong>бърза, предвидима доставка</strong>.
            </p>

            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <ul className="space-y-2">
                {[
                  'Speedy или Econt — 1-2 работни дни до всяка точка на България',
                  'Опаковане в термо-кутии за пресни продукти',
                  'Лично предаване в региона на Велико Търново — безплатно',
                  'Ясна комуникация: "Поръчка днес → изпращам утре → получаваш вдругиден"',
                  'Проследяване на пратката — номер за проследяване веднага',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> За пресни продукти, <strong>скоростта на доставка е част от продукта</strong>. Ако боровинките пристигнат след 3 дни — вече не са пресни. Комуникирай ясно кога ще пристигнат.
            </p>
          </section>

          <section id="seo-year-round" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              SEO, което работи{' '}
              <span className="italic text-[#0A2540]">целогодишно — не само през сезона.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Най-голямата грешка при сезонен e-commerce: спираш SEO когато свърши сезонът. Горски Боровинки прави точно обратното — <strong>SEO работи 12 месеца в годината</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: 'През сезона', text: 'Активни продукти, сезонен countdown, реални снимки от реколтата, чести ъпдейти.' },
                { title: 'Извън сезона', text: 'Съдържание за сладко, сушени боровинки, рецепти, полезни свойства — трафик без продажби.' },
                { title: 'Преди сезона', text: '„Скоро започва реколтата" — събиране на имейли и Viber контакти.' },
                { title: 'След сезона', text: '„Благодарим за този сезон" — отчет, снимки, подготовка за следващия.' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Резултат:</strong> През август сайтът има 3,000 посещения. През януари — 800. Но тези 800 са <strong>квалифициран трафик</strong> — хора, които търсят рецепти и се връщат през юни за поръчка.
            </p>
          </section>

          <section id="greshki" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              5 грешки при e-commerce{' '}
              <span className="italic text-[#0A2540]">за храна — и как да ги избегнете.</span>
            </h2>
            <div className="space-y-4">
              {[
                { num: '01', title: 'Скриваш цената', text: '„Пиши ни за цена" = 70% отпадане. Цената трябва да е видима още на продуктовата страница.' },
                { num: '02', title: 'Използваш stock снимки', text: 'Клиентът вижда Shutterstock снимка и знае, че не е твой продукт. Снимай реалния продукт.' },
                { num: '03', title: 'Сложна поръчка', text: 'Регистрация, количка, checkout — твърде много стъпки. Viber бутон = 1 клик до поръчка.' },
                { num: '04', title: 'Няма сезонна стратегия', text: 'Спираш сайта след сезона. Грешка. Поддържай го жив със съдържание извън сезона.' },
                { num: '05', title: 'Игнорираш доставката', text: '„Доставка: по договаряне" = червен флаг. Бъди конкретен: „1-2 дни с Speedy, 5 лв."' },
              ].map((u) => (
                <div key={u.num} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-light text-[#E8590C] shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{u.num}</span>
                    <div>
                      <div className="text-sm font-medium text-[#1C1C1E] mb-1">{u.title}</div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{u.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за онлайн магазин?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  E-commerce за вашия бизнес
                  <br />
                  <span className="italic text-white/60">от нулата.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на продукт, конкуренция и стратегия за онлайн продажби. Сумата се приспада при договор.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/kontakt"
                  className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
                >
                  Поискайте консултация →
                </Link>
                <Link
                  to="/uslugi/izrabotka-na-sait"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  E-commerce услуги
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Как Горски Боровинки стана #1 в Google', to: '/blog/gorski-borovinki-nomer-edno-google' },
                { title: 'Маркетинг за плодове от гората', to: '/blog/marketing-za-ecommerce-plodove-tarnovo' },
                { title: 'E-commerce стратегия за Търново 2026', to: '/blog/ecommerce-tarnovo-2026' },
                { title: 'SEO оптимизация Велико Търново 2026', to: '/blog/seo-optimizaciya-tarnovo-2026' },
              ].map((a) => (
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