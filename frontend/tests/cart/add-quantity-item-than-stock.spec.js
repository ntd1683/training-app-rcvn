import { test, expect } from '@playwright/test';

test('cart - add quantity', async ({ page }) => {
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  const product = page.locator('.single-product').first();
  const productInfo = await product.locator('.product-info');
  const price = await productInfo.locator('.price').innerText();
  await product.hover();
  await product.locator('.product-image .button button.btn').click();
  const btnText = await product.locator('.product-image .button .btn').innerText();
  await expect(btnText).toContain('Đã Thêm Vào Giỏ Hàng');
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/1/);

  const cartUrl = (process.env.TEST_URL || 'http://localhost:3000') + '/gio-hang';
  await page.goto(cartUrl);
  await expect(page.locator('.cart-single-list').first()).toBeVisible();
  await page.locator('.cart-single-list input[name="quantity-0"]').fill('500');
  await expect(page.locator('.cart-single-list input[name="quantity-0"]')).toContainClass('text-danger border-danger');
  await page.screenshot({ path: 'tests/cart/screenshots/add-quantity-item-than-stock.png' });
});