import { Link } from 'react-router-dom';
import { ACADEMY_PROGRAM_DETAILS } from '@/data/academy-program-details';
import { getTierById } from '@/config/pricing';

export default function AkademiyaResultsSection() {
  return <section id="akademiya-results" className="w-full py-12 md:py-24 px-4 md:px-16 bg-[#0a0a0a] text-white">
    <div className="max-w-6xl mx-auto">
      <p className="text-xs uppercase tracking-widest text-[#a0a0a0] mb-5">Виж как се учи</p>
      <h2 className="text-2xl md:text-4xl font-bold mb-5">Провери подхода със собствен избор</h2>
      <p className="max-w-2xl text-sm leading-relaxed text-[#a0a0a0] mb-8">Тези публични проби използват предоставени учебни материали. Избери действие, виж какво следва и провери обяснението. Не се изисква покупка; пробите не отключват платени модули и не дават оценка или XP.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(ACADEMY_PROGRAM_DETAILS).map(([id, program]) => <article key={id} className="border border-[#333] bg-[#111] p-5 flex flex-col">
          <h3 className="font-semibold text-lg mb-4">{getTierById(id)?.name}</h3>
          <p className="text-sm leading-relaxed text-[#a0a0a0] mb-5 flex-1">{program.practice}</p>
          <Link reloadDocument={program.labUrl.endsWith('.html')} to={program.labUrl} className="text-sm underline underline-offset-4">{program.labLabel} →</Link>
        </article>)}
      </div>
      <p className="max-w-2xl text-sm leading-relaxed text-[#a0a0a0] mt-6">Задължителните проверки са в уроците. Те показват как вземаш решения по дадени условия. Собствен продукт, заснет клип, клиентска покупка и препоръка се потвърждават чрез работа извън учебната симулация.</p>
    </div>
  </section>;
}
