// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env.testing') });

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
    laravelBaseUrl: process.env.API_URL + '/playwright' || 'http://localhost:80/playwright',
    baseURL: process.env.TEST_URL || 'http://localhost:3000',
    headless: true,
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
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

