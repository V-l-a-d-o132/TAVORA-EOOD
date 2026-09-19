/* ─── Meta Pixel Central Handler — единствен source of truth ─── */
/*  Нечуплива архитектура: type-safe, dedup, graceful degradation     */

export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'AddToCart'
  | 'Search'
  | 'AddPaymentInfo'
  | 'Subscribe';

export interface MetaPixelParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string | 'product' | 'product_group';
  value?: number;
  currency?: string;
  num_items?: number;
  predicted_ltv?: number;
  search_string?: string;
  status?: string | boolean;
  [key: string]: unknown;
}

/* ─── Configuration ─── */
const PIXEL_ID: string = (import.meta.env as Record<string, string>).VITE_PUBLIC_META_PIXEL_ID || '';
const ACADEMY_PIXEL_ID: string = (import.meta.env as Record<string, string>).VITE_PUBLIC_ACADEMY_META_PIXEL_ID || '';
const DEDUP_WINDOW_MS = 5000;
const MAX_RECENT_EVENTS = 50;

/* ─── Deduplication ring buffer ─── */
const recentKeys: string[] = [];
const recentTimestamps: number[] = [];

function isDuplicate(key: string): boolean {
  const now = Date.now();
  // Purge expired entries
  let writeIdx = 0;
  for (let i = 0; i < recentKeys.length; i++) {
    if (now - recentTimestamps[i] < DEDUP_WINDOW_MS) {
      recentKeys[writeIdx] = recentKeys[i];
      recentTimestamps[writeIdx] = recentTimestamps[i];
      writeIdx++;
    }
  }
  recentKeys.length = writeIdx;
  recentTimestamps.length = writeIdx;

  // Check if key exists
  return recentKeys.includes(key);
}

function recordEvent(key: string): void {
  recentKeys.push(key);
  recentTimestamps.push(Date.now());
  if (recentKeys.length > MAX_RECENT_EVENTS) {
    recentKeys.shift();
    recentTimestamps.shift();
  }
}

/* ─── Safe fbq access ─── */
function isFbqReady(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof (window as Record<string, unknown>).fbq === 'function';
}

function safeFbq(method: string, ...args: unknown[]): void {
  if (!isFbqReady()) {
    if (import.meta.env.DEV) console.warn('[MetaPixel] fbq not loaded, queued:', method);
    return;
  }
  try {
    const f = window.fbq as (...a: unknown[]) => void;
    f(method, ...args);
  } catch (err) {
    if (import.meta.env.DEV) console.error('[MetaPixel] Error:', err);
  }
}

/* ─── Academy Pixel: lazy init + trackSingle ─── */
let academyPixelInitialized = false;

function initAcademyPixel(): void {
  if (!ACADEMY_PIXEL_ID || academyPixelInitialized || !isFbqReady()) return;
  try {
    const f = window.fbq as (...a: unknown[]) => void;
    f('init', ACADEMY_PIXEL_ID);
    academyPixelInitialized = true;
    if (import.meta.env.DEV) console.log('[MetaPixel][Academy] Initialized:', ACADEMY_PIXEL_ID);
  } catch (err) {
    if (import.meta.env.DEV) console.error('[MetaPixel][Academy] Init error:', err);
  }
}

function safeFbqSingle(method: string, ...args: unknown[]): void {
  if (!isFbqReady()) return;
  if (!academyPixelInitialized) initAcademyPixel();
  if (!ACADEMY_PIXEL_ID) return;
  try {
    const f = window.fbq as (...a: unknown[]) => void;
    f('trackSingle', ACADEMY_PIXEL_ID, method, ...args);
  } catch (err) {
    if (import.meta.env.DEV) console.error('[MetaPixel][Academy] Track error:', err);
  }
}

function safeFbqSingleCustom(eventName: string, params?: Record<string, unknown>): void {
  if (!isFbqReady()) return;
  if (!academyPixelInitialized) initAcademyPixel();
  if (!ACADEMY_PIXEL_ID) return;
  try {
    const f = window.fbq as (...a: unknown[]) => void;
    f('trackSingleCustom', ACADEMY_PIXEL_ID, eventName, params || {});
  } catch (err) {
    if (import.meta.env.DEV) console.error('[MetaPixel][Academy] Custom track error:', err);
  }
}

