// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { findGlossaryTerms, GLOSSARY_TERM_COUNT, visibleGlossaryText } from '../src/lib/academy-glossary';
import LessonGlossary from '../src/pages/module/components/lesson-v2/LessonGlossary';

afterEach(cleanup);

describe('learner glossary across three courses', () => {
  it('recognizes terms in the business, video and marketing curricula', () => {
    const text = 'CRM и SOP; снимаме с LUT и proxy; после GBP, NAP и AI Max.';
    const terms = findGlossaryTerms(text);
    for (const term of ['CRM', 'SOP', 'LUT', 'Прокси файл', 'Google Business Profile', 'NAP', 'AI Max']) {
      expect(terms.some((entry) => entry.term === term), term).toBe(true);
    }
    expect(GLOSSARY_TERM_COUNT).toBeGreaterThan(200);
    expect(terms.every((entry) => entry.plainBulgarian && entry.familiarAssociation)).toBe(true);
  });

  it('does not match a short acronym inside another word or inspect hidden keys and URLs', () => {
    expect(findGlossaryTerms('email и trailer').some((entry) => entry.term === 'ИИ / AI')).toBe(false);
    const text = visibleGlossaryText('Пример', {
      body: 'Проследи CRM и събитие.',
      url: 'https://example.com/ai-max',
      answerKey: 'LUT',
      sources: ['https://example.com/gbp'],
    });
    expect(findGlossaryTerms(text).some((entry) => entry.term === 'CRM')).toBe(true);
    expect(findGlossaryTerms(text).some((entry) => entry.term === 'LUT')).toBe(false);
    expect(findGlossaryTerms(text).some((entry) => entry.term === 'AI Max')).toBe(false);
  });

  it('lets the student choose a simple explanation and its familiar example', () => {
    render(<LessonGlossary text="CRM и CAC" />);
    expect(screen.getByText(/CRM:/)).toBeTruthy();
    const cac = screen.getByRole('button', { name: 'CAC' });
    fireEvent.click(cac);
    expect(cac.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText(/CAC:/)).toBeTruthy();
    expect(screen.getByText(/нов плащащ клиент/)).toBeTruthy();
  });
});
