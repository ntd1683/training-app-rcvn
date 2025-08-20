import {test, expect} from '@playwright/test';

test('Check product', async ({ page }) => {
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  const product = page.locator('.single-product').first();
  await product.hover();
  await product.locator('.product-image .button button.btn').click();
  const btnText = await product.locator('.product-image .button .btn').innerText();
  await expect(btnText).toContain('Đã Thêm Vào Giỏ Hàng');
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/1/);
});