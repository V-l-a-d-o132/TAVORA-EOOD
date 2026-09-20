// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'student@example.com', user_metadata: { full_name: 'Ученик' } },
    signOut: vi.fn(),
  }),
}));

import DashboardNav from '../src/pages/dashboard/components/DashboardNav';

afterEach(cleanup);

describe('academy navigation', () => {
  it('leaves the module screen and renders the dashboard route', async () => {
    window.scrollTo = vi.fn();

    render(
      <MemoryRouter initialEntries={['/module/s01-m03']}>
        <Routes>
          <Route path="/module/:moduleId" element={<><DashboardNav /><main>Екран на урока</main></>} />
          <Route path="/dashboard" element={<main>Dashboard съдържание</main>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: /Прогрес/i }));

    expect(await screen.findByText('Dashboard съдържание')).toBeTruthy();
    expect(screen.queryByText('Екран на урока')).toBeNull();
  });
});
