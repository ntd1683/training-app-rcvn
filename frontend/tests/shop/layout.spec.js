import { test, expect } from '@playwright/test';

test('Shop - layout', async ({ page }) => {
  const urlShop = (process.env.TEST_URL || 'http://localhost:3000') + '/shop';
  await page.goto(urlShop);

  await expect(page.locator('.product-grids')).toBeVisible();
  await page.screenshot({ path: 'tests/shop/screenshots/shop-layout.png' });
});
