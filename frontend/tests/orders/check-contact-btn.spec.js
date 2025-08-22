import { test, expect } from '@playwright/test';

test('order - check contact btn', async ({ page }) => {
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
  const contactButton = page.locator('.order.container-fluid .card .card-body a.btn.btn-outline-secondary', { hasText: 'Liên Hệ Người Bán' }).first();
  await expect(contactButton).toBeVisible();
  const phoneHref = await contactButton.getAttribute('href');

  const [request] = await Promise.all([
    page.waitForEvent('request'),
    contactButton.click()
  ]);
  expect(request.url()).toContain(phoneHref);

  await page.screenshot({ path: 'tests/orders/screenshots/check-contact.png' });

});