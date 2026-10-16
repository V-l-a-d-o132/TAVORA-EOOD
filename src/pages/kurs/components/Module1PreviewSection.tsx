import { Link } from 'react-router-dom';
import { LEARNING_SECTIONS } from '@/mocks/learning-platform';

const FREE_MODULE = LEARNING_SECTIONS[0].modules[0];
const DECISIONS = [
  'Избираш малка задача за учебното велоателие „Орбита“ и поставяш граница на това, което ИИ може да обещае.',
  'Сглобяваш задание по предоставени източници. При промяна на условията поправяш и черновата.',
  'Сравняваш общото време за приет резултат, включително проверките и поправките.',
  'Определяш права на помощник, човешко одобрение и действие при неизвестно състояние на операцията.',
];

export default function Module1PreviewSection() {
  return <section id="module1-preview" className="w-full py-12 md:py-24 px-4 md:px-16 bg-[#0a0a0a] text-white">
    <div className="max-w-6xl mx-auto">
      <p className="text-xs uppercase tracking-widest text-green-400 mb-5">Четири пълни безплатни урока</p>
      <h2 className="text-2xl md:text-4xl font-bold mb-5">Модул 01: {FREE_MODULE.title}</h2>
      <p className="max-w-2xl text-sm md:text-base text-[#a0a0a0] leading-relaxed mb-8">Започваш с конкретна задача, източници и готови варианти. След показания пример решаваш нов случай и променяш избора си при ново условие. Така можеш да прецениш начина на учене преди покупка.</p>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {FREE_MODULE.lessons.map((lesson, index) => <li key={lesson.id} className="border border-[#333] bg-[#111] p-5">
          <p className="text-xs text-green-400 mb-3">Урок {index + 1}</p>
          <h3 className="font-semibold mb-3">{lesson.title}</h3>
          <p className="text-sm text-[#a0a0a0] leading-relaxed mb-4">{DECISIONS[index]}</p>
          <Link to={`/module/${FREE_MODULE.id}?lesson=${index}`} className="text-sm underline underline-offset-4 text-white">Отвори пълния урок →</Link>
        </li>)}
      </ol>
      <p className="max-w-2xl text-sm text-[#a0a0a0] leading-relaxed mb-6">Без карта, качване на файлове или свободни писмени отговори. Можеш да опиташ като гост; акаунтът е нужен за запазен учебен прогрес. Публичната лаборатория е отделна проба без оценка и XP.</p>
      <div className="flex flex-wrap gap-4 items-center">
        <Link to="/module/s01-m01?lesson=0" className="px-5 py-3 bg-[#e53e3e] text-white font-semibold text-sm">Започни първия урок</Link>
        <Link to="/academy-labs/silk-road/start" className="text-sm underline underline-offset-4">Опитай и прототипа за заявки →</Link>
      </div>
    </div>
  </section>;
}
