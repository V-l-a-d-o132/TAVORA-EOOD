import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
import { PERFECT_VIDEO_PUBLIC_MODULES } from '@/data/academy-public-programs';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const MODULES = PERFECT_VIDEO_PUBLIC_MODULES;

export default function PerfektnoVideoProgram() {
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <section id="programa" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Пълна програма</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        От първата история до цял проект —{' '}
        <em className="text-[#1C1C1E]/55">15-те модула.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-2">
        Първият урок показва цяла кратка история. След това разглеждаме как всеки избор — от сценарий до звук и монтаж — променя разбирането. Програмата се отключва с покупка или предоставен достъп.
      </p>
      <p className="text-xs text-[#1C1C1E]/50 mb-8">
        {ACADEMY_PROGRAM_STATS.perfectVideo.lessonCount} урока с обяснения, примери и затворени проверки. Времената са ориентири за четене; решенията, повторенията и личното упражняване са със собствено темпо.
      </p>

      <p className="mb-6 text-sm leading-relaxed text-[#1C1C1E]/75"><Link to="/academy-tools/perfect-video" className="font-medium underline underline-offset-4">Виж инструментите и пробвай работилницата с ИИ</Link>. Сравнявай предоставени сценарии, субтитри, звук и изнесени файлове. Публичните примери не отключват платените уроци.</p>

      <div className="space-y-3">
        {MODULES.map((mod) => {
          const modKey = parseInt(mod.num, 10);
          return (
            <div key={mod.num} className="rounded-2xl border border-[#1C1C1E]/8 overflow-hidden transition-all duration-200">
              <button
                className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-[#F9F9F7] transition-colors"
                onClick={() => setOpenModule(openModule === modKey ? null : modKey)}
                aria-expanded={openModule === modKey}
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
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65">{mod.time}</p>
                </div>
                <i className={`text-[#1C1C1E]/50 text-lg shrink-0 transition-transform duration-200 ${openModule === modKey ? 'ri-subtract-line' : 'ri-add-line'}`} />
              </button>
              {openModule === modKey && (
                <div className="px-5 pb-5 bg-[#F9F9F7] border-t border-[#1C1C1E]/6 pt-4">
                  <p className="text-sm text-[#1C1C1E]/65 leading-relaxed">{mod.desc}</p>
                </div>
              )}
            </div>
          );
        })}
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
