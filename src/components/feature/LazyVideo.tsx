import { useState, useEffect, useRef, useCallback } from 'react';

type VideoType = 'youtube' | 'facebook';

interface LazyVideoProps {
  type: VideoType;
  /** YouTube video ID or full Facebook embed src */
  src: string;
  /** Thumbnail URL — for YouTube use https://img.youtube.com/vi/{id}/maxresdefault.jpg */
  thumbnailUrl: string;
  title: string;
  /** Direct link to watch on the platform */
  watchUrl: string;
  watchLabel?: string;
  /** Whether to auto-load when scrolled near viewport */
  autoLoad?: boolean;
}

export default function LazyVideo({
  type,
  src,
  thumbnailUrl,
  title,
  watchUrl,
  watchLabel,
  autoLoad = false,
}: LazyVideoProps) {
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer — auto-load when near viewport (YouTube only, Facebook always opens in new tab)
  useEffect(() => {
    if (loaded || !autoLoad || !containerRef.current) return;
    if (type === 'facebook') return; // Facebook Reels can't be embedded — always open in new tab

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded, autoLoad, type]);

  const handleClick = useCallback(() => {
    if (type === 'facebook') {
      // Facebook Reels cannot be embedded reliably — open in new tab
      window.open(watchUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setLoaded(true);
  }, [type, watchUrl]);

  const embedSrc =
    type === 'youtube'
      ? `https://www.youtube.com/embed/${src}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
      : src;

  const allow =
    type === 'youtube'
      ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      : 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';

  const platformColor = type === 'youtube' ? '#FF0000' : '#1877F2';
  const platformIcon = type === 'youtube' ? 'ri-youtube-fill' : 'ri-facebook-circle-fill';
  const playLabel = type === 'facebook' ? 'Гледайте във Facebook' : 'Натиснете за пускане';

  return (
    <div ref={containerRef} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      {loaded && type === 'youtube' ? (
        <iframe
          src={embedSrc}
          title={title}
          allow={allow}
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-lg"
          style={{ border: 'none' }}
        />
      ) : (
        <button
          onClick={handleClick}
          className="absolute inset-0 w-full h-full group cursor-pointer focus:outline-none rounded-lg overflow-hidden"
          aria-label={`Пусни видео: ${title}`}
        >
          {/* Thumbnail or fallback */}
          {!imgError ? (
            <img
              src={thumbnailUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#1C1C1E] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <i className={platformIcon} style={{ color: platformColor, fontSize: '2rem' }} />
                <span className="text-white/60 text-xs">{title}</span>
              </div>
            </div>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-200" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/95 group-hover:bg-white group-hover:scale-110 transition-all duration-200 shadow-sm">
              <i
                className={platformIcon}
                style={{ color: platformColor, fontSize: '1.75rem' }}
              />
            </div>
          </div>

          {/* Platform badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] backdrop-blur-sm">
              <i
                className={platformIcon}
                style={{ color: platformColor, fontSize: '0.75rem' }}
              />
              {playLabel}
            </span>
          </div>
        </button>
      )}

      {/* Watch link — always visible for Facebook, only when not loaded for YouTube */}
      {type === 'facebook' && watchLabel && (
        <div className="absolute bottom-0 left-0 right-0 translate-y-full pt-2 px-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#0A2540]/60">
            <i className="ri-external-link-line text-[10px]" />
            {watchLabel}
          </span>
        </div>
      )}
      {type === 'youtube' && !loaded && watchLabel && (
        <div className="absolute bottom-0 left-0 right-0 translate-y-full pt-2 px-1">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#0A2540]/60 hover:text-[#0A2540] transition-colors cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="ri-external-link-line text-[10px]" />
            {watchLabel}
          </a>
        </div>
      )}
    </div>
  );
}