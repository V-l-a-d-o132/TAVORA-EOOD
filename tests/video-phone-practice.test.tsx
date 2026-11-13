// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import VideoPhonePractice from '@/pages/module/components/lesson-v2/VideoPhonePractice';

it('shows the phone assignment, checks and montage entry without grading a self-assessment', () => {
  const instructions = 'Камера · 12 минути\nЗаснеми четири кадъра.\n\nСамопроверка\n• Кадрите са на фокус.\n• Механизмът се вижда.\n\nСледва светлината.';
  render(<MemoryRouter><VideoPhonePractice instructions={instructions} /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /Камера/ })).toBeTruthy();
  const checks = screen.getAllByRole('checkbox') as HTMLInputElement[];
  fireEvent.click(screen.getByLabelText('Кадрите са на фокус.'));
  expect(checks.map(box => box.checked)).toEqual([true, false]);
  expect(screen.getByRole('link').getAttribute('href')).toBe('/academy-labs/perfect-video/montage');
  expect(screen.getByText('Следва светлината.')).toBeTruthy();
});
