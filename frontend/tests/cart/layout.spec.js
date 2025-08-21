import {test, expect} from '@playwright/test';

test('cart - check layout', async ({ page }) => {
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  const product = page.locator('.single-product').first();
  await product.hover();
  await product.locator('.product-image .button button.btn').click();
  const btnText = await product.locator('.product-image .button .btn').innerText();
  await expect(btnText).toContain('Đã Thêm Vào Giỏ Hàng');
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/1/);

  const cartUrl = (process.env.TEST_URL || 'http://localhost:3000') + '/gio-hang';
  await page.goto(cartUrl);
  await expect(page.locator('.cart-single-list').first()).toBeVisible();
  await page.screenshot({ path: 'tests/cart/screenshots/cart-layout.png' });
});