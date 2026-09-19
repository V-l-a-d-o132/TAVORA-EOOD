import { Link } from 'react-router-dom';

export default function MarketingBasicsFinalCTA() {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-16 pb-16 md:pb-24">
      <div className="p-8 md:p-12 rounded-2xl bg-[#0F1F35] text-white">
        <div className="max-w-3xl">
          <div className="text-xs text-white/70 tracking-widest uppercase mb-3">Готов да систематизираш маркетинга си?</div>

          <h2 className="text-2xl md:text-4xl font-light leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Marketing Basics
            <br />
            <span className="italic text-white/55">20 модула — от основа до числата, които значат</span>
          </h2>

          <p className="text-sm text-white/75 leading-relaxed mb-8 max-w-lg">
            Първият модул (Основа) е напълно безплатен — без нужда от карта.
            Започни да изграждаш маркетинг системата на бизнеса си днес.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/kurs"
              className="px-8 py-3.5 bg-white text-[#0A2540] text-sm rounded-full hover:bg-white/90 transition-all cursor-pointer whitespace-nowrap text-center font-medium"
            >
              Започни безплатно — първият модул е отключен →
            </Link>
            <a
              href="#programa"
              className="px-8 py-3.5 border border-white/20 text-white/70 text-sm rounded-full hover:border-white/40 hover:text-white transition-all cursor-pointer whitespace-nowrap text-center"
            >
              Виж 20-те модула
            </a>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <i className="ri-shield-check-line text-white/60" />
            <span>Първият модул е безплатен</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <i className="ri-bar-chart-grouped-line text-white/60" />
            <span>Реални клиентски резултати</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <i className="ri-store-2-line text-white/60" />
            <span>Проектиран за малък и локален бизнес</span>
          </div>
        </div>
      </div>
    </section>
  );
}