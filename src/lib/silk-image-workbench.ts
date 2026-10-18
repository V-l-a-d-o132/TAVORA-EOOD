export const SILK_IMAGE_WIDTHS = [240, 480, 720] as const;
export const SILK_IMAGE_QUALITIES = [0.45, 0.72, 0.9] as const;
export type ImageWidth = typeof SILK_IMAGE_WIDTHS[number];
export type ImageQuality = typeof SILK_IMAGE_QUALITIES[number];

export function hasWebPHeader(bytes: Uint8Array): boolean {
  return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';
}
export function providedImageSize(width: number, height: number, target: ImageWidth) {
  if (![width, height].every(value => Number.isFinite(value) && value > 0) || !SILK_IMAGE_WIDTHS.includes(target)) throw Error('Невалидни размери на предоставеното изображение.');
  const outputWidth = Math.min(Math.floor(width), target);
  return { width: outputWidth, height: Math.max(1, Math.round(height * outputWidth / width)) };
}
