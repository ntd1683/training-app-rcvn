import { test, expect } from '@playwright/test';

test('checkout - check btn debit', async ({ page }) => {
  const urlLogin = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-nhap';
  await page.goto(urlLogin);
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', '123456');
  const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Đăng nhập thành công')).toBeVisible();

  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  const product = page.locator('.single-product').first();
  await product.hover();
  await product.locator('.product-image .button button.btn').click();
  const btnText = await product.locator('.product-image .button .btn').innerText();
  await expect(btnText).toContain('Đã Thêm Vào Giỏ Hàng');
  await page.waitForTimeout(300);
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/1/);

  const cartUrl = (process.env.TEST_URL || 'http://localhost:3000') + '/gio-hang';
  await page.goto(cartUrl);
  await expect(page.locator('.cart-single-list').first()).toBeVisible();
  await page.locator('.cart-single-list input[name="quantity-0"]').fill('1');
  await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/1/);

  await page.locator('.total-amount a.btn[href="/thanh-toan"]').click();
  const urlCheckout = (process.env.TEST_URL || 'http://localhost:3000') + '/thanh-toan';
  await expect(page.url()).toEqual(urlCheckout);
  await expect(page.locator('.checkout-wrapper.section')).toBeVisible();

  await page.locator('.checkout-wrapper.section input[name="phone"]').fill('0123456789');
  await page.locator('.checkout-wrapper.section input[name="address"]').fill('123 Đường ABC');
  await page.locator('.checkout-wrapper.section input[name="postCode"]').fill('700000');
  await page.locator('select[name="province"]').selectOption('Hồ Chí Minh');
  await page.waitForTimeout(500);
  await page.locator('select[name="ward"]').selectOption('Bình Thạnh');
  await page.locator('.checkout-wrapper.section .price-table-btn button').click();
  await page.waitForTimeout(3000);
  const paypalFrame = page.frameLocator('iframe[title="PayPal"]');
  await expect(paypalFrame.locator('#buttons-container')).toBeVisible();
  await expect(paypalFrame.locator('#buttons-container')).toBeVisible();
  await expect(paypalFrame.locator('#buttons-container .paypal-button-number-0').first()).toBeVisible();
  await expect(paypalFrame.locator('#buttons-container .paypal-button-number-1').first()).toBeVisible();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    paypalFrame.locator('#buttons-container .paypal-button-number-1').nth(1).click(),
  ]);
  await expect(popup).toHaveURL(/paypal\.com/, { timeout: 15000 });
  await popup.screenshot({ path: 'tests/checkout/screenshots/check-btn-debit.png' });
});