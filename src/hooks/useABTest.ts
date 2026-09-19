import { useState, useEffect, useCallback } from 'react';

interface ABVariant {
  id: string;
  headline: string;
  subheadline?: string;
  cta?: string;
}

const AGENCY_VARIANTS: ABVariant[] = [
  {
    id: 'a1',
    headline: 'Онлайн присъствие, реклами и видео за вашия бизнес.',
    subheadline: 'Владимир Атанасов и Натан Петков. SEO, реклами и видео продукция с професионална техника.',
    cta: 'Поискайте оферта →',
  },
  {
    id: 'a2',
    headline: 'Класирайте бизнеса си на #1 в Google — ние знаем как.',
    subheadline: 'Реални #1 позиции за клиенти в Търново. SEO, реклами, видео — всичко под един покрив.',
    cta: 'Вижте резултатите →',
  },
  {
    id: 'a3',
    headline: 'Дигитален маркетинг, който носи клиенти — не само кликове.',
    subheadline: 'Meta, Google, TikTok реклами + SEO + видео продукция. Работим само с бизнеси от България.',
    cta: 'Запази консултация →',
  },
];

const HOME_VARIANTS: ABVariant[] = [
  {
    id: 'h1',
    headline: 'Онлайн присъствие, реклами и видео за вашия бизнес.',
    subheadline: 'Владимир Атанасов и Натан Петков. Правим SEO, рекламни кампании и видео продукция.',
    cta: 'Поискайте оферта →',
  },
  {
    id: 'h2',
    headline: 'Научете SEO и реклами — или ние го правим за вас.',
    subheadline: 'Курс по AI уеб дизайн + агенция за дигитален маркетинг в Търново.',
    cta: 'Виж курса →',
  },
];

const KURS_VARIANTS: ABVariant[] = [
  {
    id: 'k1',
    headline: 'Как класирах 2 бизнеса #1 в Google — и как да го направите вие.',
    subheadline: 'SEO, реклами, видео — всичко, което правим за клиенти, преподаваме в академията.',
    cta: 'Виж дали е за теб →',
  },
  {
    id: 'k2',
    headline: 'Академия TAVORA — изгради дигитална услуга с AI.',
    subheadline: '11 модула. От оферта и сайт до съдържание и привличане на клиенти.',
    cta: 'Виж програмата →',
  },
];

function getVariant<T extends ABVariant>(variants: T[], pageId: string): T {
  if (typeof window === 'undefined') return variants[0];

  const stored = localStorage.getItem(`ab_test_${pageId}`);
  if (stored) {
    const found = variants.find((v) => v.id === stored);
    if (found) return found;
  }

  const hashInput = navigator.userAgent + (window.sessionStorage.getItem('ab_seed') || '');
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    hash = ((hash << 5) - hash + hashInput.charCodeAt(i)) | 0;
  }
  const absHash = Math.abs(hash);
  const idx = absHash % variants.length;
  const variant = variants[idx];

  localStorage.setItem(`ab_test_${pageId}`, variant.id);
  return variant;
}

export function useABTest(page: 'agency' | 'home' | 'kurs') {
  const [variant, setVariant] = useState<ABVariant | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const variants = page === 'agency' ? AGENCY_VARIANTS : page === 'home' ? HOME_VARIANTS : KURS_VARIANTS;
    const v = getVariant(variants, page);
    setVariant(v);
    setReady(true);
  }, [page]);

  const trackClick = useCallback((element: string) => {
    if (!variant || typeof window === 'undefined') return;
    const interactions = JSON.parse(localStorage.getItem(`ab_interactions_${page}`) || '[]');
    interactions.push({
      variant: variant.id,
      element,
      time: Date.now(),
      path: window.location.pathname,
    });
    localStorage.setItem(`ab_interactions_${page}`, JSON.stringify(interactions.slice(-50)));
  }, [variant, page]);

  return { variant, ready, trackClick };
}

export function getABStats(page: 'agency' | 'home' | 'kurs') {
  if (typeof window === 'undefined') return null;
  const interactions = JSON.parse(localStorage.getItem(`ab_interactions_${page}`) || '[]');
  const variantId = localStorage.getItem(`ab_test_${page}`);
  return { variantId, interactions };
}