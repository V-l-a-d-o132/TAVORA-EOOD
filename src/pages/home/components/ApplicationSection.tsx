import { useState } from 'react';
import InlineIcon from '@/components/base/InlineIcon';
import { supabase } from '@/lib/supabase';

const tiers = [
  {
    id: 'website' as const,
    name: 'Изработка на сайт',
    tagline: 'Базов сайт с вградено SEO',
    price: '999 €',
    note: 'базов пакет',
    features: [
      'Дизайн и разработка',
      'On-page SEO от старта',
      'Google Business Profile',
      'Мобилна оптимизация',
      'Скорост и Core Web Vitals',
    ],
    note2: 'За #1 позиции (като kfood и sunrise) — по запитване',
    highlight: true,
  },
  {
    id: 'seo' as const,
    name: 'SEO & GEO',
    tagline: 'Само органична видимост',
    price: '390 €',
    note: 'еднократно',
    features: [
      'Пълен SEO одит на сайта',
      'On-page оптимизация',
      'GEO оптимизация за AI търсачки',
      'Google Business Profile',
      'Месечен отчет',
    ],
    color: '#1B4332',
  },
  {
    id: 'ads' as const,
    name: 'Рекламни Кампании',
    tagline: 'Meta · Google · YouTube · TikTok',
    price: 'от 290 € / мес.',
    note: '+ рекламен бюджет',
    features: [
      'Настройка на кампании',
      'Таргетиране и аудитории',
      'Креативи и копирайтинг',
      'Оптимизация и отчети',
      'Управление на бюджета',
    ],
    color: '#0A2540',
  },
  {
    id: 'video' as const,
    name: 'Видео Продукция',
    tagline: 'Проф. техника — камери, микрофони, осветление',
    price: 'от 290 €',
    note: 'зависи от обема',
    features: [
      'Планиране и сценарий',
      'Снимане с проф. техника',
      'Монтаж и цветова корекция',
      'Субтитри и адаптация',
      'Доставка в 5 работни дни',
    ],
    color: '#8B1A1A',
  },
  {
    id: 'full' as const,
    name: 'Цялостно Присъствие',
    tagline: 'Всичко под един покрив',
    price: 'по запитване',
    note: 'индивидуална оферта',
    features: [
      'Сайт + SEO + GEO',
      'Рекламни кампании (всички платформи)',
      'Видео съдържание',
      'Социални медии',
      'Месечен стратегически преглед',
    ],
    color: '#0A2540',
  },
];

