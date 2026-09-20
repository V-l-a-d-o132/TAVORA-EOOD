import { lazy, type ComponentType } from 'react';

type PageModule = { default: ComponentType };

const CHUNK_ERROR = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i;
const RELOAD_PREFIX = 'tavora:route-chunk-reload:';

/**
 * Recovers from an old browser tab requesting chunks removed by a new deploy.
 * A route is reloaded at most once, so a genuine application error is never
 * hidden behind an infinite refresh loop.
 */
export function lazyWithReload(importer: () => Promise<PageModule>) {
  return lazy(async () => {
    const reloadKey = `${RELOAD_PREFIX}${typeof window === 'undefined' ? 'server' : window.location.pathname}`;

    try {
      const page = await importer();
      if (typeof window !== 'undefined') sessionStorage.removeItem(reloadKey);
      return page;
    } catch (error) {
      if (
        typeof window !== 'undefined'
        && CHUNK_ERROR.test(String(error))
        && sessionStorage.getItem(reloadKey) !== '1'
      ) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
        return new Promise<PageModule>(() => undefined);
      }
      throw error;
    }
  });
}
