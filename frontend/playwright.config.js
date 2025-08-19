// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 1,
  timeout: 60 * 1000,
  reporter: [['html', { open: 'never' }]],
  use: {
    laravelBaseUrl: 'http://localhost:80/playwright',
    baseURL: 'http://localhost:3000',
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    // {
    //   name: 'chromium',
    //   use: { 
    //     browserName: 'chromium',
    //     env: {
    //       APP_ENV: 'testing',
    //       DB_CONNECTION: 'sqlite',
    //       DB_DATABASE: ':memory:',
    //     }
    //   },
    // },
    {
      name: 'Microsoft Edge',
      use: { 
        ...devices['Desktop Edge'],
      },
    },
  ],
});

