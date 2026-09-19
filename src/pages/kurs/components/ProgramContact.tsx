import { CONTACT_EMAIL } from '@/config/pricing';

interface ProgramContactProps {
  /** Програмата, за която става дума (за по-точен текст). */
  programName?: string;
}

export default function ProgramContact({ programName }: ProgramContactProps) {
  const subject = programName
    ? `Въпрос за ${programName} — Академия TAVORA`
    : 'Въпрос за Академия TAVORA';

  return (
    <div className="pt-6 mt-6 border-t border-[#1C1C1E]/8">
      <p className="text-sm text-[#1C1C1E]/60 leading-relaxed">
        Имаш въпрос за програмата? Пиши ни на{' '}
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`}
          className="text-[#1C1C1E] font-medium underline underline-offset-2 hover:text-[#e53e3e] transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}