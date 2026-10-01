import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MARKETING_BASICS_PUBLIC_GROUPS } from '@/data/academy-public-programs';


const GROUPS = MARKETING_BASICS_PUBLIC_GROUPS;

const GROUP_DESC = GROUPS.map(group => group.description);

export default function MarketingBasicsProgram() {
  const [openGroup, setOpenGroup] = useState<string | null>('foundation');

  return (
    <section id="programa" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Практическо издание — октомври 2026</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        20 модула · {ACADEMY_PROGRAM_STATS.marketingBasics.lessonCount} публикувани урока —{' '}
        <em className="text-[#1C1C1E]/55">маркетинг система за 2026.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-2">
        Всички 20 модула са публикувани. Финалът включва 90-дневен практически проект, четири групови проверки с 60 въпроса и отделен изпит с 40 въпроса върху целия курс.
      </p>
      <p className="text-xs text-[#1C1C1E]/50 mb-8">
        Времето включва самостоятелната практика и е ориентировъчно. Каталогът е сверен с публикуваните версии към 01.10.2026.
      </p>

      <div className="space-y-4">
        {GROUPS.map((group, gi) => (
          <div key={group.id} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden transition-all duration-200">
            <button
              className="w-full flex items-center gap-4 p-5 md:p-6 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
              onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              aria-expanded={openGroup === group.id}
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${group.color}15` }}>
                <i className={`${group.icon} text-lg`} style={{ color: group.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-0.5">{group.title}</h3>
                <p className="text-xs text-[#1C1C1E]/65">{group.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#1C1C1E]/65 shrink-0">
                <span>{group.modules.length} модула</span>
                <i className={`text-sm transition-transform duration-200 ${openGroup === group.id ? 'ri-subtract-line' : 'ri-add-line'}`} />
              </div>
            </button>
            {openGroup === group.id && (
              <div className="px-5 md:px-6 pb-5 md:pb-6 bg-[#F9F9F7] border-t border-[#1C1C1E]/6">
                <p className="text-xs text-[#1C1C1E]/65 leading-relaxed pt-4 mb-4">{GROUP_DESC[gi]}</p>
                <div className="space-y-2">
                  {group.modules.map((mod) => (
                    <div key={mod.num} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#1C1C1E]/5">
                      <div className="w-7 h-7 flex items-center justify-center rounded-lg shrink-0 text-xs font-medium text-white" style={{ backgroundColor: group.color }}>
                        {mod.num}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="text-xs font-medium text-[#1C1C1E]">{mod.title}</div>
                          <span className="text-[10px] text-[#1C1C1E]/65">{mod.time}</span>
                        </div>
                        <p className="text-[11px] text-[#1C1C1E]/65 leading-relaxed">{mod.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
          Към Академия TAVORA →
        </Link>
      </div>
    </section>
  );
}
