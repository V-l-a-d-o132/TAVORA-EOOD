import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', testMatch: ['**/academy-{themes,lab-themes,lab-upgrade,catalog-theme,public-info,practice-studios,production-studios,final-studios,marketing-studios,marketing-next-studios,marketing-third-studios,marketing-final-studios,silk-studios,silk-applied,silk-toolkit}.pw.ts', '**/marketing-practice.pw.ts'], outputDir: 'test-results/themes',
  timeout: 45000, workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:5191', browserName: 'chromium',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : undefined } : undefined,
    viewport: { width: 1280, height: 1000 }, screenshot: 'only-on-failure',
  },
  webServer: {
    command: process.env.PLAYWRIGHT_USE_BUILT_PREVIEW === '1' ? 'npm run preview -- --host 127.0.0.1 --port 5191' : 'VITE_PUBLIC_SUPABASE_URL=https://dashboard-fixture.supabase.co VITE_PUBLIC_SUPABASE_ANON_KEY=dashboard-test-public-key npm run build && npm run preview -- --host 127.0.0.1 --port 5191',
    url: 'http://127.0.0.1:5191', reuseExistingServer: process.env.PLAYWRIGHT_REUSE_PREVIEW === '1', timeout: 180000,
  },
});
