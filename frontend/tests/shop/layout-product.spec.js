import { test, expect } from '@playwright/test';

test('Shop - layout product', async ({ page }) => {
  const urlShop = (process.env.TEST_URL || 'http://localhost:3000') + '/shop';
  await page.goto(urlShop);

  await page.waitForSelector('.product-grids .row .tab-content .row');
  await expect(page.locator('.product-grids .row .tab-content .row').first()).toBeVisible();
  await page.screenshot({ path: 'tests/shop/screenshots/shop-layout-product.png' });
});
