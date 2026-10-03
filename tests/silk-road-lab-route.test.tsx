// @vitest-environment jsdom
import React from 'react';
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AcademyLabPage from '../src/pages/academy-lab/page';
import { buildLabDocument } from '../src/pages/academy-lab/document';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('educational lab on SPA hosting', () => {
  it('bundles the real exercise and keeps it isolated from account storage', () => {
    const revoke = vi.fn();
    URL.createObjectURL = vi.fn(() => 'blob:test-download');
    URL.revokeObjectURL = revoke;
    const view = render(<MemoryRouter><AcademyLabPage /></MemoryRouter>);
    const frame = screen.getByTitle('Учебна форма: какво се случва след Изпрати');
    expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
    expect(frame.getAttribute('srcdoc')).toContain('id="request-form"');
    expect(frame.getAttribute('srcdoc')).toContain('id="run-checks"');
    expect(frame.getAttribute('srcdoc')).not.toContain('<script src="request-lab.js">');
    expect(screen.getByRole('link', { name: 'Изтегли страницата' }).getAttribute('download')).toBe('index.html');
    view.unmount();
    expect(revoke).toHaveBeenCalledTimes(2);
  });

  it('serves that exercise through the existing application router without depending on static-directory handling', () => {
    const router = readFileSync('src/router/config.tsx', 'utf8');
    expect(router).toContain('path: "/academy-labs/silk-road"');
    const document = buildLabDocument();
    expect(document).toContain('Учебна демонстрация');
    expect(document).toContain('function');
    expect(document).not.toContain('href="request-lab.js"');
    expect(document).toContain("type:'tavora-lab-height'");
  });
});
