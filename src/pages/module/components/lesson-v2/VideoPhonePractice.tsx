import { Link } from 'react-router-dom';

export default function VideoPhonePractice({ instructions }: { instructions: string }) {
  const [exercise, tail] = instructions.split('\n\nСамопроверка\n');
  if (!tail) return <p className="whitespace-pre-line leading-7 academy-body">{instructions}</p>;

  const [title, ...steps] = exercise.split('\n');
  const [checklist, ...next] = tail.split('\n\n');
  return <section className="mt-6 rounded-2xl border academy-accent-border academy-accent-bg p-5" aria-label="Практика с телефон">
    <h3 className="font-semibold academy-text">Практика с телефон · {title}</h3>
    <p className="mt-2 whitespace-pre-line leading-7 academy-body">{steps.join('\n')}</p>
    <fieldset className="mt-4 space-y-2">
      <legend className="mb-1 text-sm font-semibold academy-text">Самопроверка</legend>
      {checklist.split('\n').filter(Boolean).map(line => <label key={line} className="flex items-start gap-3 leading-6 academy-body">
        <input type="checkbox" className="mt-1 h-4 w-4 shrink-0" />
        <span>{line.replace(/^•\s*/, '')}</span>
      </label>)}
    </fieldset>
    <Link to="/academy-labs/perfect-video/montage" className="mt-4 inline-block font-semibold academy-accent underline underline-offset-4">Отвори монтажната маса</Link>
    {next.length > 0 && <p className="mt-4 text-sm academy-body">{next.join('\n\n')}</p>}
  </section>;
}
