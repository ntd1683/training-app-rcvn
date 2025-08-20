import { test, expect } from '@playwright/test';

test('Search Desktop', async ({ page }) => {
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  await page.fill('input[name="search_desktop"]', 'Bút bi');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.goto('http://localhost:3000/');
  await page.fill('input[name="search_desktop"]', '');
  await expect(page.locator('.search-dropdown .d-flex.align-items-center span').first()).toContainText('Bút bi');
});
