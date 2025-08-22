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
  let orders = page.locator('.order.container-fluid .order-list .card');
  if (await orders.count() < 8) {
    expect(page.getByText('Đã hiển thị tất cả đơn hàng')).toBeVisible();
    return;
  }

  await expect(orders).toHaveCount(8);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await expect(await orders.count()).toBeGreaterThan(8);
  await page.screenshot({ path: 'tests/orders/screenshots/load-more.png' });
});