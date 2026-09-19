import { useState } from 'react';

const SUPABASE_FUNCTIONS_URL = 'https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1';

const ALL_MODULES = [
  { id: 1, num: '01', title: 'Промптиране и AI', icon: 'ri-robot-line' },
  { id: 2, num: '02', title: 'Дизайн в Readdy', icon: 'ri-paint-brush-line' },
  { id: 3, num: '03', title: 'SEO и GEO', icon: 'ri-search-line' },
  { id: 4, num: '04', title: 'Съдържание', icon: 'ri-file-text-line' },
  { id: 5, num: '05', title: 'Социални мрежи', icon: 'ri-share-line' },
  { id: 6, num: '06', title: 'Конверсия', icon: 'ri-line-chart-line' },
  { id: 7, num: '07', title: 'Технически основи', icon: 'ri-settings-line' },
  { id: 8, num: '08', title: 'Киберсигурност', icon: 'ri-shield-check-line' },
  { id: 9, num: '09', title: 'Аналитика', icon: 'ri-bar-chart-line' },
  { id: 10, num: '10', title: 'Автоматизация', icon: 'ri-refresh-line' },
];

interface ModulePickerProps {
  tier: 'single' | 'bundle';
  accessCode: string;
  onComplete: () => void;
}

export default function ModulePicker({ tier, accessCode, onComplete }: ModulePickerProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const maxSelect = tier === 'single' ? 1 : 3;
  const label = tier === 'single' ? 'Изберете 1 модул' : 'Изберете 3 модула';

  const toggleModule = (moduleId: number) => {
    setSelected((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      }
      if (prev.length >= maxSelect) {
        return prev;
      }
      return [...prev, moduleId];
    });
    setError('');
  };

  const handleSave = async () => {
    if (selected.length !== maxSelect) {
      setError(`Моля, изберете точно ${maxSelect} модул${maxSelect > 1 ? 'а' : ''}.`);
      return;
    }

    setSaving(true);
    setError('');

    try {
      console.log('[ModulePicker] Saving modules:', selected, 'for code:', accessCode);
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/update-modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_code: accessCode, selected_modules: selected }),
      });

      console.log('[ModulePicker] Response status:', res.status);
      const data = await res.json();
      console.log('[ModulePicker] Response data:', data);

      if (!res.ok || data.error) {
        setError(data.error || `Грешка ${res.status}. Опитайте отново.`);
        setSaving(false);
        return;
      }

      onComplete();
    } catch (err) {
      console.error('[ModulePicker] Save error:', err);
      setError('Грешка при свързване. Проверете интернета и опитайте отново.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-6 p-5 md:p-6 rounded-2xl border border-[#0A2540]/15 bg-[#0A2540]/[0.02]">
      <h3 className="text-sm font-medium text-[#1C1C1E] mb-1">{label}</h3>
      <p className="text-xs text-[#1C1C1E]/55 mb-4">
        {tier === 'single'
          ? 'Изберете модула, който искате да отключите. Останалите ще останат заключени.'
          : 'Изберете трите модула, които искате да отключите.'}
      </p>

      <div className="space-y-1.5 mb-4">
        {ALL_MODULES.map((mod) => {
          const isSelected = selected.includes(mod.id);
          const isDisabled = !isSelected && selected.length >= maxSelect;

          return (
            <button
              key={mod.id}
              onClick={() => toggleModule(mod.id)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                isSelected
                  ? 'border-[#0A2540]/30 bg-[#0A2540]/5'
                  : isDisabled
                  ? 'border-[#1C1C1E]/5 bg-white opacity-40 cursor-not-allowed'
                  : 'border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15'
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? 'border-[#0A2540] bg-[#0A2540]' : 'border-[#1C1C1E]/20'
              }`}>
                {isSelected && <i className="ri-check-line text-white text-[10px]" />}
              </div>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-[#0A2540] text-white' : 'bg-[#1C1C1E]/5'
              }`}>
                <i className={`${mod.icon} ${isSelected ? 'text-white' : 'text-[#1C1C1E]/50'} text-xs`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium leading-snug block ${
                  isSelected ? 'text-[#0A2540]' : 'text-[#1C1C1E]/70'
                }`}>
                  {mod.num}. {mod.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#1C1C1E]/45">
          Избрани: {selected.length} / {maxSelect}
        </span>
        <button
          onClick={handleSave}
          disabled={saving || selected.length !== maxSelect}
          className="px-5 py-2.5 bg-[#0A2540] text-white text-xs rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {saving ? (
            <>
              <i className="ri-loader-4-line animate-spin" />
              Запазване...
            </>
          ) : (
            <>
              <i className="ri-save-line" />
              Запази избора
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] flex items-center gap-1.5">
          <i className="ri-error-warning-line shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}