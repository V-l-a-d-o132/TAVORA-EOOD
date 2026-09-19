import { Link } from 'react-router-dom';
import { formatPrice } from '@/config/pricing';

const C = {
  bg: '#0a0a0a',
  surface: '#111111',
  border: '#1a1a1a',
  borderHover: '#2a2a2a',
  accent: '#e53e3e',
  text: '#ffffff',
  textMuted: '#a0a0a0',
  textDim: '#666666',
};

const PROGRAMS = [
  {
    id: 'silkRoad',
    name: 'Пътят на коприната',
    price: 99,
    modules: 11,
    lessons: '74+',
    tagline: 'AI Business Blueprint',
    forWho: 'За хора, които искат да изградят и продават дигитална услуга с AI — от нулата.',
    problem: 'Разпиляно знание за AI, без ясен път от идея до платена услуга.',
    outcome: 'След програмата ще можеш да оформяш оферта, да изграждаш сайт с AI и да привличаш клиенти.',
    route: '/kurs/ai-business-blueprint',
  },
  {
    id: 'perfectVideo',
    name: 'Перфектното Видео',
    price: 99,
    modules: 15,
    lessons: '241+',
    tagline: 'Бизнес видео продукция',
    forWho: 'За предприемачи и маркетолози, които искат професионално видео без продукционна компания.',
    problem: 'Видео без стратегия — скъпо, хаотично и без измерваем резултат.',
    outcome: 'След програмата ще можеш да планираш, заснемаш и монтираш бизнес видео, което носи резултат.',
    route: '/kurs/perfektnoto-video',
  },
  {
    id: 'marketingBasics',
    name: 'Marketing Basics',
    price: 129,
    modules: 20,
    lessons: '177+',
    tagline: 'Пълна маркетинг система',
    forWho: 'За собственици на бизнес и маркетинг специалисти, които искат систематизиран маркетинг.',
    problem: 'Маркетинг на парче — публикация тук, реклама там, без цялостна система.',
    outcome: 'След програмата ще имаш работеща маркетинг система от позициониране до превръщане на клиенти.',
    route: '/kurs/marketing-basics',
  },
];

export default function AkademiyaProgramsSection() {
  return (
    <section id="akademiya-programs" className="w-full py-12 md:py-24 px-4 md:px-16" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6" style={{ border: `1px solid ${C.borderHover}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: C.textMuted }}>Програми</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
            Трите самостоятелни програми
          </h2>
          <p className="text-sm md:text-base max-w-2xl leading-relaxed" style={{ color: C.textMuted }}>
            Всяка програма е самостоятелна и покрива различен резултат. Вземи една — или всички.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PROGRAMS.map((p) => (
            <div key={p.id} className="p-6 md:p-7 flex flex-col" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="mb-5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: C.accent }}>{p.tagline}</span>
                <h3 className="text-xl font-bold mt-1.5 mb-1" style={{ color: C.text }}>{p.name}</h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: C.textDim }}>
                  <span>{p.modules} модула</span>
                  <span>·</span>
                  <span>{p.lessons} урока</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: C.textDim }}>За кого е</div>
                  <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{p.forWho}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: C.textDim }}>Какъв проблем решава</div>
                  <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{p.problem}</p>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1" style={{ color: C.textDim }}>Какво ще можеш след нея</div>
                  <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{p.outcome}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold" style={{ color: C.text }}>{formatPrice(p.price)}</span>
              </div>

              <Link
                to={p.route}
                className="w-full py-3 text-sm font-semibold text-center transition-all whitespace-nowrap cursor-pointer"
                style={{ background: 'transparent', border: `1px solid ${C.borderHover}`, color: C.text }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
              >
                Виж програмата
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}