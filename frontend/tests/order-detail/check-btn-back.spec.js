import { test, expect } from '@playwright/test';

test('order-detail - check btn comeback', async ({ page }) => {
  const urlLogin = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-nhap';
  await page.goto(urlLogin);
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', '123456');
  const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Đăng nhập thành công')).toBeVisible();

  const urlOrders = (process.env.TEST_URL || 'http://localhost:3000') + '/don-hang';
  await page.goto(urlOrders);
  await expect(page.locator('.order.container-fluid').first()).toBeVisible();

  await page.locator('.order.container-fluid .card .card-body a.btn').filter({ hasText: 'Chi tiết' }).first().click();
  await page.waitForURL(url => url.pathname.startsWith('/don-hang-chi-tiet/'), { timeout: 3000 });

  await expect(page.locator('.order-detail.container-fluid').first()).toBeVisible();
  await page.locator('.order-detail.container-fluid .btn-comeback').click();
  expect(page.url()).toEqual(urlOrders);

  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/order-detail/screenshots/check-btn-back.png' });
});