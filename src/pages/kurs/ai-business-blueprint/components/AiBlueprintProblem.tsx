import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
export default function AiBlueprintProblem() {
  return <section id="problem" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
    <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>От полезна чернова до проверено действие</h2>
    <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-8">ИИ може да предложи текст, страница или план. За да използваш резултата, трябва да знаеш кои факти са верни, кое действие е изпълнено и кой поема отговорността. Курсът упражнява тези решения върху предоставени материали.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[
        { title: 'Задачата е неясна', body: 'Избираш един ограничен проблем, нужните входни данни и критерий за приемане на резултата.' },
        { title: 'Черновата звучи убедително', body: 'Сверяваш цена, срок и условия с източника. Липсващото остава за уточнение.' },
        { title: 'Бутонът показва успех', body: 'Проверяваш дали заявката е приета, как се обработва повторение и какво става при грешка.' },
        { title: 'Услугата трябва да се предаде', body: 'Свързваш обхват, цена, срок, отговорник и доказателство за изпълнението.' },
      ].map(item => <article key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/10 bg-white">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">{item.title}</h3>
        <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">{item.body}</p>
      </article>)}
    </div>
    <p className="text-sm text-[#1C1C1E]/70">{ACADEMY_PROGRAM_STATS.silkRoad.moduleCount} модула · {ACADEMY_PROGRAM_STATS.silkRoad.lessonCount} публикувани урока. Учиш и повтаряш проверките със свое темпо.</p>
  </section>;
}
