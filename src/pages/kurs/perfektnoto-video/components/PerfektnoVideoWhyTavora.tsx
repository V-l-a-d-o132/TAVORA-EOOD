export default function PerfektnoVideoWhyTavora() {
  return <section id="zashto-tavora" className="mx-auto max-w-4xl px-4 py-14 md:px-16 md:py-20">
    <p className="mb-5 text-xs tracking-wide text-[#1C1C1E]/60">Как преподаваме в TAVORA</p>
    <h2 className="mb-4 text-3xl font-light text-[#1C1C1E] md:text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Покажи действието. Обясни избора. Провери резултата.</h2>
    <p className="mb-8 text-sm leading-7 text-[#1C1C1E]/70">Това е нашият целенасочен подход. След обяснението трябва да можеш да разпознаеш проблем и да избереш какво да промениш.</p>
    <div className="grid gap-5 md:grid-cols-3">{[
      { title: 'Видим и чут пример', body: 'Променяш кадриране, фокус, светлина или ред на сцените. При звука слушаш една и съща реплика с различни дефекти.' },
      { title: 'Решение с условия', body: 'Телефон, камера, време и бюджет са част от случая. Избираш действие според конкретния проблем и получаваш причина за отговора.' },
      { title: 'История през целия процес', body: 'Сценарият, кадрите, звукът и монтажът отговарят на един въпрос: разбира ли зрителят какво се случва и защо?' },
    ].map(item => <div key={item.title} className="rounded-2xl border border-[#1C1C1E]/10 p-6"><h3 className="mb-3 text-base font-medium text-[#1C1C1E]">{item.title}</h3><p className="text-sm leading-7 text-[#1C1C1E]/70">{item.body}</p></div>)}</div>
  </section>;
}
