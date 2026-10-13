import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/dashboard-progress.pw.ts',
  outputDir: 'test-results/dashboard',
  timeout: 30000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5190',
    browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : undefined,
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
  },
  webServer: {
    // This build uses synthetic auth and intercepted APIs; no live account.
    command: 'VITE_PUBLIC_SUPABASE_URL=https://dashboard-fixture.supabase.co VITE_PUBLIC_SUPABASE_ANON_KEY=dashboard-test-public-key npm run build && npm run preview -- --host 127.0.0.1 --port 5190',
    url: 'http://127.0.0.1:5190',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
