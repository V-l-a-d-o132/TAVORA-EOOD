import { useState } from 'react';
import { Link } from 'react-router-dom';

const MODULES = [
  {
    num: '01',
    tag: 'FREE',
    title: 'Диагностика, стратегия и психология на вниманието',
    time: '2ч · 24 урока',
    desc: 'FRAME карта за твоя проект. Одит на последните 5 видеа — къде хората спират да гледат. Content pillars за твоята ниша. Инсталиране на 3 AI инструмента за видео. Тест за ниво и старт-точка. Първи 10-секунден клип. 30-дневен план.',
    color: '#22c55e',
  },
  {
    num: '02',
    title: 'Посланието, маркетинг и продажбена психология',
    time: '1.5ч · 20 урока',
    desc: 'Сценарии, които задържат от първата секунда. Framing техники за една и съща оферта. Видео фуния от 3 стъпки: осъзнаване → доверие → оферта. CTA психология. Адаптиране на послание за TikTok, LinkedIn и YouTube.',
    color: '#3B5BDB',
  },
  {
    num: '03',
    title: 'Камера, обективи и композиция',
    time: '1.5ч · 21 урока',
    desc: '24fps vs 60fps — практическа разлика. Правило 180°, ISO тестове, ръчен фокус. Log профили и color space. Правило на третините, водещи линии, negative space, frame within frame. 10 кадъра по 10 различни композиционни принципа.',
    color: '#C2255C',
  },
  {
    num: '04',
    title: 'Осветление и цвят',
    time: '1.5ч · 17 урока',
    desc: 'Естествена светлина само с прозорец. 3-точково осветление с каквото имаш. Negative fill, rim light, мотивирана светлина. Color correction и color grading от нулата. Vectorscope и waveform. Teal-orange стил и филмови емулации.',
    color: '#7048E8',
  },
  {
    num: '05',
    title: 'Звукът',
    time: '40мин · 8 урока',
    desc: 'Lavalier vs shotgun vs вграден микрофон — тест на едно изречение. Log audio на телефон. Намиране на "най-тихото" място. Чист войсоувър без фонов шум. Синхронизация аудио-видео. Лицензирана музика без copyright риск.',
    color: '#E67700',
  },
  {
    num: '06',
    title: 'Подготовка, снимачен ден и работа с хора',
    time: '1.5ч · 18 урока',
    desc: 'Пред-продукционен чеклист. График по часове. B-roll лист преди локация. Работа с хора пред камера — от нервен говорител до интервю с дете. Режисиране на себе си без чужда помощ. Кризисен чеклист: батерия, карта, дъжд.',
    color: '#2F9E44',
  },
  {
    num: '07',
    title: 'Мобилна видеография и оборудване по бюджет',
    time: '1.5ч · 16 урока',
    desc: 'Максимални настройки на телефона (Log/ProRes/HDR). Джобен комплект с клетка и стабилизация. Гимбъл срещу ръчно държане. AI монтаж на телефон. Бюджетни нива: 300€ → 700€ → 1500€ → 5000€+. Кога си заслужава професионална техника.',
    color: '#e53e3e',
  },
  {
    num: '08',
    title: 'Batch filming и организация',
    time: '1.5ч · 16 урока',
    desc: 'Един ден = видео за цял месец. 8 сценария предварително. Смяна на outfit/локация/светлина между клипове. Backup 3-2-1 (SSD + NAS + Cloud). Папкова структура от нулата. Публикационен календар за целия batch.',
    color: '#0A2540',
  },
  {
    num: '09',
    title: 'Монтаж — основи и напреднали техники',
    time: '1.5ч · 17 урока',
    desc: 'Организация на суров материал. Темпо по платформа. Субтитри и капшъни. Adjustment layer темплейти. Proxy workflow за бавен компютър. J-cut, L-cut, speed ramp, punch-in, masking. Звуков дизайн отвъд музиката. LUT и филмови емулации.',
    color: '#3B5BDB',
  },
  {
    num: '10',
    title: 'Публикуване, SEO и платформени стратегии',
    time: '1.5ч · 16 урока',
    desc: 'Thumbnail, тестван за клик. SEO описания с ключови думи. A/B тест на заглавия. TikTok Creator Search Insights. Instagram Your Algorithm контроли. Адаптация за 4 платформи едновременно. Pinterest Video, LinkedIn B2B, Facebook Reels.',
    color: '#7048E8',
  },
  {
    num: '11',
    title: 'YouTube дълъг формат и аналитика',
    time: '1.5ч · 16 урока',
    desc: 'Видео като част от серия. Evergreen теми за дългосрочен трафик. Retention графика и drop-off анализ. Chapters, плейлисти. Traffic sources: Browse/Suggested/Search. Rewatch, shares и saves анализ. CTR и profile visits.',
    color: '#C2255C',
  },
  {
    num: '12',
    title: 'AI в целия процес',
    time: '40мин · 8 урока',
    desc: 'AI карта за всяка FRAME стъпка. Генериране на 5 сценария с AI. AI-асистиран монтаж. AI войсоувър и субтитри. AI цветна корекция/upscale. Тест за автентичност — звучиш ли като себе си или като бот. Цяло видео с AI без да е изкуствено.',
    color: '#E67700',
  },
  {
    num: '13',
    title: 'Професионална продукция, казуси и бизнес',
    time: '1.5ч · 18 урока',
    desc: 'Сам или с екип. Бриф, който друг разбира без обяснения. 5 казуса: ресторант, адвокат, фитнес, строителство, личен бранд. Клиентски workflow от запитване до архив. Ценообразуване. Договор и капаро. Абонамент vs проектна работа.',
    color: '#2F9E44',
  },
  {
    num: '14',
    title: 'Библиотека, личен стил и грешки',
    time: '1.5ч · 18 урока',
    desc: 'Адаптация на готови hooks, CTA и темплейти. Дефиниране на 3 визуални елемента на стила. "Гласова" идентичност. Стил гид за бранда. Пълен одит: камера/светлина/композиция → звук/сценарий → монтаж/публикуване. Проверка за трендове, които не пасват.',
    color: '#0A2540',
  },
  {
    num: '15',
    title: 'Финален проект: FRAME Certification',
    time: '40мин · 8 урока',
    desc: 'Реален казус. Focus → Record → Assemble → Measure → Evolve. Пълният цикъл от идея до анализ на резултата. Представяне на резултатите. Финален преглед и сертификат за завършена FRAME методология.',
    color: '#e53e3e',
  },
];

export default function PerfektnoVideoProgram() {
  const [openModule, setOpenModule] = useState<number | null>(null);

  return (
    <section id="programa" className="max-w-4xl mx-auto px-4 md:px-16 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-[1px] bg-[#1C1C1E]/20 shrink-0" />
        <span className="text-xs text-[#1C1C1E]/60 tracking-wide">Пълна програма</span>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        FRAME системата —{' '}
        <em className="text-[#1C1C1E]/55">15-те модула.</em>
      </h2>
      <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-2">
        Всеки модул е самостоятелна стъпка в системата Focus → Record → Assemble → Measure → Evolve. Модул 01 (Диагностика и стратегия) е безплатен — започни да анализираш видео нуждите на бизнеса си днес.
      </p>
      <p className="text-xs text-[#1C1C1E]/50 mb-8">
        Общо 20+ часа структурирано съдържание. 241 урока с практически задачи. Всеки урок = действие, което правиш, не тема, която учиш.
      </p>

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
          Започни с безплатния Модул 01 →
        </Link>
      </div>
    </section>
  );
}