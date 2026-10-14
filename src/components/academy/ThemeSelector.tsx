import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAcademyTheme } from '@/contexts/academy-theme-state';
import type { ThemePreference } from '@/lib/academy-theme';

const OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: 'dark', label: 'Тъмна', icon: 'ri-moon-line' },
  { value: 'light', label: 'Светла', icon: 'ri-sun-line' },
  { value: 'system', label: 'По устройството', icon: 'ri-computer-line' },
];

export default function ThemeSelector() {
  const { preference, setPreference } = useAcademyTheme();
  const [open, setOpen] = useState(false);
  const id = useId();
  const location = useLocation();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selected = OPTIONS.find(option => option.value === preference)!;
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);

  return <div ref={container} className="relative shrink-0">
    <button ref={trigger} type="button" aria-label={'Тема: ' + selected.label} aria-expanded={open} aria-controls={id}
      onClick={() => setOpen(value => !value)} className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg p-2 academy-body hover:academy-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400">
      <i className={selected.icon + ' text-lg'} aria-hidden /><span className="hidden text-sm lg:inline">Тема</span>
    </button>
    {open && <fieldset id={id} className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border academy-border academy-surface p-2 shadow-xl">
      <legend className="sr-only">Избери тема</legend>
      <p className="px-3 py-2 text-xs font-semibold academy-muted" aria-hidden>Изглед на академията</p>
      {OPTIONS.map(option => <label key={option.value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm academy-body hover:academy-tint">
        <input type="radio" name={id} value={option.value} checked={preference === option.value} onChange={() => setPreference(option.value)} className="h-4 w-4 accent-[#d53636]" />
        <i className={option.icon + ' academy-muted'} aria-hidden />{option.label}
      </label>)}
    </fieldset>}
  </div>;
}
