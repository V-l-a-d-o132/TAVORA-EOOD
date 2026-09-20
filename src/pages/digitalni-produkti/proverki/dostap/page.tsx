import { useEffect, useState, useRef, useCallback, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SharedNav from '@/components/feature/SharedNav';
import SharedFooter from '@/components/feature/SharedFooter';
import ModulePicker from '@/pages/digitalni-produkti/proverki/components/ModulePicker';
import { supabase } from '@/lib/supabase';

const SUPABASE_FUNCTIONS_URL = 'https://plxqbbgjojxfnkgotrba.supabase.co/functions/v1';

interface ChecklistItem {
  step: number;
  text: string;
}

interface Checklist {
  id: number;
  num: string;
  icon: string;
  title: string;
  intro: string;
  items: ChecklistItem[];
}

function ChecklistCard({
  checklist,
  accessCode,
}: {
  checklist: Checklist;
  accessCode: string;
}) {
  const [downloading, setDownloading] = useState(false);
  const fileName = `СИСТЕМА ${checklist.id}.html`;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDownloading(true);

    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/secure-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: accessCode,
          file_id: checklist.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Грешка при сваляне.' }));
        alert(errData.error || 'Грешка при сваляне.');
        setDownloading(false);
        return;
      }

      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      alert('Грешка при сваляне. Опитайте отново.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all group">
      <div className="flex items-center gap-4 p-4 md:p-5">
        <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-xl bg-[#0A2540]/5 flex items-center justify-center group-hover:bg-[#0A2540]/10 transition-colors">
          <i className={`ri-${checklist.icon}-line text-lg text-[#0A2540]/70`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-medium tracking-wider text-[#1C1C1E]/65">
              {checklist.num}
            </span>
            <span className="text-[10px] text-[#1C1C1E]/50 bg-[#1C1C1E]/5 px-2 py-0.5 rounded-full">
              {checklist.items.length} стъпки
            </span>
          </div>
          <h3 className="text-sm md:text-base font-medium text-[#1C1C1E] leading-snug">
            {checklist.title}
          </h3>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`shrink-0 px-4 py-2.5 text-xs font-medium rounded-full flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            downloading
              ? 'bg-[#1C1C1E]/5 text-[#1C1C1E]/40 cursor-wait'
              : 'bg-[#0A2540] text-white hover:bg-[#0A2540]/90'
          }`}
        >
          {downloading ? (
            <>
              <i className="ri-loader-4-line animate-spin text-xs" />
              Сваля...
            </>
          ) : (
            <>
              <i className="ri-download-line text-xs" />
              Изтегли
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function DigitalniProduktiDostapPage() {
  const [searchParams] = useSearchParams();
  const urlCode = (searchParams.get('code') || '').trim();

  const [authenticated, setAuthenticated] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState(urlCode);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [customerTier, setCustomerTier] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showModulePicker, setShowModulePicker] = useState(false);
  const accessCodeRef = useRef<HTMLInputElement>(null);
  const autoSubmitted = useRef(false);

  useEffect(() => {
    document.title = 'Система за дигитален маркетинг — Вашият достъп | ТАВОРА';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://imashnujnoto.com/digitalni-produkti/proverki/dostap');
    setLoading(false);
  }, []);




  useEffect(() => {
    if (!loading && !authenticated && !urlCode && accessCodeRef.current) {
      accessCodeRef.current.focus();
    }
  }, [loading, authenticated, urlCode]);

  const loadChecklists = useCallback(async (tier: string, selectedModules: number[] | null) => {
    try {
      const { data: allChecklists, error: fetchError } = await supabase
        .from('checklists')
        .select('*')
        .order('id', { ascending: true });

      if (fetchError || !allChecklists) {
        setError('Грешка при зареждане на модулите от базата.');
        return;
      }

      if (tier === 'complete') {
        setChecklists(
          allChecklists.map((cl: Record<string, unknown>) => ({
            id: cl.id as number,
            num: cl.num as string,
            icon: cl.icon as string,
            title: cl.title as string,
            intro: cl.intro as string,
            items: (cl.items as ChecklistItem[]) || [],
          }))
        );
      } else {
        const moduleIds: number[] = Array.isArray(selectedModules) ? selectedModules : [];
        const filtered = allChecklists
          .filter((cl: Record<string, unknown>) => moduleIds.includes(cl.id as number))
          .map((cl: Record<string, unknown>) => ({
            id: cl.id as number,
            num: cl.num as string,
            icon: cl.icon as string,
            title: cl.title as string,
            intro: cl.intro as string,
            items: (cl.items as ChecklistItem[]) || [],
          }));
        setChecklists(filtered);

        if (moduleIds.length === 0) {
          setShowModulePicker(true);
        }
      }
    } catch (err: any) {
      console.error('[Dostap] loadChecklists error:', err?.message || err);
      setError('Грешка при зареждане на модулите: ' + (err?.message || 'неизвестна'));
    }
  }, []);

  const submitCode = useCallback(async (code: string) => {
    setError('');
    setChecking(true);

    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/customer-lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_code: code }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        setError(result.error || 'Невалиден код. Проверете дали сте го въвели правилно.');
        setAccessCodeInput('');
        accessCodeRef.current?.focus();
        setChecking(false);
        return;
      }

      const data = result;
      setCustomerTier(data.tier || 'complete');
      setCustomerName(data.name || '');
      setAccessCode(code);

      const modules: number[] = Array.isArray(data.selected_modules) ? data.selected_modules : [];

      // If bundle/single and no modules selected, show ModulePicker inline
      if (data.tier !== 'complete' && modules.length === 0) {
        setShowModulePicker(true);
        setAuthenticated(true);
        setChecklists([]);
        setChecking(false);
        return;
      }

      await loadChecklists(data.tier, modules);
      setAuthenticated(true);
    } catch (err: any) {
      console.error('[Dostap] Access code submit error:', err?.message || err);
      setError('Грешка при свързване: ' + (err?.message || 'проверете интернета'));
    } finally {
      setChecking(false);
    }
  }, [loadChecklists]);

  useEffect(() => {
    if (!loading && urlCode && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submitCode(urlCode);
    }
  }, [loading, urlCode, submitCode]);

  // Auto-submit when code is passed via URL

  const handleAccessCodeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = accessCodeInput.trim();
    if (!trimmed) {
      setError('Моля, въведете вашия код за достъп.');
      return;
    }
    await submitCode(trimmed);
  };

  const handleModulesSelected = async () => {
    setShowModulePicker(false);
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/customer-lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_code: accessCode }),
      });

      const result = await res.json();
      const modules: number[] = res.ok && result?.selected_modules && Array.isArray(result.selected_modules) ? result.selected_modules : [];
      await loadChecklists(customerTier, modules);
    } catch {
      await loadChecklists(customerTier, []);
    }
  };



  const tierLabel =
    customerTier === 'complete'
      ? 'Пълен достъп — всички 10 системи'
      : customerTier === 'bundle'
      ? 'Пакет от 3 системи'
      : '1 система';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="flex flex-col items-center gap-3">
          <i className="ri-loader-4-line animate-spin text-2xl text-[#0A2540]/50" />
          <span className="text-sm text-[#1C1C1E]/60">Зареждане...</span>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#0A2540]/5 flex items-center justify-center mx-auto mb-4">
              <i className="ri-lock-line text-2xl text-[#0A2540]/70" />
            </div>
            <h1
              className="text-2xl md:text-3xl font-light text-[#1C1C1E] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Вашата система
            </h1>
            <p className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-1">
              Въведете кода, който получихте след плащането.
            </p>
            <p className="text-[10px] text-[#1C1C1E]/40">
              Пример: TAVORA-X7K2-M9P4
            </p>
          </div>

          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <input
                ref={accessCodeRef}
                type="text"
                value={accessCodeInput}
                onChange={(e) => {
                  setAccessCodeInput(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="TAVORA-XXXX-XXXX"
                className="w-full px-5 py-3.5 rounded-xl border border-[#1C1C1E]/12 bg-white text-sm text-[#1C1C1E] placeholder:text-[#1C1C1E]/35 focus:outline-none focus:border-[#0A2540]/40 transition-colors font-mono tracking-wider text-center"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
                <i className="ri-error-warning-line shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={checking}
              className="w-full px-6 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? (
                <>
                  <i className="ri-loader-4-line animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <i className="ri-key-2-line text-base" />
                  Отключи системата
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-[10px] text-[#1C1C1E]/50">
            Нямате код?{' '}
            <Link to="/digitalni-produkti/proverki" className="text-[#0A2540] hover:underline">
              Вземете достъп тук →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <SharedNav />

      {/* Header */}
      <section className="w-full bg-[#F9F9F7] border-b border-[#1C1C1E]/6 py-8 md:py-16 px-4 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
            <span className="text-xs text-[#1C1C1E]/60 tracking-wider">{tierLabel.toUpperCase()}</span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-light text-[#1C1C1E] leading-tight mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {customerName ? `Здравей, ${customerName.split(' ')[0]}` : 'Вашата система'}
          </h1>
          <p className="text-sm text-[#1C1C1E]/65 max-w-xl leading-relaxed">
            {customerTier === 'complete'
              ? 'Пълната система на ТАВОРА — 10 системи. Изтеглете ги и ги отворете в браузъра си — съдържат всички стъпки и насоки за сигурност.'
              : 'Избраните от вас системи. Изтеглете ги и ги отворете в браузъра си — съдържат всички стъпки и насоки за сигурност.'}
          </p>
        </div>
      </section>

      {/* Checklists */}
      <section className="w-full py-8 md:py-16 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          {checklists.length === 0 && !showModulePicker ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#0A2540]/5 flex items-center justify-center mx-auto mb-4">
                <i className="ri-inbox-line text-2xl text-[#0A2540]/50" />
              </div>
              <p className="text-sm text-[#1C1C1E]/60">
                Все още не сте избрали модули.{' '}
                <Link to="/digitalni-produkti/proverki/potvardjenie" className="text-[#0A2540] hover:underline">
                  Завършете избора си тук →
                </Link>
              </p>
            </div>
          ) : showModulePicker ? (
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
                <span className="text-xs text-[#1C1C1E]/60 tracking-wider">ИЗБЕРЕТЕ МОДУЛИ</span>
              </div>
              <h3 className="text-lg font-medium text-[#1C1C1E] mb-4">
                Изберете{' '}
                {customerTier === 'bundle' ? '3 модула' : '1 модул'}{' '}
                за достъп
              </h3>
              <ModulePicker
                tier={customerTier === 'bundle' ? 'bundle' : 'single'}
                accessCode={accessCode}
                onComplete={handleModulesSelected}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {checklists.map((checklist) => (
                <ChecklistCard
                  key={checklist.id}
                  checklist={checklist}
                  accessCode={accessCode}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Security & Usage Guidance */}
      {checklists.length > 0 && !showModulePicker && (
        <section className="w-full bg-[#0A0B0D] py-8 md:py-14 px-4 md:px-16 mt-8 md:mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Card */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5 md:p-7">
                <h2 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <i className="ri-shield-check-line text-lg" />
                  Киберсигурност и надеждност
                </h2>
                <p className="text-xs text-white/50 leading-relaxed mb-4">
                  Всеки изтеглен файл е самостоятелен HTML документ — отваря се във всеки браузър без нужда от интернет връзка.
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Запазете файловете на сигурно място на вашето устройство — препоръчително в криптирана папка или password-protected архив.',
                    'Не споделяйте файловете с трети лица. Всеки код за достъп е свързан с конкретен клиент и се мониторира.',
                    'При отваряне от USB флашка или външно устройство — уверете се, че устройството е сканирано за вируси.',
                    'Не качвайте файловете в публични cloud storage услуги (Google Drive с public линк, Dropbox public и т.н.).',
                    'Файловете НЕ съдържат тракери, скриптове за проследяване или външни заявки — напълно изолирани са.',
                    'Checkbox-овете в изтеглените файлове са локални — нищо не се изпраща към сървър.',
                    'Ако забележите неоторизирано разпространение на тези файлове, свържете се с нас незабавно.',
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-white/60 leading-relaxed">
                      <span className="text-amber-400/60 shrink-0 mt-0.5">▸</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Usage Card */}
              <div className="rounded-2xl border border-white/8 bg-white/3 p-5 md:p-7">
                <h2 className="text-base font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <i className="ri-information-line text-lg" />
                  Как да ползвате изтеглените файлове
                </h2>
                <ol className="space-y-3">
                  {[
                    { step: '1', text: '<strong>Запазете</strong> файла на вашия компютър — Desktop, Documents или специална папка за проекти.' },
                    { step: '2', text: '<strong>Отворете</strong> го с двоен клик — ще се зареди във вашия браузър по подразбиране (Chrome, Firefox, Edge, Safari).' },
                    { step: '3', text: '<strong>Преминете</strong> през всяка стъпка последователно — маркирайте checkbox-овете когато завършите стъпка.' },
                    { step: '4', text: '<strong>Връщайте се</strong> към файла когато имате нужда — той работи напълно офлайн, без интернет.' },
                    { step: '5', text: '<strong>Принтирайте</strong> (Ctrl+P / Cmd+P) ако предпочитате хартиена версия — файловете са оптимизирани и за печат.' },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-xs text-white/60 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-amber-400/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-semibold text-amber-400">{item.step}</span>
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: item.text }} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="w-full bg-[#F9F9F7] border-t border-[#1C1C1E]/6 py-8 md:py-14 px-4 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-4 md:p-8 rounded-2xl border border-[#1C1C1E]/8 bg-white">
            <div>
              <div className="text-xl md:text-2xl font-light text-[#1C1C1E] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Искате ние да приложим всичко това?
              </div>
              <p className="text-sm text-[#1C1C1E]/65">
                Това правим всеки ден за нашите клиенти. Консултация 50 €.
              </p>
            </div>
            <Link
              to="/kontakt"
              className="px-7 py-3.5 bg-[#0A2540] text-white text-sm rounded-full hover:bg-[#0A2540]/90 transition-all cursor-pointer whitespace-nowrap text-center shrink-0"
            >
              Свържете се с нас →
            </Link>
          </div>
        </div>
      </section>

      <SharedFooter />
    </div>
  );
}
