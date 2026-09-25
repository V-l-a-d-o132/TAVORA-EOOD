import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/optimiziran-sait-lokalna-usluga-leski-karuchka#article',
      name: 'Защо локалната услуга се нуждае от оптимизиран сайт: примерът на Лески Каручка',
      headline: 'Защо локалната услуга се нуждае от оптимизиран сайт: примерът на Лески Каручка',
      description: 'Как оптимизираният сайт на Лески Каручка превърна поръчката на каручка в Левски в процес за минути. Mobile-first дизайн, елементи на доверие, Schema.org и SEO от първия ден.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-09-25',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/optimiziran-sait-lokalna-usluga-leski-karuchka',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/optimiziran-sait-lokalna-usluga-leski-karuchka' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=Hand%20holding%20smartphone%20showing%20a%20clean%20local%20transport%20mobile%20app%20interface%20with%20map%20and%20live%20tracking%20soft%20natural%20light%20warm%20tones%20minimal%20editorial%20technology%20photography%20no%20text&width=1200&height=630&seq=blog-leski-karuchka-sait-hero-01&orientation=landscape',
      articleSection: 'Уеб дизайн',
      keywords: 'оптимизиран сайт, локална услуга, mobile-first дизайн, Schema.org, SEO, Лески Каручка, Левски',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Оптимизиран сайт за локална услуга', item: 'https://imashnujnoto.com/blog/optimiziran-sait-lokalna-usluga-leski-karuchka' },
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
  { id: 'zachem-sait', label: 'Защо услуга като каручка се нуждае от сайт' },
  { id: 'mobile-first', label: 'Mobile-first: поръчка от телефона' },
  { id: 'potok', label: 'Потокът за поръчка — от адрес до потвърждение' },
  { id: 'doverie-sait', label: 'Елементи на доверие в интерфейса' },
  { id: 'skorost', label: 'Скорост и яснота' },
  { id: 'seo-sait', label: 'SEO от първия ден' },
  { id: 'zakluchenie', label: 'Заключение' },
];

