import { studioPlaylist, type ClosedStudio, type StudioDocument, type StudioPagePart, type StudioSearchPart } from '@/lib/closed-practice-studio';

type Props = { studio: ClosedStudio; matches: Record<string, string> };

export function BriefPreview({ studio, matches }: Props) {
  const parts = new Map<StudioDocument['part'], StudioDocument>();
  for (const choice of studioPlaylist(studio, matches)) if (choice.document) parts.set(choice.document.part, choice.document);
  return <div className="space-y-4 text-sm leading-7 academy-body">
    <article aria-label="Задание от избраните части" className="space-y-4 rounded-xl border academy-border academy-raised p-4">
      {!parts.size && <p>Избери първата част. Тук ще прочетеш заданието, което подготвяш.</p>}
      {[...parts.values()].map(part => <section key={part.part}><h4 className="font-semibold academy-text">{part.title}</h4><p className="mt-1 whitespace-pre-line break-words">{part.text}</p></section>)}
    </article>
    <p className="text-xs leading-5 academy-muted">Получаваш четимо задание от предоставените части. Прегледът не изпраща заявка към модел. След промяната се заменя засегнатата част; останалите условия се запазват.</p>
  </div>;
}

export function PagePreview({ studio, matches }: Props) {
  const parts = new Map<StudioPagePart['part'], StudioPagePart>();
  const selected = studioPlaylist(studio, matches).flatMap(choice => choice.page ? [choice.page] : []);
  for (const part of selected) parts.set(part.part, part);
  const font = [...selected].reverse().find(part => part.font)?.font;
  const contrast = [...selected].reverse().find(part => part.contrast)?.contrast;
  const width = [...selected].reverse().find(part => part.width)?.width;
  const image = parts.get('image');
  return <div className="space-y-4 text-sm leading-6 academy-body">
    <div className={`mx-auto w-full overflow-hidden rounded-xl border academy-border academy-raised ${width === 'mobile' ? 'max-w-[290px]' : ''}`}>
      <p className="border-b academy-border px-4 py-2 text-xs academy-muted">Учебна страница · преглед на избраните части</p>
      <article aria-label="Преглед на учебната страница" className="space-y-4 p-4" style={{ fontSize: font === 'small' ? '12px' : '16px', lineHeight: font === 'small' ? '1.35' : '1.65' }}>
        {parts.get('navigation') && <p className="border-b academy-border pb-3 text-sm underline">{parts.get('navigation')?.text}</p>}
        <h4 className="break-words text-xl font-semibold academy-text">{parts.get('heading')?.text || 'Заглавието ще се появи тук'}</h4>
        {parts.get('description') && <p className="break-words">{parts.get('description')?.text}</p>}
        {image && <figure><div className={`mx-auto overflow-hidden rounded-lg border academy-border ${image.image === 'square' ? 'aspect-square w-36' : 'aspect-[2/1] w-full'}`}>
          <svg viewBox="0 0 400 200" role="img" aria-label="Предоставена учебна композиция: предмет и етикет" className="h-full w-full academy-tint" preserveAspectRatio={image.image === 'square' ? 'xMidYMid slice' : 'xMidYMid meet'}>
            <rect x="20" y="35" width="130" height="130" rx="14" fill="currentColor" opacity=".12" /><path d="M55 125h60V80H55zM65 80V65h40v15" fill="none" stroke="currentColor" strokeWidth="5" /><rect x="205" y="50" width="175" height="100" rx="8" fill="currentColor" opacity=".08" /><text x="220" y="92" fill="currentColor" fontSize="16">Учебен продукт</text><text x="220" y="120" fill="currentColor" fontSize="13">Условия до снимката</text>
          </svg>
        </div><figcaption className="mt-2 break-words text-xs academy-muted">{image.text}</figcaption></figure>}
        {parts.get('terms') && <p className="break-words rounded-lg p-3" style={contrast === 'muted' ? { color: '#c5c5c5', background: '#f5f5f5' } : undefined}>{parts.get('terms')?.text}</p>}
        {parts.get('action') && <p className="rounded-lg academy-primary px-4 py-3 text-center font-semibold text-white">{parts.get('action')?.text}</p>}
        {parts.get('status') && <p role="status" className="rounded-lg border academy-border p-3">{parts.get('status')?.text}</p>}
        {parts.get('layout') && <p className="border-t academy-border pt-3 text-xs academy-muted">{parts.get('layout')?.text}</p>}
      </article>
    </div>
    {contrast === 'muted' && <p className="text-xs leading-5 academy-muted">Условието в показания вариант: {parts.get('terms')?.text}. Бледият образец демонстрира избраното оформление; този ред пази текста достъпен.</p>}
    <p className="text-xs leading-5 academy-muted">Това е предоставен учебен преглед. Бутонът е образец на текст и не изпраща форма. Провери избора с бутона под задачата.</p>
  </div>;
}

export function SearchPreview({ studio, matches }: Props) {
  const parts = new Map<StudioSearchPart['part'], StudioSearchPart>();
  for (const choice of studioPlaylist(studio, matches)) if (choice.search) parts.set(choice.search.part, choice.search);
  return <div className="space-y-4 text-sm leading-6 academy-body">
    <article aria-label="Учебен преглед на заглавие и описание" className="space-y-2 rounded-xl border academy-border academy-raised p-4">
      <p className="break-all text-xs academy-muted">{parts.get('address')?.text || 'example.invalid / учебна-страница'}</p>
      <h4 className="break-words text-lg font-semibold academy-accent">{parts.get('title')?.text || 'Избери заглавие за страницата'}</h4>
      <p className="break-words">{parts.get('snippet')?.text || 'Избраното описание ще се покаже тук.'}</p>
    </article>
    <p className="text-xs leading-5 academy-muted">Сравняваш текстовете на страницата. Това не е резултат от Google, прогнозна позиция или обещание как търсачката ще покаже страницата.</p>
  </div>;
}
