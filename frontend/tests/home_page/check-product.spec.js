import {test, expect} from '@playwright/test';

test('Check product', async ({ page }) => {
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  const product = page.locator('.single-product').first();
  const productInfo = await product.locator('.product-info');
  await expect(productInfo.locator('.title')).toBeVisible();
  await expect(productInfo.locator('.price')).toBeVisible();
  await expect(productInfo.locator('.product-item-quantity')).toBeVisible();
});