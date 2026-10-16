export default function MarketingBasicsWhyTavora() {
  return <section id="zashto-tavora" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
    <p className="text-xs text-[#1C1C1E]/65 mb-4">Защо този подход</p>
    <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Започваш с човека и причината да избира.</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {[
          { title: 'Участници в решението', body: 'Различаваш кой търси, кой ползва, кой плаща и кой съветва. Една препоръка не доказва, че услугата е подходяща.' },
          { title: 'Послание с верни условия', body: 'Сравняваш какво е обещал бизнесът и какво се предава в семейството, между колеги или в онлайн група. Пазиш обхвата, цената и неизвестното.' },
          { title: 'Проверка след контакта', body: 'Свързваш заявката с обслужване, разход и капацитет. Разделяш показване, контакт, покупка и доказана препоръка.' },
      ].map(item => <article key={item.title} className="p-6 rounded-2xl border border-[#1C1C1E]/10 bg-white">
        <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">{item.title}</h3>
        <p className="text-sm text-[#1C1C1E]/70 leading-relaxed">{item.body}</p>
      </article>)}
    </div>
    <p className="p-6 rounded-2xl bg-[#0F1F35] text-sm leading-relaxed text-white">Българските учебни ситуации са контекст за решения, а не статистически извод за всички хора. При различни нужди и условия може да е подходящо различно послание.</p>
  </section>;
}
