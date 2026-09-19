import { useState, useEffect, useRef } from 'react';

interface LazyMapProps {
  src: string;
  title?: string;
  height?: number;
}

export default function LazyMap({ src, title = 'Карта', height = 260 }: LazyMapProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaded || !containerRef.current) return;

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
  }, [loaded]);

  return (
    <div ref={containerRef} style={{ height, width: '100%' }} className="relative rounded-2xl overflow-hidden border border-[#1C1C1E]/8">
      {loaded ? (
        <iframe
          title={title}
          src={src}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          onClick={() => setLoaded(true)}
          className="w-full h-full flex flex-col items-center justify-center gap-3 bg-[#F9F9F9] cursor-pointer group"
          aria-label={`Зареди карта: ${title}`}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-[#1C1C1E]/10 group-hover:scale-110 transition-transform">
            <i className="ri-map-pin-line text-[#0A2540]/60 text-xl" />
          </div>
          <span className="text-xs text-[#1C1C1E]/65">Натиснете за зареждане на картата</span>
        </button>
      )}
    </div>
  );
}