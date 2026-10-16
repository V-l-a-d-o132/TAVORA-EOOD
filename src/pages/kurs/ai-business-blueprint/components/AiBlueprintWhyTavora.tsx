export default function AiBlueprintWhyTavora() {
  return <section id="zashto-tavora" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
    <p className="text-xs text-[#1C1C1E]/65 mb-4">Защо този подход</p>
    <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Практиката свързва обещанието с изпълнението.</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {[
          { title: 'Работа по източници', body: 'Сравняваш ИИ чернови с предоставени факти, откриваш липсващи условия и избираш какво трябва да се уточни.' },
          { title: 'Последствия от избора', body: 'Променяш план в учебния прототип и проверяваш реално изпълненото действие, повторенията и липсващия контакт.' },
          { title: 'Приемане на работа', body: 'Свързваш обхват, цена, срок, отговорник и доказателство за изпълнение в предоставени случаи.' },
      ].map(item => <article key={item.title} className="p-6 rounded-2xl border border-[#1C1C1E]/10 bg-white">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">{item.title}</h3>
        <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">{item.body}</p>
      </article>)}
    </div>
    <p className="p-6 rounded-2xl bg-[#0F1F35] text-sm leading-relaxed text-white">Първият модул е завършена безплатна проба с четири урока. След него можеш да прецениш дали искаш останалите теми; няма автоматична покупка.</p>
  </section>;
}
