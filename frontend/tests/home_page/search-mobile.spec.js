import { test, expect } from '@playwright/test';

test('Search Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 750, height: 768 }); // mobile
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  await page.waitForSelector('.mobile-search-btn button.main-btn');
  const bannerBtns = page.locator('.mobile-search-btn button.main-btn');
  await bannerBtns.click();

  await page.fill('input[name="search_mobile"]', 'Bút bi');
  await expect(page.locator('.search-dropdown .flex-grow-1 h6').first()).toContainText('Bút bi');
});
