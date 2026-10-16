import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
export default function MarketingBasicsProblem() {
  return <section id="problem" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
    <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Проследи как човек стига до решение</h2>
    <p className="text-sm text-[#1C1C1E]/70 leading-relaxed mb-8">Една реклама може да доведе контакт, но човекът още има въпроси: подходяща ли е услугата, какво включва цената и на кого да се довери. Близък или онлайн група може да му помогне да провери. Курсът проследява как се запазва смисълът на предложението по този път.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[
        { title: 'Кой участва в избора', body: 'Модули 01–05: нужда, търсещ, ползвател, платец, съветник, цена и доверие.' },
        { title: 'Какво човекът ще провери', body: 'Модули 06–10: полезно съдържание, социални разговори, сайт, Google профил, търсене и ИИ.' },
        { title: 'Какво обещава кампанията', body: 'Модули 11–15: права, данни, партньорства, промоции и реклами с изпълними условия.' },
        { title: 'Какво става след контакта', body: 'Модули 16–20: измерване, обслужване, инструменти, имейл и финален учебен казус.' },
      ].map(item => <article key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/10 bg-white">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">{item.title}</h3>
        <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">{item.body}</p>
      </article>)}
    </div>
    <p className="text-sm text-[#1C1C1E]/70">{ACADEMY_PROGRAM_STATS.marketingBasics.moduleCount} модула · {ACADEMY_PROGRAM_STATS.marketingBasics.lessonCount} публикувани урока. Учиш и повтаряш проверките със свое темпо.</p>
  </section>;
}
