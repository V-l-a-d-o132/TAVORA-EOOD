import LazyVideo from '@/components/feature/LazyVideo';

export default function AgencyNPOSection() {
  const npos = [
    {
      name: 'Академика 245',
      url: 'https://akademika245.com/',
      logo: 'ri-graduation-cap-line',
      desc: 'Образователна НПО организация. Видео продукция с Натан Петков по проект за домашното насилие — милиони импресии в социалните медии.',
      stats: [
        { value: 'Млн.', label: 'импресии' },
        { value: 'видео', label: 'продукция' },
        { value: 'десетки', label: 'проекта' },
      ],
    },
    {
      name: 'Амалипе',
      url: 'https://amalipe.bg/',
      logo: 'ri-community-line',
      desc: 'Водеща НПО за ромска интеграция в България. Видео продукция за мащабни социални кампании с национален обхват.',
      stats: [
        { value: 'млн.', label: 'импресии' },
        { value: 'видео', label: 'продукция' },
        { value: 'нац.', label: 'обхват' },
      ],
    },
  ];

  return (
    <section
      id="npo"
      className="py-8 md:py-28 bg-white w-full overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-[1px] bg-[#0A2540]/30 shrink-0" />
          <span className="text-xs text-[#1C1C1E]/60">НПО сектор</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 md:mb-14">
          <h2
            className="text-2xl md:text-4xl font-light text-[#1C1C1E] leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Видео продукция
            <br />
            <span className="italic text-[#0A2540]">за НПО организации.</span>
          </h2>
          <p className="text-sm text-[#1C1C1E]/65 leading-relaxed self-end max-w-md">
            Работили сме с две от водещите НПО организации в България. Заснемане с професионална техника,
            монтаж и съдържание, което достига реална аудитория — над милион гледания общо.
          </p>
        </div>

        {/* Combined stat banner */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 mb-10 rounded-2xl border border-[#0A2540]/8 bg-[#F9F9F9] overflow-hidden">
          {[
            { icon: 'ri-bar-chart-2-line', value: 'Милиони', label: 'импресии в социалните медии' },
            { icon: 'ri-eye-line', value: '1M+', label: 'гледания общо' },
            { icon: 'ri-video-line', value: 'Видео', label: 'продукция с проф. техника' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 flex flex-col items-center justify-center py-6 px-4 text-center w-full ${
                i < 2 ? 'border-b sm:border-b-0 sm:border-r border-[#0A2540]/8' : ''
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center mb-2">
                <i className={`${s.icon} text-[#0A2540]/65 text-lg`} />
              </div>
              <div
                className="text-xl md:text-2xl font-light text-[#0A2540] mb-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.value}
              </div>
              <div className="text-[10px] text-[#1C1C1E]/65 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>

        {/* NPO cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {npos.map((npo) => (
            <div
              key={npo.name}
              className="p-5 md:p-6 rounded-2xl border border-[#1C1C1E]/8 bg-white hover:border-[#0A2540]/15 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#0A2540]/10 bg-[#0A2540]/4">
                    <i className={`${npo.logo} text-[#0A2540]/60 text-base`} />
                  </div>
                  <span
                    className="text-base font-medium text-[#1C1C1E]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {npo.name}
                  </span>
                </div>
                <a
                  href={npo.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-[10px] text-[#0A2540]/65 hover:text-[#0A2540] transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-external-link-line text-xs" />
                  <span>Сайт</span>
                </a>
              </div>

              <div className="h-px bg-[#1C1C1E]/6 mb-4" />
              <p className="text-xs text-[#1C1C1E]/65 leading-relaxed mb-5">{npo.desc}</p>

              <div className="flex gap-4">
                {npo.stats.map((st) => (
                  <div key={st.label} className="flex flex-col gap-0.5">
                    <span
                      className="text-sm font-light text-[#0A2540]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {st.value}
                    </span>
                    <span className="text-[10px] text-[#1C1C1E]/65 leading-tight">{st.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Video section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Facebook Reel — Akademika 245 */}
          <div className="rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-facebook-circle-fill text-[#1877F2] text-base" />
                </div>
                <span className="text-xs font-medium text-[#1C1C1E]/60">Facebook Reel — Академика 245</span>
              </div>
              <p className="text-[10px] text-[#1C1C1E]/65 leading-relaxed">
                Видео продукция с Натан Петков по проект за домашното насилие — кампания на Академика 245.
              </p>
            </div>
            <div className="px-5 pb-5">
              <LazyVideo
                type="facebook"
                src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F4228757277440339&show_text=false&width=560"
                thumbnailUrl="https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/8d3b4d25-8dde-4da9-aa56-0ccd87c38867_NATAN-PETKOW.jpg?v=b599eefaf2a6b7b8cfbff0e3389d53fa"
                title="Академика 245 — видео продукция с Натан Петков"
                watchUrl="https://www.facebook.com/reel/4228757277440339"
                watchLabel="Гледайте в Facebook →"
              />
            </div>
          </div>

          {/* YouTube — Vladimir interview */}
          <div className="rounded-2xl border border-[#1C1C1E]/8 bg-[#F9F9F9] overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-youtube-fill text-[#FF0000] text-base" />
                </div>
                <span className="text-xs font-medium text-[#1C1C1E]/60">YouTube — Интервю с Владимир Атанасов</span>
              </div>
              <p className="text-[10px] text-[#1C1C1E]/65 leading-relaxed">
                Кратко интервю с Владимир Атанасов — за медийната грамотност и дигиталното образование.
              </p>
            </div>
            <div className="px-5 pb-5">
              <LazyVideo
                type="youtube"
                src="WdUUckZ19jI"
                thumbnailUrl="https://img.youtube.com/vi/WdUUckZ19jI/maxresdefault.jpg"
                title="Интервю с Владимир Атанасов — дигитален маркетинг"
                watchUrl="https://www.youtube.com/watch?v=WdUUckZ19jI"
                watchLabel="Гледайте в YouTube →"
              />
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-[#1C1C1E]/8 bg-[#F9F9F9]">
          <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
            <i className="ri-video-add-line text-[#1C1C1E]/65 text-sm" />
          </div>
          <p className="text-xs text-[#1C1C1E]/65 leading-relaxed">
            Снимаме с професионална техника — камери, микрофони, осветление. Натан участва пред камерата. Монтаж и доставка в 5 работни дни.
          </p>
        </div>
      </div>
    </section>
  );
}
