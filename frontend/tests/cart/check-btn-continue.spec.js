import {test, expect} from '@playwright/test';

test('cart - continue', async ({ page }) => {
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);
  const beforeUrl = await page.url();

  const product = page.locator('.single-product').first();
  await product.hover();
  await product.locator('.product-image .button button.btn').click();
  const btnText = await product.locator('.product-image .button .btn').innerText();
  await expect(btnText).toContain('Đã Thêm Vào Giỏ Hàng');
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/1/);

  const cartUrl = (process.env.TEST_URL || 'http://localhost:3000') + '/gio-hang';
  await page.goto(cartUrl);
  await expect(page.locator('.cart-single-list').first()).toBeVisible();
  await page.locator('.cart-single-list input[name="quantity-0"]').fill('3');
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/3/);

  await page.locator('.total-amount a.btn[href="/shop"]').click();
  const urlShop = (process.env.TEST_URL || 'http://localhost:3000') + '/shop';
  await expect(page.url()).toEqual(urlShop);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/cart/screenshots/continue-shopping.png' });
});