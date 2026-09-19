/* ─── Global type declarations for Meta Pixel ─── */

interface Window {
  fbq?: {
    (method: 'init', pixelId: string): void;
    (method: 'track', event: string, params?: Record<string, unknown>): void;
    (method: 'trackCustom', event: string, params?: Record<string, unknown>): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    loaded: boolean;
    version: string;
    push: (...args: unknown[]) => void;
  };
  _fbq?: Window['fbq'];
  __META_PIXEL_ID__?: string;
}