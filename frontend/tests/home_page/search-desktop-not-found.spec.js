import { test, expect } from '@playwright/test';

test('search-desktop-not-found', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 }); // desktop
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  await page.fill('input[name="search_desktop"]', 'xyz123');
  await expect(page.locator('.search-dropdown .text-muted div.mb-2').first()).toContainText('Không tìm thấy sản phẩm nào');
});
