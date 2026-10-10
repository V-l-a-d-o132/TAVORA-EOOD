// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { advanceWorkflow as act, startWorkflow } from '../src/lib/silk-road-workflows';
import LessonRichText from '../src/pages/module/components/lesson-v2/LessonRichText';

afterEach(cleanup);

test('code remains escaped, keeps a fallback, and tables keep their introductory condition', () => {
  const source = '<script>window.unsafe=true</script>';
  const content = { body: `Пояснение.\n\n${source}`, codeFallback: true, code: { language: 'HTML', source } };
  const { container, rerender } = render(<LessonRichText content={content} allowCode />);
  expect(container.querySelector('script')).toBeNull();
  expect(container.querySelector('code')?.textContent).toBe(source);
  expect(container.textContent?.split(source)).toHaveLength(2);
  rerender(<LessonRichText content={content} />);
  expect(container.querySelector('pre')).toBeNull();
  expect(container.textContent).toContain(source);
  rerender(<LessonRichText content={{ body: 'Повторено таблично представяне', tableFallback: true,
    tableIntro: 'Само учебни числа.', columns: ['Случай', 'Резултат'], table: [{ cells: ['Първи', 'Един запис'] }] }} />);
  expect(container.textContent).toContain('Само учебни числа.');
  expect(container.textContent).not.toContain('Повторено таблично представяне');
  expect(screen.getByRole('table')).toBeTruthy();
});

test('payment simulation distinguishes redirect, unpaid and a verified single fulfillment', () => {
  for (const scenario of ['redirect', 'unpaid']) {
    expect(act(act(startWorkflow('checkout', scenario), 'verify'), 'execute').effects).toBe(0);
  }
  const start = startWorkflow('checkout', 'paid');
  expect(act(start, 'execute').effects).toBe(0);
  const paid = act(act(start, 'verify'), 'execute');
  expect(paid.effects).toBe(1);
  expect(act(paid, 'repeat').effects).toBe(1);
  expect(start.effects).toBe(0);
});

test('publication respects version approval, withdrawn offer and unknown first result', () => {
  let changed = act(startWorkflow('publishing', 'changed'), 'verify');
  expect(act(changed, 'execute').effects).toBe(0);
  changed = act(changed, 'approve');
  expect(act(changed, 'execute').effects).toBe(1);
  expect(act(act(startWorkflow('publishing', 'withdrawn'), 'verify'), 'execute').effects).toBe(0);
  const unknown = startWorkflow('publishing', 'unknown');
  expect(act(unknown, 'repeat').effects).toBe(0);
  expect(act(act(unknown, 'verify'), 'repeat').effects).toBe(1);
});

test('request simulation separates record, notification, ownership and another project', () => {
  expect(act(startWorkflow('request', 'missing'), 'execute').records).toBe(0);
  const saved = act(startWorkflow('request', 'notification'), 'execute');
  expect(saved).toMatchObject({ records: 1, notification: false, owner: false });
  expect(act(saved, 'repeat').records).toBe(1);
  const notified = act(saved, 'notify');
  expect(notified).toMatchObject({ records: 1, notification: true, owner: false });
  expect(act(notified, 'assign').owner).toBe(true);
  expect(act(saved, 'new').records).toBe(2);
});

test('provided visual and simulation render with no open answer or file field', () => {
  const { container } = render(<LessonRichText content={{ body: 'Учебен случай.', simulation: 'checkout',
    figure: { src: '/academy-labs/silk-road/closed/contrast.svg', alt: 'Две двойки цветове.', caption: 'Измерен контраст.' } }} />);
  expect(screen.getByAltText('Две двойки цветове.')).toBeTruthy();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'paid' } });
  fireEvent.click(screen.getByRole('button', { name: 'Провери сървърния статус' }));
  fireEvent.click(screen.getByRole('button', { name: 'Опитай да включиш достъпа' }));
  expect(screen.getByRole('log').textContent).toContain('един учебен достъп');
  expect(container.querySelector('textarea,input[type="text"],input[type="file"]')).toBeNull();
});
