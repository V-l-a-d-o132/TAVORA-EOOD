import { useState } from 'react';

export interface ClientReview {
  name: string;
  role: string;
  company: string;
  companyUrl?: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  body: string;
  result?: string;
}

const REVIEWS: ClientReview[] = [
  {
    name: 'Росица Атанасова',
    role: 'Собственик',
    company: 'K-Food Велико Търново',
    companyUrl: 'https://k-foodvelikotarnovo.com/',
    avatarUrl: 'https://ui-avatars.com/api/?name=R+Atanasova&background=0A2540&color=fff&size=128',
    rating: 5,
    date: '2026-03-15',
    body: 'Честно казано не съм много по технологиите, но Владимир ми обясни всичко на разбираем език. Като напишеш "корейска храна велико търново" сме първи. Даже напоследък клиенти ни намират през ChatGPT — питат за кимчи и ни излизаме.',
    result: '#1 Google + ChatGPT',
  },
  {
    name: 'Огнян Петров',
    role: 'Собственик',
    company: 'Sunrise Food',
    companyUrl: 'https://sunrisefood.eu/',
    avatarUrl: 'https://ui-avatars.com/api/?name=O+Petrov&background=1B4332&color=fff&size=128',
    rating: 5,
    date: '2026-02-20',
    body: 'Не очаквах толкова бързи резултати, сериозно. За три седмици сайтът беше готов и още на следващия месец започнахме да излизаме първи за "гъби кладница онлайн". Преди основно от фейсбук групи идваха хората, сега директно ни намират.',
    result: '#1 за 3–4 седмици',
  },
  {
    name: 'Георги Георгиев',
    role: 'Основател',
    company: 'Thalysta',
    companyUrl: 'https://thalysta.com/',
    avatarUrl: 'https://ui-avatars.com/api/?name=G+Georgiev&background=2F9E44&color=fff&size=128',
    rating: 5,
    date: '2026-04-20',
    body: 'Имахме идея за онлайн магазин, но не знаехме откъде да започнем честно. Направиха ни всичко от А до Я. Най-готиното е, че не просто казаха "ето ти сайт" и чао — обясниха ни как да го поддържаме, какво да следим, всичко.',
    result: 'E-commerce от нулата',
  },
  {
    name: 'Атанас Атанасов',
    role: 'Директор',
    company: 'NMOM',
    companyUrl: 'https://nmom.bg/',
    avatarUrl: 'https://ui-avatars.com/api/?name=A+Atanasov&background=E8590C&color=fff&size=128',
    rating: 5,
    date: '2026-03-01',
    body: 'Като НПО всеки лев е на кантар и ме беше страх, че дигиталният маркетинг ще е прекалено скъп за нас. Оказа се точно обратното — инвестицията си я върнахме няколко пъти. Вече имаме истинско онлайн присъствие, не просто една страничка.',
    result: 'НПО сайт + стратегия',
  },
  {
    name: 'Владимир Атанасов',
    role: 'Основател',
    company: 'Будим се',
    companyUrl: 'https://budimse.online/',
    avatarUrl: 'https://ui-avatars.com/api/?name=V+Atanasov&background=5F3DC4&color=fff&size=128',
    rating: 5,
    date: '2026-02-15',
    body: 'Искахме платформа, която не прилича на нищо друго и се получи точно така. Най-много ме изненада, че след като я пуснахме, хората започнаха да ни намират в гугъл без да сме пускали реклами. Тва изобщо не го очаквах.',
    result: 'Платформа от нулата',
  },
  {
    name: 'Валери Ангелов',
    role: 'Собственик',
    company: 'Горски Боровинки',
    companyUrl: 'https://gorskiborovinki.com/',
    avatarUrl: 'https://ui-avatars.com/api/?name=V+Angelov&background=6B21A8&color=fff&size=128',
    rating: 5,
    date: '2026-06-20',
    body: 'Продаваме горски боровинки директно от берача и си мислех, че онлайн няма да проработи за такъв продукт. Два месеца по-късно сме #1 в гугъл и поръчките ни се удвоиха. Направо не смогваме да берем понякога.',
    result: '#1 Google · +200% продажби',
  },
];