/* ─── Public API ─── */

export const metaPixel = {
  /** Read-only pixel ID */
  get pixelId(): string {
    return PIXEL_ID;
  },

  /** Check if pixel is configured */
  get isReady(): boolean {
    return !!PIXEL_ID && isFbqReady();
  },

  /**
   * Track a standard Meta event.
   * Automatically deduplicates identical events within DEDUP_WINDOW_MS.
   */
  track(event: MetaStandardEvent, params?: MetaPixelParams, eventId?: string): void {
    if (!PIXEL_ID) {
      if (import.meta.env.DEV) console.warn('[MetaPixel] No Pixel ID configured');
      return;
    }

    const eventKey = `${event}|${JSON.stringify(params || {})}`;
    if (isDuplicate(eventKey)) {
      if (import.meta.env.DEV) console.log('[MetaPixel] ⏭ Deduped:', event);
      return;
    }
    recordEvent(eventKey);

    if (import.meta.env.DEV) {
      console.log(`[MetaPixel] 🔥 ${event}`, params || '');
    }

    if (eventId) {
      safeFbq('track', event, params || {}, { eventID: eventId });
    } else {
      safeFbq('track', event, params || {});
    }
  },

  /**
   * Track a custom event outside the standard set.
   * Deduplication still applies.
   */
  trackCustom(eventName: string, params?: Record<string, unknown>): void {
    if (!PIXEL_ID) return;

    const eventKey = `custom:${eventName}|${JSON.stringify(params || {})}`;
    if (isDuplicate(eventKey)) return;
    recordEvent(eventKey);

    if (import.meta.env.DEV) {
      console.log(`[MetaPixel] 🔥 Custom: ${eventName}`, params || '');
    }

    safeFbq('trackCustom', eventName, params || {});
  },

  /**
   * Fire PageView — call on every route change.
   * Uses 'track' NOT 'trackCustom' for proper attribution.
   */
  pageView(): void {
    if (!PIXEL_ID || !isFbqReady()) return;
    try {
      const f = window.fbq as (...a: unknown[]) => void;
      f('track', 'PageView');
      if (import.meta.env.DEV) console.log('[MetaPixel] 🔥 PageView');
    } catch {
      /* silent */
    }
  },

  /**
   * Track a conversion Purchase with revenue.
   * @param value - transaction amount in EUR
   * @param currency - ISO 4217 code (default 'EUR')
   * @param extra - additional params like content_name, content_ids
   */
  purchase(value: number, currency: string = 'EUR', extra?: Partial<MetaPixelParams>, eventId?: string): void {
    if (!PIXEL_ID) return;
    this.track('Purchase', {
      value,
      currency,
      content_type: 'product',
      content_ids: extra?.content_ids || ['digital-product'],
      num_items: extra?.num_items || 1,
      ...extra,
    }, eventId);
  },

  /**
   * Track when a user starts checkout flow.
   */
  initiateCheckout(contentName?: string, value?: number, eventId?: string): void {
    this.track('InitiateCheckout', {
      content_name: contentName,
      content_category: 'Академия TAVORA',
      value,
      currency: value ? 'EUR' : undefined,
      content_ids: contentName ? [contentName] : undefined,
      num_items: 1,
    }, eventId);
  },

  /**
   * Track a Lead (form submission / enrollment).
   */
  lead(contentName?: string): void {
    this.track('Lead', {
      content_name: contentName,
      content_category: 'Академия TAVORA',
    });
  },

  /**
   * Track when user views important content.
   */
  viewContent(name: string, category?: string): void {
    this.track('ViewContent', {
      content_name: name,
      content_category: category || 'Академия TAVORA',
    });
  },

  /**
   * Track CompleteRegistration.
   */
  completeRegistration(status?: string, eventId?: string): void {
    this.track('CompleteRegistration', {
      content_category: 'Академия TAVORA',
      status: status || 'registered',
    }, eventId);
  },
};

