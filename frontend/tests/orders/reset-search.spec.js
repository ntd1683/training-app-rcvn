import { test, expect } from '@playwright/test';

test('order - search-all', async ({ page }) => {
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
  await page.locator('.order.container-fluid input[name="order_search"]').fill('a');
  await page.locator('.order.container-fluid input[name="order_date"]').fill('2025-08-21');
  await page.locator('.order.container-fluid .btn-search-orders').click();

  await page.waitForURL(url => url !== urlLogin);
  const afterUrl = page.url();
  expect(afterUrl).toEqual(urlOrders + "?name=a&date=2025-08-21");

  await page.locator('.order.container-fluid .btn-reset-orders').click();
  await page.waitForURL(url => url !== urlLogin);
  const afterUrlV1 = page.url();
  expect(afterUrlV1).toEqual(urlOrders);

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/orders/screenshots/reset-search.png' });
});