export function getReviewSchema(reviews: ClientReview[]) {
  return reviews.map((r) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: r.name,
      jobTitle: r.role,
      worksFor: {
        '@type': 'Organization',
        name: r.company,
        url: r.companyUrl || undefined,
      },
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: String(r.rating),
      bestRating: '5',
    },
    reviewBody: r.body,
    datePublished: r.date,
  }));
}

export default function ClientReviewsSection({ limit }: { limit?: number }) {
  const [active, setActive] = useState(0);
  const display = limit ? REVIEWS.slice(0, limit) : REVIEWS;

  return (
    <section className="py-14 md:py-20 border-t border-[#1C1C1E]/6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-6 h-px bg-[#0A2540]/25" />
        <span className="text-[11px] text-[#1C1C1E]/65 tracking-widest uppercase">Отзиви от клиенти</span>
      </div>

      <h2
        className="text-2xl md:text-3xl font-light text-[#1C1C1E] leading-tight mb-3"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Клиентите ни говорят.
        <br />
        <span className="italic text-[#0A2540]">Резултатите са верифицируеми.</span>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 mb-10 max-w-lg">
        Всеки отзив е от реален клиент с жив сайт. Проверете сами — кликнете върху името на компанията.
      </p>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {display.map((r) => (
          <div
            key={r.company}
            className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#F9F9F7] border border-[#1C1C1E]/8">
                {r.avatarUrl ? (
                  <img
                    src={r.avatarUrl}
                    alt={r.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[#1C1C1E]/70">
                    {r.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#1C1C1E] truncate">{r.name}</div>
                <div className="text-[10px] text-[#1C1C1E]/65">
                  {r.role} ·{' '}
                  {r.companyUrl ? (
                    <a
                      href={r.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-[#0A2540] hover:underline"
                    >
                      {r.company}
                    </a>
                  ) : (
                    r.company
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <i
                  key={i}
                  className={`text-xs ${
                    i < r.rating ? 'ri-star-fill text-[#E8590C]' : 'ri-star-line text-[#1C1C1E]/15'
                  }`}
                />
              ))}
              <span className="text-[10px] text-[#1C1C1E]/70 ml-1.5">{r.date}</span>
            </div>

            <p className="text-xs text-[#1C1C1E]/65 leading-relaxed flex-1">{r.body}</p>

            {r.result && (
              <div className="mt-4 pt-3 border-t border-[#1C1C1E]/6">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-medium">
                  {r.result}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Carousel */}
      <div className="md:hidden">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {display.map((r) => (
              <div key={r.company} className="w-full shrink-0 px-1">
                <div className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-[#F9F9F7] border border-[#1C1C1E]/8">
                      {r.avatarUrl ? (
                        <img
                          src={r.avatarUrl}
                          alt={r.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-[#1C1C1E]/70">
                          {r.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#1C1C1E] truncate">{r.name}</div>
                      <div className="text-[10px] text-[#1C1C1E]/65">
                        {r.role} ·{' '}
                        {r.companyUrl ? (
                          <a
                            href={r.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="text-[#0A2540] hover:underline"
                          >
                            {r.company}
                          </a>
                        ) : (
                          r.company
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`text-xs ${
                          i < r.rating ? 'ri-star-fill text-[#E8590C]' : 'ri-star-line text-[#1C1C1E]/15'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-[#1C1C1E]/70 ml-1.5">{r.date}</span>
                  </div>

                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{r.body}</p>

                  {r.result && (
                    <div className="mt-4 pt-3 border-t border-[#1C1C1E]/6">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] font-medium">
                        {r.result}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          {display.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === active ? 'bg-[#0A2540] w-4' : 'bg-[#1C1C1E]/15'
              }`}
              aria-label={`Отзив ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}