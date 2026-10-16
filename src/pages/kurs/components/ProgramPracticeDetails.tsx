import { Link } from 'react-router-dom';
import { ACADEMY_LEARNING_FORMAT, ACADEMY_PROGRAM_DETAILS, type AcademyProgramId } from '@/data/academy-program-details';

export default function ProgramPracticeDetails({ programId }: { programId: AcademyProgramId }) {
  const program = ACADEMY_PROGRAM_DETAILS[programId];
  return <section id="kak-uchish" className="max-w-4xl mx-auto px-4 md:px-16 py-12 md:py-16">
    <h2 className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Какво действително правиш в курса</h2>
    <div className="space-y-4 text-sm leading-relaxed text-[#1C1C1E]/75">
      <p>{ACADEMY_LEARNING_FORMAT}</p>
      <p>{program.practice}</p>
      <p>{program.comparison}</p>
      <p><strong className="text-[#1C1C1E]">Какво упражняваш: </strong>{program.outcome}</p>
      <p>{program.boundary}</p>
      <p>Публичната лаборатория е проба без оценка и XP. Задължителните проверки и запазеният учебен прогрес са в уроците на съответната програма.</p>
    </div>
    <Link reloadDocument={program.labUrl.endsWith('.html')} to={program.labUrl} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0A2540] underline underline-offset-4">{program.labLabel} →</Link>
  </section>;
}
