import { Link } from 'react-router-dom';

interface MarketingBasicsHeroProps {
  keyword: string;
}

export default function MarketingBasicsHero({ keyword }: MarketingBasicsHeroProps) {
  return (
    <>
      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-10 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6">
            <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <Link to="/kurs" className="hover:text-[#1C1C1E]/60 transition-colors">Академия TAVORA</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Marketing Basics</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">Маркетинг</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-700">Академия TAVORA</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-sky-50 text-sky-700">20 модула · 177+ урока</span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Изгради маркетинг система, която свързва{' '}
            <em className="text-[#e53e3e]">позициониране, съдържание и продажби</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-4">
            Практическа програма за разбиране на пазара, изграждане на оферта, създаване на съдържание и измерване на резултатите.
          </p>
          <p className="text-xs text-[#1C1C1E]/45 mb-8 max-w-2xl">
            {keyword}
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              to="/kurs"
              className="px-6 py-3 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/85 transition-all cursor-pointer whitespace-nowrap font-medium"
            >
              Започни с безплатния модул →
            </Link>
            <a
              href="#cena"
              className="px-6 py-3 border border-[#1C1C1E]/12 text-[#1C1C1E]/65 text-sm rounded-full hover:border-[#1C1C1E]/30 hover:text-[#1C1C1E] transition-all cursor-pointer whitespace-nowrap"
            >
              Виж програмата и цената
            </a>
          </div>

          {/* GEO summary */}
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#1C1C1E]/8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#0A2540]/8 shrink-0">
                <i className="ri-flashlight-line text-xs text-[#0A2540]" />
              </div>
              <span className="text-xs font-medium text-[#1C1C1E]">Накратко</span>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">Marketing Basics</strong> е 20-модулната маркетинг система на
              Академия TAVORA, организирана в 4 фази: Позициониране, Присъствие, Трафик и Превръщане.
              Общо 18+ часа структурирано съдържание с 177 урока, тествани върху реални бизнеси.
              Системата работи за всеки тип бизнес — от кварталното кафене до онлайн магазина.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=modern%20marketing%20strategy%20planning%20clean%20whiteboard%20with%20structured%20funnel%20diagrams%20sticky%20notes%20organized%20into%20logical%20groups%20professional%20business%20growth%20concepts%20warm%20natural%20light%20minimalist%20workspace%20editorial%20photography%20no%20text&width=1400&height=420&seq=marketing-basics-funnel-hero&orientation=landscape"
          alt="Marketing Basics — програма за изграждане на маркетинг система, 20 модула от Академия TAVORA"
          className="w-full h-full object-cover object-top"
          title="Marketing Basics — маркетинг система: от позициониране до превръщане"
        />
      </div>
    </>
  );
}