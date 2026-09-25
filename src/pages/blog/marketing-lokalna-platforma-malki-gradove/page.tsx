import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://imashnujnoto.com/blog/marketing-lokalna-platforma-malki-gradove#article',
      name: 'Какво научихме от стартирането на локална платформа в малък град — уроци от Лески Каручка',
      headline: 'Какво научихме от стартирането на локална платформа в малък град — уроци от Лески Каручка',
      description: 'Реални маркетингови уроци от стартирането на локална платформа за транспорт в малък български град. Доверие, Viber, думата на устата и общност — с пример от Лески Каручка в Левски.',
      author: { '@type': 'Person', name: 'Владимир Атанасов', url: 'https://imashnujnoto.com/ekip' },
      publisher: { '@type': 'Organization', name: 'ТАВОРА ЕООД', url: 'https://imashnujnoto.com', telephone: '+359885189724', email: 'tavoraagency@gmail.com', logo: { '@type': 'ImageObject', url: 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/777dce2a-8731-4235-b0be-7837a840c3c9_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.png?v=f6135e7442d441feef102ad2f8425862' } },
      datePublished: '2026-09-25',
      dateModified: new Date().toISOString().split('T')[0],
      url: 'https://imashnujnoto.com/blog/marketing-lokalna-platforma-malki-gradove',
      mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://imashnujnoto.com/blog/marketing-lokalna-platforma-malki-gradove' },
      inLanguage: 'bg',
      image: 'https://readdy.ai/api/search-image?query=Horse%20drawn%20cart%20traveling%20along%20a%20quiet%20road%20through%20a%20small%20Bulgarian%20town%20in%20summer%20daylight%20warm%20tones%20authentic%20documentary%20photography%20community%20no%20text&width=1200&height=630&seq=blog-leski-karuchka-marketing-hero-01&orientation=landscape',
      articleSection: 'Локален бизнес',
      keywords: 'локален маркетинг, малък град, локална платформа, Левски, Лески Каручка, доверие',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://imashnujnoto.com/' },
        { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://imashnujnoto.com/blog' },
        { '@type': 'ListItem', position: 3, name: 'Локална платформа в малък град', item: 'https://imashnujnoto.com/blog/marketing-lokalna-platforma-malki-gradove' },
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
  { id: 'zachem-malki', label: 'Защо малкият град е по-добрата стартова точка' },
  { id: 'doverie', label: 'Доверието преди цената' },
  { id: 'kanali', label: 'Viber, телефонът и личният контакт' },
  { id: 'duma-uho', label: 'Думата на устата работи различно в малък град' },
  { id: 'shofiori', label: 'Шофьорите са маркетинг отделът' },
  { id: 'uroci', label: '5 урока за всеки локален бизнес' },
];

export default function MarketingLokalnaPlatformaPage() {
  useEffect(() => {
    const id = 'schema-leski-karuchka-marketing';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(SCHEMA);

    document.title = 'Локална платформа в малък град — уроци от Лески Каручка | ТАВОРА ЕООД';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Реални маркетингови уроци от стартирането на локална платформа за транспорт в малък български град. Доверие, Viber, думата на устата и общност — с пример от Лески Каручка в Левски.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/blog/marketing-lokalna-platforma-malki-gradove');

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
          <span className="text-[#1C1C1E]/65">Локална платформа в малък град</span>
        </nav>

        <section className="mb-10">
          <div className="w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src="https://readdy.ai/api/search-image?query=Horse%20drawn%20cart%20traveling%20along%20a%20quiet%20road%20through%20a%20small%20Bulgarian%20town%20in%20summer%20daylight%20warm%20tones%20authentic%20documentary%20photography%20community%20no%20text&width=1200&height=630&seq=blog-leski-karuchka-marketing-hero-01&orientation=landscape"
              alt="Локална платформа в малък град — уроци от Лески Каручка"
              className="w-full h-full object-cover object-top"
              decoding="async"
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">Локален бизнес</span>
            <span className="text-[10px] text-[#1C1C1E]/70">25 Сеп 2026</span>
            <span className="text-[10px] text-[#1C1C1E]/70">·</span>
            <span className="text-[10px] text-[#1C1C1E]/70">10 мин. четене</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Малкият град е{' '}
            <span className="italic text-[#0A2540]">по-добрата стартова точка.</span>
          </h1>

          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed max-w-2xl mb-6">
            Маркетингови уроци от стартирането на локална платформа за транспорт в малък български град. Как се гради доверие, защо <strong>Viber и телефонът</strong> бият рекламата и как думата на устата носи повече от всеки бюджет — с пример от <a href="https://leskikaruchka.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">Лески Каручка</a> в Левски.
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
              <div className="text-[10px] text-[#1C1C1E]/65">Маркетинг стратег, ТАВОРА ЕООД</div>
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

          <section id="zachem-malki" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Защо малкият град е{' '}
              <span className="italic text-[#0A2540]">по-добрата стартова точка.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Големите платформи обикновено започват от столиците. Там има най-много хора, най-много пари, най-много шум. И точно затова е най-трудно да те забележат. В малкия град е обратното: <strong>по-малко конкуренция, по-силна връзка, по-бързо доверие</strong>.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В Левски всеки познава някого, който познава някого. Това е недостатък, ако правиш лош продукт. Но ако правиш нещо свястно — <strong>това е най-бързият маркетинг канал в света</strong>. Едно доволно семейство стига до цялата улица.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              Лески Каручка избра точно този път — да реши един конкретен проблем на един конкретен град, вместо да се бори за вниманието на милиони. Това е <strong>стратегия, не компромис</strong>.
            </p>
          </section>

          <section id="doverie" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Доверието{' '}
              <span className="italic text-[#0A2540]">преди цената.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Когато пускаш нов продукт, първият въпрос на клиента не е „Колко струва?", а <strong>„Мога ли да му вярвам?"</strong> Особено при услуга, при която се качваш на нещо и разчиташ на непознат човек.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Затова Лески Каручка заложи на <strong>неща, които се доказват, а не се обещават</strong>:
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <ul className="space-y-2">
                {[
                  'Проверени шофьори — не всеки, а подбран човек',
                  'Фиксирана цена — показана преди потвърждение, без изненади',
                  'Проследяване на живо — виждаш къде е превозното средство',
                  'Прозрачен обхват — точно кои населени места покрива',
                  'Директен телефон — истински човек, а не бот',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Доверието не се купува с реклама. То се изгражда с <strong>последователност</strong> — всеки път да е същото, да е честно, да е навреме.
            </p>
          </section>

          <section id="kanali" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Viber, телефонът и{' '}
              <span className="italic text-[#0A2540]">личният контакт.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В малкия град Facebook рекламите работят, но не носят най-добрите клиенти. Най-добрите идват от <strong>пряка връзка</strong> — Viber съобщение, обаждане, личен контакт.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: 'Viber като канал', text: 'Хората пишат и получават отговор за минути. Това създава усещане за достъпност — нещо, което форма в сайт никога не постига.' },
                { title: 'Телефонът работи', text: 'Един реален номер +359 89 000 5900 на видно място носи повече доверие от десет бутона за онлайн чат.' },
                { title: 'Директна връзка', text: 'Когато клиентът говори с човек, а не с автоматичен отговор, шансът да се върне е в пъти по-голям.' },
                { title: 'Безплатно', text: 'Никакви CPM, никакъв бюджет. Само време за отговаряне — и това време се връща като лоялност.' },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="text-sm font-medium text-[#1C1C1E] mb-2">{item.title}</div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>SEO бонус:</strong> Когато хората споделят линка към <a href="https://leskikaruchka.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-[#0A2540] hover:underline">leskikaruchka.com</a> в лични съобщения и групи, Google вижда трафик и споменавания — косвени сигнали, че сайтът е релевантен и полезен.
            </p>
          </section>

          <section id="duma-uho" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Думата на устата{' '}
              <span className="italic text-[#0A2540]">работи различно в малък град.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              В голям град се препоръчва между 3 и 5 души. В малък град — между <strong>цялото населено място</strong> за седмици. Това е огромна сила, но и огромна отговорност: един лош преживян случай се разпространява точно толкова бързо, колкото добрия.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Затова Лески Каручка третира всяко пътуване като <strong>маркетингово събитие</strong>. Доволен човек не просто се връща — той става каналът.
            </p>
            <div className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-[#FAFAFA] mb-5">
              <ul className="space-y-2">
                {[
                  'Има само 6 населени места в обхвата — всяко може да бъде покрито лично',
                  'Локалните групи във Viber и Facebook са по-важни от националните медии',
                  'Един разказ от реален клиент стига по-далеч от всяка реклама',
                  'Краткият път прави препоръката лесна — няма какво да „планираш"',
                  'Отзивите след всяко пътуване подхранват и доверието, и SEO-то',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#1C1C1E]/65">
                    <i className="ri-check-line text-[#1B4332] text-xs mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> В малък пазар работата с първите клиенти е по-важна от привличането на нови. Първите 50 души решават следващите 500.
            </p>
          </section>

          <section id="shofiori" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Шофьорите са{' '}
              <span className="italic text-[#0A2540]">маркетинг отделът.</span>
            </h2>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Повечето стартъпи гледат на шофьорите като на оперативен ресурс. В локална услуга те са <strong>лицето на продукта</strong>. Клиентът не помни приложението — помни човека, който го е закарал.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4">
              Затова Лески Каручка има отделна страница „Стани шофьор" — не като HR формуляр, а като <strong>маркетинг за другата страна на пазара</strong>. Тя привлича изпълнители, които пък носят след себе си клиенти.
            </p>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong>Урок:</strong> Двустранният пазар има два входа. Ако мислиш само за клиентите, губиш половината машина. Изгради и предлагането — и двете се подхранват взаимно.
            </p>
          </section>

          <section id="uroci" className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              5 маркетингови урока{' '}
              <span className="italic text-[#0A2540]">за всеки локален бизнес.</span>
            </h2>
            <div className="space-y-4">
              {[
                { num: '01', title: 'Малкият пазар е предимство', text: 'По-малко шум, по-силни връзки, по-бързо доверие. Реши един град докрай, преди да мечтаеш за цялата страна.' },
                { num: '02', title: 'Доверието се доказва, не се обещава', text: 'Проверени шофьори, фиксирани цени, проследяване на живо. Покажи го — не го рекламирай.' },
                { num: '03', title: 'Личните канали бият рекламата', text: 'Viber, телефонът, директното съобщение — тези канали имат по-висока конверсия от всяка платена кампания.' },
                { num: '04', title: 'Първите 50 клиенти са всичко', text: 'В малък пазар обслужването на малцина добре стига до мнозина. Работи за препоръката, не само за обхвата.' },
                { num: '05', title: 'Изпълнителите са част от маркетинга', text: 'Шофьорът, майсторът, куриерът — всеки е лице на бранда пред клиента. Инвестирай в тях.' },
              ].map((u) => (
                <div key={u.num} className="p-5 rounded-xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-light text-[#0A2540] shrink-0" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{u.num}</span>
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
                <div className="text-xs text-white/75 tracking-widest uppercase mb-2">Готови за ръст?</div>
                <div className="text-2xl md:text-3xl font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Маркетинг за вашия локален бизнес
                  <br />
                  <span className="italic text-white/60">във Велико Търново.</span>
                </div>
                <p className="text-sm text-white/75 max-w-md leading-relaxed">
                  Консултация 50 € — анализ на текущата стратегия, конкурентите и план за растеж. Сумата се приспада при договор.
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
                  to="/uslugi"
                  className="px-7 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  Вижте услугите
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12 pt-8 border-t border-[#1C1C1E]/6">
            <div className="text-[10px] text-[#1C1C1E]/65 tracking-widest uppercase mb-4">Свързани статии</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Как Лески Каручка стана #1 в Google', to: '/blog/leski-karuchka-nomer-edno-google' },
                { title: 'Защо локалната услуга се нуждае от оптимизиран сайт', to: '/blog/optimiziran-sait-lokalna-usluga-leski-karuchka' },
                { title: 'Защо локалният маркетинг е различен от масовия', to: '/blog/lokalen-vs-masov-marketing' },
                { title: 'Локални бизнеси — устойчиво онлайн присъствие', to: '/blog/lokalen-biznes-ustoichivo-online-prisastvie' },
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