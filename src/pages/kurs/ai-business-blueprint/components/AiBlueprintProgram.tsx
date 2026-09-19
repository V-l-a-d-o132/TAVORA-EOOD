import { useState } from 'react';
import { Link } from 'react-router-dom';

const MODULES = [
  {
    num: '01',
    tag: 'FREE',
    title: 'AI Advantage',
    time: '2ч · 4 урока',
    desc: 'Основи на работа с изкуствен интелект за бизнес цели. Prompt engineering на професионално ниво. Мулти-моделна стратегия: кога да използваш ChatGPT, кога Claude, кога Gemini. Изграждаш фундамента, върху който стъпват всички останали модули.',
    color: '#22c55e',
  },
  {
    num: '02',
    title: 'Дизайн в Readdy AI',
    time: '4ч · 10 урока',
    desc: 'Научаваш се да създаваш професионални уебсайтове с AI-driven платформата Readdy. От празен екран до публикуван сайт — без да пишеш код. Архитектура на конвертиращ сайт, визуална йерархия, продаващи елементи, които носят резултати.',
    color: '#E67700',
  },
  {
    num: '03',
    title: 'SEO и GEO оптимизация',
    time: '4.5ч · 10 урока',
    desc: 'SEO през 2026 не е същото като през 2023. Покриваш класическо SEO (техническо, on-page, off-page) и GEO — Generative Engine Optimization за ChatGPT, Perplexity и Google AI Overviews. Локална SEO доминация. Пасивно привличане на клиенти чрез търсачки.',
    color: '#3B5BDB',
  },
  {
    num: '04',
    title: 'Съдържание и Копирайтинг',
    time: '4.5ч · 10 урока',
    desc: 'Стратегия на съдържанието, която работи. SEO статии, които класират и конвертират. Видео скриптове, които задържат вниманието. Content repurposing — как едно парче съдържание да работи на 5 платформи. AI-assisted copywriting, който не звучи като робот.',
    color: '#7048E8',
  },
  {
    num: '05',
    title: 'Audience Engine',
    time: '4.5ч · 10 урока',
    desc: 'Изграждаш аудитория, която се превръща в клиенти — органично, без да гориш бюджет. LinkedIn B2B машина за corporate клиенти. Платени кампании с реален ROI — как да не изгориш бюджета за 2 дни.',
    color: '#C2255C',
  },
  {
    num: '06',
    title: 'The Conversion System',
    time: '4.5ч · 10 урока',
    desc: 'Психология на конверсията — защо хората кликват и купуват. A/B тестване без технически познания. Лийд магнити, които реално събират имейли. Follow-up система за затваряне на сделки — от "интересувам се" до "ето ти договора".',
    color: '#2F9E44',
  },
  {
    num: '07',
    title: 'Professional Stack',
    time: '1.5ч · 4 урока',
    desc: 'Домейни, хостинг, DNS — всичко, което прави разликата между аматьор и професионалист. Инструменти на професионалиста. SSL, бекъп, мониторинг. Клиентски onboarding процес. Без този модул останалите няма на какво да стъпят.',
    color: '#0A2540',
  },
  {
    num: '08',
    title: 'Digital Protection',
    time: '1.5ч · 4 урока',
    desc: 'Киберсигурност за не-технически хора. Пароли, 2FA, защита на клиентски данни. Phishing превенция — как да не загубиш бизнеса си за един клик. План за действие при инцидент.',
    color: '#E67700',
  },
  {
    num: '09',
    title: 'Growth Analytics',
    time: '1.5ч · 4 урока',
    desc: 'Google Analytics 4 без да те заболи главата. KPI-та, които реално показват дали бизнесът ти расте. Data-driven decisions — спираш да гадаеш и започваш да знаеш.',
    color: '#3B5BDB',
  },
  {
    num: '10',
    title: 'Scale with AI',
    time: '2ч · 4 урока',
    desc: 'Автоматизация на рутинни процеси. Имейл автоматизация, social media автопилот, lead capture фунии. No-code + AI инструменти, които ти освобождават времето да работиш върху бизнеса, не в него.',
    color: '#7048E8',
  },
  {
    num: '11',
    tag: 'PREMIUM',
    title: 'The Revenue Blueprint',
    time: '2ч · 4 урока',
    desc: 'Оферти, ценообразуване, намиране на клиенти и устойчиво развитие на услугата — разгънато стъпка по стъпка. Система за намиране на клиенти без студени обаждания. Ценообразуване, което не те подценява. Това е модулът, който свързва всичко в работеща услуга.',
    color: '#e53e3e',
  },
];

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
        Всеки модул е самостоятелна стъпка. Можеш да вземеш един, няколко или всички. Модул 01 е безплатен — няма риск да започнеш.
      </p>
      <p className="text-xs text-[#1C1C1E]/50 mb-8">
        Общо 32+ часа структурирано съдържание. 74+ урока с практически задачи.
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