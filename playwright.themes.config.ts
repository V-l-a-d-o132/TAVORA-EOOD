import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', testMatch: '**/academy-{themes,lab-themes,catalog-theme}.pw.ts', outputDir: 'test-results/themes',
  timeout: 45000, workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5191', browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : undefined,
    viewport: { width: 1280, height: 1000 }, screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'VITE_PUBLIC_SUPABASE_URL=https://dashboard-fixture.supabase.co VITE_PUBLIC_SUPABASE_ANON_KEY=dashboard-test-public-key npm run build && npm run preview -- --host 127.0.0.1 --port 5191',
    url: 'http://127.0.0.1:5191', reuseExistingServer: false, timeout: 120000,
  },
});
