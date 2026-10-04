import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PUBLIC_PATHS } from '@/config/public-paths';
import { EDITORIAL_IMAGE_SRC, EDITORIAL_IMAGE_URL, EDITORIAL_IMAGE_ALT, EDITORIAL_IMAGE_WIDTH, EDITORIAL_IMAGE_HEIGHT } from '@/config/editorial-image';

const ORIGIN = 'https://imashnujnoto.com';
const DEFAULT_IMAGE = 'https://storage.readdy-site.link/project_files/3f265d07-5825-4e88-a58a-44deb287b858/e232f6df-04d9-4738-9beb-0ed8800a0ec8_TAVORA-MARKETING-AGENCY-VELIKO-TARNOVO.webp?v=501711babf873985bfce13811f385bfa';
const publicPaths = new Set<string>(PUBLIC_PATHS);

function setMeta(attribute: 'name' | 'property', key: string, value: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  if (element.content !== value) element.content = value;
}

/** SPA navigation must update canonical and sharing metadata together. */
export default function PageMetadataSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const indexable = publicPaths.has(path);
    const editorial = path === '/blog' || path === '/novini' || path.startsWith('/blog/') || /^\/blog-(seo|reklama)-vt$/.test(path)
      || path === '/digitalen-marketing-veliko-tarnovo' || path === '/video-produkciya-veliko-tarnovo';
    const article = editorial && path !== '/blog' && path !== '/novini';
    let active = true;
    let queued = false;
    const sync = () => {
      if (!active) return;
      const url = `${ORIGIN}${path}`;
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content || '';
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      if (canonical.href !== url) canonical.href = url;
      setMeta('name', 'robots', indexable ? 'index,follow,max-image-preview:large' : 'noindex,nofollow');
      setMeta('property', 'og:title', document.title);
      setMeta('property', 'og:description', description);
      setMeta('property', 'og:url', url);
      setMeta('property', 'og:type', article ? 'article' : 'website');
      setMeta('name', 'twitter:title', document.title);
      setMeta('name', 'twitter:description', description);
      setMeta('property', 'og:image', editorial ? EDITORIAL_IMAGE_URL : DEFAULT_IMAGE);
      setMeta('property', 'og:image:width', String(editorial ? EDITORIAL_IMAGE_WIDTH : 512));
      setMeta('property', 'og:image:height', String(editorial ? EDITORIAL_IMAGE_HEIGHT : 512));
      setMeta('property', 'og:image:alt', editorial ? EDITORIAL_IMAGE_ALT : 'ТАВОРА ЕООД — Дигитален маркетинг Велико Търново');
      setMeta('name', 'twitter:image', editorial ? EDITORIAL_IMAGE_URL : DEFAULT_IMAGE);
      const pageSchema = document.getElementById('schema-site-page');
      if (pageSchema?.textContent) {
        try {
          const data = JSON.parse(pageSchema.textContent) as Record<string, unknown>;
          Object.assign(data, { '@id': `${url}#webpage`, url, name: document.title, description });
          const json = JSON.stringify(data);
          if (pageSchema.textContent !== json) pageSchema.textContent = json;
        } catch { /* Invalid third-party markup must not interrupt navigation. */ }
      }
    };
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => { queued = false; sync(); });
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['content', 'href'] });
    sync();
    // All images use native lazy loading as requested; discover the small cover
    // before the article chunk so its first-screen image still has priority.
    let preload: HTMLLinkElement | undefined;
    if (editorial) {
      preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'image';
      preload.href = EDITORIAL_IMAGE_SRC;
      preload.setAttribute('fetchpriority', 'high');
      document.head.appendChild(preload);
    }
    return () => { active = false; observer.disconnect(); preload?.remove(); };
  }, [pathname]);
  return null;
}
