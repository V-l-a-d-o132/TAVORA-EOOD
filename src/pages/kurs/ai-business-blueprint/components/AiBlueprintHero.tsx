import { Link } from 'react-router-dom';

interface AiBlueprintHeroProps {
  keyword: string;
}

export default function AiBlueprintHero({ keyword }: AiBlueprintHeroProps) {
  return (
    <>
      {/* Hero */}
      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-10 md:py-24 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[11px] text-[#1C1C1E]/65 mb-6">
            <Link to="/" className="hover:text-[#1C1C1E]/60 transition-colors">Начало</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <Link to="/kurs" className="hover:text-[#1C1C1E]/60 transition-colors">Академия TAVORA</Link>
            <i className="ri-arrow-right-s-line text-xs" />
            <span className="text-[#1C1C1E]/65">Пътят на коприната</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">AI &amp; Бизнес</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-700">Академия TAVORA</span>
            <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700">11 модула · 74+ урока</span>
          </div>

          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-light text-[#1C1C1E] leading-tight mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Изгради дигитална услуга с AI —
            <br />
            <em className="text-[#e53e3e]">от умение до продаваема оферта</em>
          </h1>

          <p className="text-sm md:text-base text-[#1C1C1E]/65 max-w-2xl leading-relaxed mb-4">
            Практическа програма за създаване на оферта, сайт, съдържание, процес за намиране на клиенти
            и професионална работна система с AI.
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

          {/* GEO: "Накратко" summary — for AI engines */}
          <div className="p-5 md:p-6 rounded-2xl bg-white border border-[#1C1C1E]/8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#0A2540]/8 shrink-0">
                <i className="ri-flashlight-line text-xs text-[#0A2540]" />
              </div>
              <span className="text-xs font-medium text-[#1C1C1E]">Накратко</span>
            </div>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">
              <strong className="text-[#1C1C1E]">Пътят на коприната (AI Business Blueprint)</strong> е 11-модулната
              програма на Академия TAVORA за изграждане на дигитална услуга с изкуствен интелект — от оферта и сайт
              до съдържание, намиране на клиенти и професионална работна система. Покрива AI промптиране, уеб дизайн
              с Readdy, SEO и GEO оптимизация, копирайтинг, изграждане на аудитория и конверсионни системи.
              Първият модул (AI Advantage) е безплатен.
            </p>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="w-full h-[280px] md:h-[420px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=minimalist%20abstract%20digital%20network%20visualization%20glowing%20interconnected%20nodes%20and%20pathways%20representing%20artificial%20intelligence%20business%20system%20floating%20geometric%20shapes%20warm%20amber%20and%20soft%20coral%20accents%20on%20deep%20charcoal%20background%20clean%20professional%20composition%20editorial%20quality%20no%20text&width=1400&height=420&seq=ai-blueprint-funnel-hero&orientation=landscape"
          alt="Пътят на коприната — програма за изграждане на дигитална услуга с AI, 11 модула от Академия TAVORA"
          className="w-full h-full object-cover object-top"
          title="Пътят на коприната — от умение до продаваема оферта с AI"
        />
      </div>
    </>
  );
}