export default function ApplicationSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'website' | 'seo' | 'ads' | 'video' | 'full' | 'standard-course' | 'premium-course'>('website');
  const [activeTab, setActiveTab] = useState<'course' | 'services'>('course');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    // Honeypot check
    const honeypot = formData.get('company_alt');
    if (honeypot && String(honeypot).trim()) {
      setSubmitted(true);
      setLoading(false);
      return;
    }

    const tierLabel = tiers.find(t => t.id === selectedTier)?.name ?? selectedTier;
    const interest = activeTab === 'course' ? 'Академия TAVORA' : `Услуга: ${tierLabel}`;

    const firstName = String(formData.get('first_name') || '').trim();
    const lastName = String(formData.get('last_name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    try {
      const { error } = await supabase.from('course_applications').insert([{
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        message,
        interest,
        status: 'нова',
      }]);

      if (error) {
        setErrorMsg('Грешка при изпращане. Моля, опитайте отново.');
        setLoading(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setErrorMsg('Мрежова грешка. Проверете връзката и опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="application"
      className="py-8 md:py-36 bg-[#FFFFFF] w-full overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Section label */}
        <div
          className="flex items-center gap-3 mb-8 md:mb-14"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">Записване & Запитване</span>
        </div>

        {/* Tab switcher */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center p-1 rounded-2xl sm:rounded-full border border-[#1C1C1E]/10 bg-[#F9F9F9] mb-8 md:mb-12 w-full sm:w-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <button
            onClick={() => setActiveTab('course')}
            className={`px-5 py-2.5 rounded-xl sm:rounded-full text-sm transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'course'
                ? 'bg-[#0A2540] text-white'
                : 'text-[#1C1C1E]/65 hover:text-[#1C1C1E]'
            }`}
          >
            Запиши се за Академията
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-2.5 rounded-xl sm:rounded-full text-sm transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-[#0A2540] text-white'
                : 'text-[#1C1C1E]/65 hover:text-[#1C1C1E]'
            }`}
          >
            Искам услуга за бизнеса си
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
          {/* Left: Pricing */}
          <div>
            {activeTab === 'course' ? (
              <>
                <h2
                  className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Виж дали
                  <br />
                  <span className="italic text-[#0A2540]">е за теб.</span>
                </h2>
                <p
                  className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Попълнете формата. Ще прегледаме кандидатурата и ще се свържем с вас лично.
                  Без натиск. Ако не сме подходящи един за друг — ще ви кажем.
                </p>

                <div
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1B4332]/6 border border-[#1B4332]/15 mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                    <InlineIcon name="price-tag-3" className="w-4 h-4 text-[#1B4332]" />
                  </div>
                  <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                    <strong className="text-[#1B4332]">Първа група — по-ниска цена.</strong>{' '}
                    Следващите групи ще бъдат на по-висока цена.
                  </p>
                </div>

                {/* Course tiers */}
                <div className="space-y-3">
                  {[
                    {
                      id: 'standard-course' as const,
                      name: 'AI Business Blueprint',
                      sub: '11 модула — от AI промптиране до Revenue Blueprint',
                      price: '99 EUR',
                      features: ['11 модула · 74+ урока', 'Revenue Blueprint система', 'Доживотен достъп', 'Безплатни обновления'],
                    },
                    {
                      id: 'premium-course' as const,
                      name: 'Пълен достъп',
                      sub: 'Всички 3 програми + сертификат',
                      price: '249 EUR',
                      features: ['AI Business Blueprint (11 модула)', 'Перфектното Видео (15 модула)', 'Marketing Basics (20 модула)', 'Сертификат за завършване', 'Доживотен достъп до всичко'],
                      highlight: true,
                    },
                  ].map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as 'website' | 'seo' | 'ads' | 'video' | 'full' | 'standard-course' | 'premium-course')}
                        className={`w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                          isSelected && tier.highlight
                            ? 'border-[#0A2540] bg-[#0A2540]'
                            : isSelected
                            ? 'border-[#0A2540]/30 bg-[#0A2540]/3'
                            : 'border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#1C1C1E]/20'
                        }`}
                      >
                        {tier.highlight && (
                          <div className="absolute top-3 right-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-wide ${isSelected ? 'bg-white/20 text-white' : 'bg-[#0A2540]/10 text-[#0A2540]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                              НАЙ-ДОБРА СТОЙНОСТ
                            </span>
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className={`text-sm font-medium mb-0.5 ${isSelected && tier.highlight ? 'text-white' : 'text-[#1C1C1E]'}`} style={{ fontFamily: "'Inter', sans-serif" }}>{tier.name}</div>
                            <div className={`text-xs ${isSelected && tier.highlight ? 'text-white/75' : 'text-[#1C1C1E]/65'}`} style={{ fontFamily: "'Inter', sans-serif" }}>{tier.sub}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected && tier.highlight ? 'border-white bg-white' : isSelected ? 'border-[#0A2540] bg-[#0A2540]' : 'border-[#1C1C1E]/20'}`}>
                            {isSelected && <div className={`w-2 h-2 rounded-full ${tier.highlight ? 'bg-[#0A2540]' : 'bg-white'}`} />}
                          </div>
                        </div>
                        <div className={`text-2xl font-light mb-2 ${isSelected && tier.highlight ? 'text-white' : 'text-[#1C1C1E]'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>{tier.price}</div>
                        <ul className="space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {tier.features.map((f) => (
                            <li key={f} className={`flex items-center gap-2 text-xs ${isSelected && tier.highlight ? 'text-white/60' : 'text-[#1C1C1E]/65'}`}>
                              <InlineIcon name="check" className={`w-3.5 h-3.5 ${isSelected && tier.highlight ? 'text-white/80' : 'text-[#1B4332]'}`} />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>

                {/* Guarantee */}
                <div className="mt-4 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F9]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                      <InlineIcon name="shield-check" className="w-5 h-5 text-[#1B4332]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1C1C1E] mb-1">14-дневна гаранция</div>
                      <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
                        Пишете на <a href="mailto:tavoraagency@gmail.com" className="text-[#0A2540] underline decoration-dotted">tavoraagency@gmail.com</a> с тема „Гаранция". Връщаме пълната сума в 5 работни дни. Без въпроси.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2
                  className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Услуги за
                  <br />
                  <span className="italic text-[#0A2540]">вашия бизнес.</span>
                </h2>
                <p
                  className="text-sm text-[#1C1C1E]/65 leading-relaxed mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Всичко, което преподаваме — правим го и за реални клиенти. Изберете услугата, която ви интересува, и ще се свържем с вас за индивидуална оферта.
                </p>

                <div className="space-y-3">
                  {tiers.map((tier) => {
                    const isSelected = selectedTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.id as 'website' | 'seo' | 'ads' | 'video' | 'full' | 'standard-course' | 'premium-course')}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative ${
                          isSelected && tier.highlight
                            ? 'border-[#0A2540]/25 bg-[#0A2540]/4'
                            : isSelected
                            ? 'border-[#0A2540]/30 bg-[#0A2540]/4'
                            : 'border-[#1C1C1E]/8 bg-[#F9F9F9] hover:border-[#1C1C1E]/20'
                        }`}
                      >
                        {tier.highlight && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] tracking-wide">
                              БАЗОВ ПАКЕТ
                            </span>
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-1.5">
                          <div>
                            <div className="text-sm font-medium text-[#1C1C1E] mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{tier.name}</div>
                            <div className="text-xs text-[#1C1C1E]/65" style={{ fontFamily: "'Inter', sans-serif" }}>{tier.tagline}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#0A2540] bg-[#0A2540]' : 'border-[#1C1C1E]/20'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl font-light text-[#1C1C1E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{tier.price}</span>
                          <span className="text-xs text-[#1C1C1E]/65" style={{ fontFamily: "'Inter', sans-serif" }}>{tier.note}</span>
                        </div>
                        <ul className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {tier.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-[#1C1C1E]/65">
                              <InlineIcon name="check" className="w-3.5 h-3.5 text-[#1B4332]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {'note2' in tier && tier.note2 && (
                          <p className="text-[10px] text-[#1C1C1E]/70 mt-2 leading-relaxed">{tier.note2}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 md:py-16">
                <div className="w-14 h-14 flex items-center justify-center rounded-full border border-[#1B4332]/20 mb-6">
                  <InlineIcon name="check" className="w-6 h-6 text-[#1B4332]" />
                </div>
                <h3 className="text-2xl font-light text-[#1C1C1E] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Заявката е получена.
                </h3>
                <p className="text-sm text-[#1C1C1E]/65 max-w-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Ще се свържем с вас в рамките на 24 часа за потвърждение и следващи стъпки.
                </p>
              </div>
            ) : (
              <div>
                <div className="text-sm text-[#1C1C1E]/65 mb-5 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {activeTab === 'course'
                    ? 'Попълнете формата. Ще прегледаме вашата кандидатура и ще се свържем с вас в рамките на 24 часа.'
                    : 'Опишете накратко вашия бизнес и какво ви интересува. Ще се свържем с вас за индивидуална оферта.'}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 md:space-y-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Име</label>
                      <input type="text" name="first_name" required placeholder="Иван" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Фамилия</label>
                      <input type="text" name="last_name" required placeholder="Петров" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Имейл адрес</label>
                    <input type="email" name="email" required placeholder="ivan@example.com" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">Телефон</label>
                    <input type="tel" name="phone" placeholder="+359 88 888 8888" className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors" />
                  </div>

                  <div>
                    <label className="block text-xs text-[#1C1C1E]/65 mb-1.5">
                      {activeTab === 'course' ? 'Текущ опит / бизнес контекст' : 'Разкажете за вашия бизнес'}
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      maxLength={500}
                      placeholder={activeTab === 'course' ? 'Опишете накратко вашия опит и защо кандидатствате...' : 'Какъв е вашият бизнес и какво искате да постигнете?'}
                      className="w-full px-3 py-2.5 border border-[#1C1C1E]/10 rounded-xl text-sm text-[#1C1C1E] placeholder-[#1C1C1E]/25 bg-[#F9F9F9] focus:outline-none focus:border-[#0A2540]/30 transition-colors resize-none"
                    />
                  </div>

                  {/* Honeypot */}
                  <div className="opacity-0 absolute -left-[9999px]">
                    <input type="text" name="company_alt" tabIndex={-1} autoComplete="off" aria-hidden="true" readOnly />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-500 text-center">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#0A2540] text-white text-sm tracking-wide rounded-full hover:bg-[#0A2540]/90 transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {loading ? 'Изпращане...' : activeTab === 'course' ? 'Изпратете — ще се свържем с вас' : 'Поискайте оферта'}
                  </button>

                  <p className="text-xs text-[#1C1C1E]/70 text-center leading-relaxed">
                    Вашите данни са защитени. Без спам. Само потвърждение.
                  </p>
                </form>

                <div className="mt-5 pt-4 border-t border-[#1C1C1E]/6 grid grid-cols-1 sm:grid-cols-3 gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {[
                    { icon: 'ri-shield-check-line', text: '14-дневна гаранция' },
                    { icon: 'ri-lock-line', text: 'Защитено плащане' },
                    { icon: 'ri-infinity-line', text: 'Доживотен достъп' },
                  ].map((t) => (
                    <div key={t.text} className="flex flex-col items-center text-center gap-1">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <InlineIcon name={t.icon.replace('ri-', '').replace('-line', '')} className="w-4 h-4 text-[#1B4332]" />
                      </div>
                      <span className="text-[10px] text-[#1C1C1E]/65 leading-tight">{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