export const academyPixel = {
  get pixelId(): string {
    return ACADEMY_PIXEL_ID;
  },

  get isReady(): boolean {
    return !!ACADEMY_PIXEL_ID && isFbqReady();
  },

  /**
   * Fire PageView for the Academy pixel.
   * Call this on every academy route change for proper attribution.
   */
  pageView(): void {
    if (!ACADEMY_PIXEL_ID || !isFbqReady()) return;
    try {
      const f = window.fbq as (...a: unknown[]) => void;
      f('trackSingle', ACADEMY_PIXEL_ID, 'PageView');
      if (import.meta.env.DEV) console.log('[MetaPixel][Academy] 🔥 PageView');
    } catch {
      /* silent */
    }
  },

  /**
   * Track ViewContent only to the Academy pixel.
   * Used when someone lands on a course sales page from an ad.
   */
  viewContent(name: string): void {
    if (!ACADEMY_PIXEL_ID) return;
    const key = `academy:ViewContent|${name}`;
    if (isDuplicate(key)) return;
    recordEvent(key);
    if (import.meta.env.DEV) console.log('[MetaPixel][Academy] 🔥 ViewContent:', name);
    safeFbqSingle('ViewContent', { content_name: name, content_category: 'Академия TAVORA' });
  },

  /**
   * Track InitiateCheckout only to the Academy pixel.
   * Used when a user enters checkout or clicks a buy CTA in modules.
   */
  initiateCheckout(contentName?: string): void {
    if (!ACADEMY_PIXEL_ID) return;
    const key = `academy:InitiateCheckout|${contentName || ''}`;
    if (isDuplicate(key)) return;
    recordEvent(key);
    if (import.meta.env.DEV) console.log('[MetaPixel][Academy] 🔥 InitiateCheckout:', contentName);
    safeFbqSingle('InitiateCheckout', { content_name: contentName, content_category: 'Академия TAVORA' });
  },

  /**
   * Track Login event only to the Academy pixel.
   * Used when a user successfully logs in.
   */
  login(): void {
    if (!ACADEMY_PIXEL_ID) return;
    const key = 'academy:Login';
    if (isDuplicate(key)) return;
    recordEvent(key);
    if (import.meta.env.DEV) console.log('[MetaPixel][Academy] 🔥 Login');
    safeFbqSingleCustom('Login', { content_category: 'Академия TAVORA' });
  },

  /**
   * Track Register event only to the Academy pixel.
   * Used when a user successfully completes registration.
   */
  register(): void {
    if (!ACADEMY_PIXEL_ID) return;
    const key = 'academy:Register';
    if (isDuplicate(key)) return;
    recordEvent(key);
    if (import.meta.env.DEV) console.log('[MetaPixel][Academy] 🔥 Register');
    safeFbqSingleCustom('Register', { content_category: 'Академия TAVORA' });
  },

  /**
   * Track a Purchase conversion only to the Academy pixel.
   * Used when a student completes payment for a course.
   */
  purchase(value: number, currency: string = 'EUR', extra?: Partial<MetaPixelParams>): void {
    if (!ACADEMY_PIXEL_ID) return;
    const key = `academy:Purchase|${value}|${currency}|${extra?.content_name || ''}`;
    if (isDuplicate(key)) return;
    recordEvent(key);
    if (import.meta.env.DEV) console.log('[MetaPixel][Academy] 🔥 Purchase:', value, currency, extra);
    safeFbqSingle('Purchase', {
      value,
      currency,
      content_type: 'product',
      content_ids: extra?.content_ids || ['academy-course'],
      num_items: extra?.num_items || 1,
      ...extra,
    });
  },
};

/* ─── CAPI Helpers ─── */

/** Generate a unique event ID for CAPI deduplication.
 *  Use the same ID for both browser pixel and server-side CAPI call
 *  so Meta can deduplicate the two channels. */
export function generateEventId(): string {
  return crypto.randomUUID();
}

/** Extract browser context for CAPI user_data enrichment.
 *  Returns userAgent and Meta click/browser IDs from cookies
 *  to improve Event Match Quality (EMQ) score. */
export function getBrowserContext(): { userAgent: string; fbc: string; fbp: string } {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const getCookie = (name: string): string => {
    if (typeof document === 'undefined') return '';
    const escaped = name.replace(/([.$?*|()\[\]\\\/+^])/g, '\\$1');
    const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  };
  return {
    userAgent,
    fbc: getCookie('_fbc'),
    fbp: getCookie('_fbp'),
  };
}

/* ─── Export for direct usage ─── */
export default metaPixel;