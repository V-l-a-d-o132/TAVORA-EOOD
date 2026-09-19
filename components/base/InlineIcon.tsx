import React from 'react';

const outline = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const icons: Record<string, React.ReactNode> = {
  'arrow-down': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><polyline points="6 9 12 15 18 9" /></svg>
  ),
  'menu': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  ),
  'close': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ),
  'code': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  ),
  'search': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  'advertisement': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></svg>
  ),
  'video': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
  ),
  'global': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
  ),
  'graduation-cap': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
  ),
  'user-search': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><circle cx="18" cy="18" r="3" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
  ),
  'links': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
  ),
  'camera': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
  ),
  'shield-check': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 12 15 16 11" /></svg>
  ),
  'check': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><polyline points="20 6 9 17 4 12" /></svg>
  ),
  'information': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
  ),
  'add': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  ),
  'subtract': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="5" y1="12" x2="19" y2="12" /></svg>
  ),
  'external-link': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
  ),
  'facebook': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  ),
  'instagram': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
  ),
  'tiktok': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.66-1.66 2.79 2.79 0 0 1-.22-1.11 2.89 2.89 0 0 1 2.88-2.89c.28 0 .56.04.82.11V9.4a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 5 15.7 6.4 6.4 0 0 0 11.39 22a6.37 6.37 0 0 0 6.38-6.34V8.82a8.24 8.24 0 0 0 4.83 1.55V6.88a4.82 4.82 0 0 1-3.01-.19z" /></svg>
  ),
  'youtube': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
  ),
  'google': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.552 3.822-5.445 3.822-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.548 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12.545 2C6.477 2 1.545 6.932 1.545 13s4.932 11 11 11 11-4.932 11-11c0-.732-.074-1.446-.214-2.136h-10.24z" /></svg>
  ),
  'phone': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  ),
  'mail': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
  ),
  'time': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  'price-tag': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  ),
  'price-tag-3': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
  ),
  'lock': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
  ),
  'infinity': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4z" /></svg>
  ),
  'checkbox-circle': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  'alert': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  'star': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
  'robot': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>
  ),
  'arrow-up': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
  ),
  'arrow-right': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  ),
  'sparkling': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
  ),
  'line-chart': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  ),
  'tv': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></svg>
  ),
  'team': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  'dollar': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="12" cy="12" r="10" /><line x1="12" y1="6" x2="12" y2="18" /><path d="M8 10h8" /><path d="M8 14h8" /></svg>
  ),
  'dollar-circle': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="12" cy="12" r="10" /><line x1="12" y1="6" x2="12" y2="18" /><path d="M8 10h8" /><path d="M8 14h8" /></svg>
  ),
  'sleep': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M6 12h6" /><path d="M18 6h-6" /><path d="M18 18h-6" /></svg>
  ),
  'magic': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
  ),
  'file-text': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
  ),
  'heart': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  ),
  'rocket': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3" /></svg>
  ),
  'article': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
  ),
  'user': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ),
  'book-open': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
  ),
  'logout': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  'mail-check': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" /><polyline points="22 7 12 13 2 7" /><polyline points="16 19 18 21 22 17" /></svg>
  ),
  'search-eye': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><path d="M11 8v6" /><path d="M8 11h6" /></svg>
  ),
  'openai': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" /></svg>
  ),
  'camera-3': (
    <svg viewBox="0 0 24 24" width="100%" height="100%" {...outline}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
  ),
};

export default function InlineIcon({ name, className = '' }: { name: string; className?: string }) {
  const icon = icons[name];
  if (!icon) return null;
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      {icon}
    </span>
  );
}