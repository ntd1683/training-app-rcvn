import { test, expect } from '@playwright/test';

test('Search Mobile not found', async ({ page }) => {
  await page.setViewportSize({ width: 750, height: 768 });
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  await page.waitForSelector('.mobile-search-btn button.main-btn');
  const bannerBtns = page.locator('.mobile-search-btn button.main-btn');
  await bannerBtns.click();

  await page.fill('input[name="search_mobile"]', 'xyz123');
  await expect(page.locator('.search-dropdown .text-muted div.mb-2').first()).toContainText('Không tìm thấy sản phẩm nào');
});