export default function OptimiziranSaitLokalnaUslugaPage() {
  useEffect(() => {
    const id = 'schema-leski-karuchka-sait';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    document.title = 'Защо локалната услуга се нуждае от оптимизиран сайт | Лески Каручка | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Как оптимизираният сайт на Лески Каручка превърна поръчката на каручка в Левски в процес за минути. Mobile-first дизайн, елементи на доверие, Schema.org и SEO от първия ден.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/optimiziran-sait-lokalna-usluga-leski-karuchka');

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
          <span className="text-[#1C1C1E]/65">Оптимизиран сайт за локална услуга</span>
        </nav>

        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=Hand%20holding%20smartphone%20showing%20a%20clean%20local%20transport%20mobile%20app%20interface%20with%20map%20and%20live%20tracking%20soft%20natural%20light%20warm%20tones%20minimal%20editorial%20technology%20photography%20no%20text&width=1200&height=630&seq=blog-leski-karuchka-sait-hero-01&orientation=landscape"
              alt="Оптимизиран сайт за локална услуга — примерът на Лески Каручка"
              className="w-full h-full object-cover object-top"
              decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-medium">Уеб дизайн</span>
            <span className="text-[10px] text-[#1C1C1E]/70">25 Сеп 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">10 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Защо локалната услуга се нуждае от{' '}
            <span className="italic text-[#0A2540]">оптимизиран сайт.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            Примерът на <a href="https://leskikaruchka.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">Лески Каручка</a> — как един добре изграден сайт превърна поръчката на каручка в Левски в <strong>процес за минути</strong>. Mobile-first дизайн, елементи на доверие, структурирани данни и SEO от първия ден.
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
              <div className="text-[10px] text-[#1C1C1E]/65">Уеб дизайн & SEO, ТАВОРА ЕООД</div>
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

          <section id="zachem-sait" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Защо услуга като каручка{' '}
              <span className="italic text-[#0A2540]">се нуждае от собствен сайт.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Много локални бизнеси си мислят, че им стига Facebook страница. Тя е добра за присъствие, но не е <strong>твой дом</strong>. Алгоритъмът решава кой да те види. Собственият сайт е единственото място, където ти решаваш как изглеждаш, какво казваш и как човек поръчва.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              За Лески Каручка сайтът не беше „визитка". Той беше <strong>продуктът</strong>. Човек влиза, избира откъде тръгва, избира накъде отива, вижда цената и потвърждава. Целият смисъл на услугата се случва на една страница.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Затова вложихме в дизайн, който работи, а не който само изглежда добре. Красотата е важна — но тя служи на <strong>яснотата и действието</strong>.
            </p>
          </section>

          <section id="mobile-first" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Mobile-first:{' '}
              <span className="italic text-[#0A2540]">поръчката се случва от телефона.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Когато на човек му трябва каручка, той не сяда на компютър. Той вади телефона — на улицата, на гарата, в движение. Ако сайтът не работи перфектно на телефон, <strong>той просто не съществува</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: 'Пръст, не мишка', text: 'Бутоните и полетата са достатъчно големи за докосване. Няма дреболии, в които да се уцелиш с пръст.' },
                { title: 'Едно на екран', text: 'Всяка стъпка показва само това, което е нужно. Няма претрупване с информация.' },
                { title: 'Бърза връзка', text: 'Телефонът и услугата са на първия екран. Ако не иска приложение — може директно от браузъра.' },
                { title: 'Без изчакване', text: 'Страниците се зареждат мигновено дори на бавна мобилна връзка в малък град.' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Ако 80% от клиентите ти са на телефон, дизайнирай за телефона първо. Компютърната версия е бонус, не основа.
            </p>
          </section>

          <section id="potok" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Потокът за поръчка —{' '}
              <span className="italic text-[#0A2540]">от адрес до потвърждение.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Всеки допълнителен тап е изгубен клиент. Затова потокът на Лески Каручка е съкратен до минимум — <strong>три ясни стъпки</strong>, без да питаме неща, които не са нужни сега.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <ul className="space-y-2">
                {[
                  'Посочи откъде тръгваш — само съществената информация',
                  'Избери накъде отиваш — с покритие в 6 населени места',
                  'Виж фиксираната цена преди потвърждение — без изненади',
                  'Потвърди — и следи на живо как идва превозното средство',
                  'Директен телефон, ако предпочиташ да говориш с човек',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Pro tip:</strong> Покажи цената <strong>преди</strong> финалното потвърждение. Хората се доверяват на прозрачност. Сривът на конверсия при услуги често идва точно от „май ще ми излезе скъпо" — ако махнеш тази несигурност, поръчката става лесна.
            </p>
          </section>

          <section id="doverie-sait" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Елементи на доверие{' '}
              <span className="italic text-[#0A2540]">в самия интерфейс.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Доверието не се появява в текст „ние сме сериозни". То се появява в <strong>малките детайли</strong> на интерфейса — нещата, които човек забелязва подсъзнателно и решава, че може да разчита на теб.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: 'Проследяване на живо', text: 'Виждаш къде е превозното средство. Това премахва тревогата „идва ли изобщо".' },
                { title: 'Проверени шофьори', text: 'Ясно обозначено, че всеки изпълнител е подбран и проверен — не анонимен.' },
                { title: 'Фиксирани цени', text: 'Показани открито. Няма такси изненада накрая. Цената е обещание.' },
                { title: 'Човек на телефона', text: 'Контактът е видим през цялото време. Не си сам с бот.' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Всеки елемент, който премахва несигурност, увеличава конверсията. Не питай „какво да добавя", а „какво тревожи клиента" — и го реши.
            </p>
          </section>

          <section id="skorost" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Скорост и яснота —{' '}
              <span className="italic text-[#0A2540]">под две секунди или забравяш.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В малък град интернетът не винаги е бърз. Затова всеки елемент на сайта е оптимизиран — компресирани изображения, минимум скриптове, мигновено зареждане. И скоростта не е само удобство. Тя е и <strong>ранкинг фактор в Google</strong>.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">Основи, които приложихме</div>
              <ul className="space-y-2">
                {[
                  'Оптимизирани WebP изображения вместо тежки JPG',
                  'Минимум външни скриптове и плъгини',
                  'Критичният CSS се зарежда първи',
                  'Ясна структура — човек не се лута и не изоставя',
                  'Един основен призив за действие на всеки екран',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Красивият сайт, който се зарежда 8 секунди, е по-лош от грозния, който се зарежда за 1. Скоростта е част от дизайна.
            </p>
          </section>

          <section id="seo-sait" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              SEO от първия ден —{' '}
              <span className="italic text-[#0A2540]">не накрая.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Голямата грешка на повечето локални бизнеси е да направят сайта и <em>после</em> да мислят за SEO. Но SEO се вгражда в структурата още при изграждането — заглавия, структурирани данни, скорост, локални ключови думи.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white mb-5">
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-3">SEO, вградено в сайта на Лески Каручка</div>
              <ul className="space-y-2 text-sm text-[#1C1C1E]/65">
                <li>· <strong>Schema.org LocalBusiness + Service</strong> с точния географски обхват</li>
                <li>· <strong>Семантичен HTML</strong> — header, main, nav, article, footer</li>
                <li>· <strong>Ясни заглавия</strong> с локацията и услугата</li>
                <li>· <strong>Едно H1</strong> на страница, подзаглавия в логичен ред</li>
                <li>· <strong>Alt текст</strong> на всяко изображение с ключова дума</li>
                <li>· <strong>Бързина и mobile-first</strong> — директно ранкинг предимство</li>
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Когато SEO е заложено от самото начало, не се налага после „да се прави SEO". Сайтът просто <strong>се ражда готов да бъде намерен</strong> — в Google, в картата и в AI търсачките.
            </p>
          </section>

          <section id="zakluchenie" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Заключение:{' '}
              <span className="italic text-[#0A2540]">сайтът е продуктът.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              За локална услуга сайтът не е „още един маркетинг канал". Той е <strong>самият продукт</strong> — мястото, където човекът решава дали да ти се довери и да поръча. Примерът на Лески Каручка показва, че когато дизайнът служи на яснотата и доверието, резултатът е поръчка за минути.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Няма магически ефекти. Има <strong>mobile-first мислене, кратък поток, видимо доверие, скорост и SEO от първия ден</strong>. Всичко останало е детайли около тези пет неща.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <a href="https://leskikaruchka.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline inline-flex items-center gap-1">
                Вижте живия сайт <i className="ri-external-link-line" />
              </a>
            </p>
          </section>

          <section className="mb-12 p-7 md:p-10 rounded-2xl bg-[#0F1F35] text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Нужен ви е сайт, който работи?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Изработка на сайт за
                  <br />
                  <span className="italic text-white/60">вашия локален бизнес.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  От 999 € — оптимизиран сайт с вградено SEO, мобилна версия и структурирани данни. Първоначален анализ без ангажимент.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/kontakt"
                  className="px-7 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
                >
                  Поискайте оферта →
                </Link>
                <Link
                  to="/uslugi/izrabotka-na-sait"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Изработка на сайт
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Как Лески Каручка стана #1 в Google', to: '/blog/leski-karuchka-nomer-edno-google' },
                { title: 'Какво научихме от локална платформа в малък град', to: '/blog/marketing-lokalna-platforma-malki-gradove' },
                { title: 'Изработка на сайт Велико Търново 2026', to: '/blog/izrabotka-na-sait-tarnovo' },
                { title: 'Защо локалният туристически бизнес се нуждае от оптимизиран сайт', to: '/blog/turisticheski-biznes-optimiziran-sait-tarnovo' },
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