import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
import { SILK_ROAD_PUBLIC_MODULES } from '@/data/academy-public-programs';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MODULES = SILK_ROAD_PUBLIC_MODULES;

export default function AiBlueprintProgram() {
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <section id="programa" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Пълна програма</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Пътят на коприната —{' '}
        <em className="text-[#1C1C1E]/55">11-те модула.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-2">
        Всеки модул е самостоятелна стъпка. Програмата се закупува като пакет; първите 10 модула са включени и в Стартовия пакет. Модул 01 е безплатен — няма риск да започнеш.
      </p>
      <p className="text-xs text-[#1C1C1E]/50 mb-8">
        {ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} урока с обяснения и задачи. Времето за четене и самостоятелната практика се планират отделно.
      </p>

      <div className="space-y-3">
        {MODULES.map((mod) => (
          <div key={mod.num} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden transition-all duration-200">
            <button
              className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
              onClick={() => setOpenModule(openModule === parseInt(mod.num, 10) ? null : parseInt(mod.num, 10))}
              aria-expanded={openModule === parseInt(mod.num, 10)}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0 text-sm font-medium text-white"
                style={{ backgroundColor: mod.color }}
              >
                {mod.num}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-medium text-[#1C1C1E]">{mod.title}</h4>
                  {mod.tag === 'FREE' && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#dcfce7] text-[#16a34a]">БЕЗПЛАТЕН</span>
                  )}
                  {mod.tag === 'PREMIUM' && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#fee2e2] text-[#e53e3e]">PREMIUM</span>
                  )}
                </div>
                <p className="text-xs text-[#1C1C1E]/65">{mod.time}</p>
              </div>
              <i className={`text-[#1C1C1E]/50 text-lg shrink-0 transition-transform duration-200 ${openModule === parseInt(mod.num, 10) ? 'ri-subtract-line' : 'ri-add-line'}`} />
            </button>
            {openModule === parseInt(mod.num, 10) && (
              <div className="px-5 pb-5 bg-[#F9F9F7] border-t border-[#1C1C1E]/6 pt-4">
                <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{mod.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/kurs"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1C1C1E] text-white text-sm rounded-full hover:bg-[#1C1C1E]/85 transition-all cursor-pointer whitespace-nowrap font-medium"
        >
          Започни с безплатния Модул 01 →
        </Link>
      </div>
    </section>
  );
}