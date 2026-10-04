import { ACADEMY_PROGRAM_STATS } from '@/config/academy-catalog';
export default function PerfektnoVideoProblem() {
  return (
    <section id="problem" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Проблемът</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Имаш идея за видео.{' '}
        <em className="text-[#1C1C1E]/55">Как да я превърнеш в готов файл?</em>
      </h2>

      <div className="space-y-4 text-sm text-[#1C1C1E]/65 leading-relaxed mb-8">
        <p>
          С видео можеш да покажеш продукт, да обясниш процес и да отговориш на въпрос на клиента.
          Стойността му зависи от задачата, изпълнението и мястото на гледане.
          В програмата проверяваш какво зрителят разбира и какво може да направи след клипа.
        </p>
        <p>
          Работният процес започва с ясна задача и изпълним сценарий.
          После избираш кадри, светлина и звук, заснемаш, монтираш и проверяваш финалния файл.
          Гледанията, разбирането и продажбите са различни резултати и се измерват отделно.
        </p>
        <p>
          <strong className="text-[#1C1C1E]">Перфектното Видео</strong> подрежда тези решения в 15 модула.
          Започваш с наличен телефон или камера и собствена безопасна задача.
          Клиентските резултати, посочени на страницата, се отнасят до конкретни проекти и не са обещание за резултат от курса.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          {
            icon: 'ri-emotion-unhappy-line',
            title: 'Неудобно ти е пред камера',
            desc: 'Модули 01–02 помагат да изясниш задачата и думите си. Модул 06 включва проби и работа с човек пред камера; можеш да упражняваш и със собствен запис.',
          },
          {
            icon: 'ri-money-dollar-circle-line',
            title: 'Нямаш бюджет за продукция',
            desc: 'Модул 07 работи с наличния телефон. Проверяваш звук, опора, светлина и финален файл, преди да решиш дали конкретна задача изисква допълнително оборудване.',
          },
          {
            icon: 'ri-line-chart-line',
            title: 'Правил си видеа, но не конвертират',
            desc: 'Модул 02 свързва посланието с действие, модул 10 — с публикуването, а модул 11 — с анализа. Проверяваш наличните сигнали и ограниченията, преди да приписваш продажби на клипа.',
          },
          {
            icon: 'ri-puzzle-line',
            title: 'Нямаш цялостен процес',
            desc: 'Преминаваш от бриф през заснемане и монтаж до проверка и поправена версия. Финалният проект събира решенията и файловете в работен казус.',
          },
        ].map((item) => (
          <div key={item.title} className="p-5 rounded-2xl border border-[#1C1C1E]/8 bg-white flex items-start gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0 bg-[#0A2540]/6">
              <i className={`${item.icon} text-sm text-[#0A2540]`} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#1C1C1E] mb-1">{item.title}</h4>
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#F9F9F7] border border-[#1C1C1E]/6">
        {[
          { value: '15', label: 'модула · учиш със свое темпо' },
          { value: String(ACADEMY_PROGRAM_STATS.perfectVideo.lessonCount), label: 'урока с практически задачи' },
          { value: '+280%', label: 'ръст на трафик с видео (K-Food)' },
          { value: '30 дни', label: 'гаранция за възстановяване на сумата' },
        ].map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.value}</div>
            <div className="text-[10px] text-[#1C1C1E]/65 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
