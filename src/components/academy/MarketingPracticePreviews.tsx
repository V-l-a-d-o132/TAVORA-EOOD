import { studioMessage, studioPlaylist, type ClosedStudio, type StudioRole, type StudioRoleName } from '@/lib/closed-practice-studio';

export function MessagePreview({ studio, matches }: { studio: ClosedStudio; matches: Record<string, string> }) {
  const parts = studioMessage(studio, matches);
  return <div className="space-y-4 text-sm leading-7 academy-body">
    <article aria-label="Съобщение от избраните части" className="space-y-3 rounded-xl border academy-border-strong academy-raised p-4">
      {!parts.length && <p className="academy-muted">Избери първата част. Тук ще видиш как избраните думи се събират в едно съобщение.</p>}
      {parts.map(part => part.part === 'headline' ? <h4 key={part.part} className="break-words text-lg font-semibold academy-text">{part.text}</h4> : <p key={part.part} className="break-words">{part.text}</p>)}
    </article>
    <p>Прочети текста като получател: разбираш ли какво се предлага, за какво ти е полезно и какво трябва да направиш? Провери и условията, които друг човек трябва да запази при препращане.</p>
    <p className="text-xs leading-5 academy-muted">Това е чернова от твоите избори по учебния случай. Прегледът показва текста; правилността се проверява с бутона под задачата. При промяна на условието се заменя съответната част.</p>
  </div>;
}

const roles: Record<StudioRoleName, string> = { seeker: 'Търси информация', user: 'Използва', payer: 'Плаща', approver: 'Одобрява', adviser: 'Дава съвет' };
export function RolesPreview({ studio, matches }: { studio: ClosedStudio; matches: Record<string, string> }) {
  const selected = studioPlaylist(studio, matches).flatMap(c => c.role ? [c.role] : []);
  // One person can hold several roles. Revised placement replaces only that
  // person's prior placement, not the roles of other participants.
  const people = new Map<string, StudioRole>();
  for (const role of selected) people.set(role.person, role);
  return <div className="space-y-4 text-sm leading-6 academy-body">
    <ol aria-label="Карта на участниците в решението" className="space-y-3">{[...people.values()].map(person => <li key={person.person} className="rounded-xl border academy-border academy-raised p-4">
      <p className="font-semibold academy-text">{person.person}</p><p className="mt-1 font-medium academy-text">{person.roles.map(role => roles[role]).join(' · ')}</p><p className="mt-2">{person.detail}</p>
    </li>)}</ol>
    {!selected.length && <p>Постави участник според даденото действие. Картата показва твоето разпределение.</p>}
    <p className="text-xs leading-5 academy-muted">Ролята се определя от фактите в този случай. Един човек може да използва и да плаща. Не следва автоматично какво мисли, колко печели или какъв избор ще направи.</p>
  </div>;
}
