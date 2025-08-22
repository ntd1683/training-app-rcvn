import { test, expect } from '@playwright/test';

test('order-detail - check repay paypal', async ({ page }) => {
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

  const orderTabs = page.locator('.order.container-fluid .nav.nav-pills[role="tablist"]');
  await expect(orderTabs).toBeVisible();
  const listTab = orderTabs.locator('li.nav-item');
  const element = listTab.nth(1);
  await element.click();
  await page.waitForTimeout(500);
  const badge = await page.locator('.order.container-fluid .order-list .text-end .badge').first();
  await expect(badge).toBeVisible();
  const badgeText = await badge.textContent();
  expect(["Đang xử lý", "Đang chờ"]).toContain(badgeText?.trim());
  const orderCode = await page.locator('.order.container-fluid .order-list .badge .order-code').first().textContent();

  await page.locator('.order.container-fluid .card .card-body a.btn').filter({ hasText: 'Chi tiết' }).first().click();

  await page.waitForURL(url => url.pathname.startsWith('/don-hang-chi-tiet/'), { timeout: 3000 });
  await expect(page.locator('.order-detail.container-fluid').first()).toBeVisible();
  await page.locator('.order-detail.container-fluid .btn-danger').filter({ hasText: 'Thanh Toán Lại' }).click();
  await expect(page.locator('#modal #modalLabel')).toContainText('Thanh toán đơn hàng cũ');
  await expect(page.locator('#modal .modal-body p strong')).toContainText(orderCode?.trim());
  await page.waitForTimeout(1500);
  const paypalFrame = await page.frameLocator('#modal iframe[title="PayPal"]').first();
  await expect(paypalFrame.locator('#buttons-container')).toBeVisible();
  await expect(paypalFrame.locator('#buttons-container')).toBeVisible();
  await expect(paypalFrame.locator('#buttons-container .paypal-button-number-0').first()).toBeVisible();
  await expect(paypalFrame.locator('#buttons-container .paypal-button-number-1').first()).toBeVisible();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    paypalFrame.locator('#buttons-container .paypal-button-number-0').nth(1).click(),
  ]);
  await expect(popup).toHaveURL(/paypal\.com/, { timeout: 15000 });
  await popup.locator('input#email').fill('sb-2duoq44979603@personal.example.com');
  await popup.locator('button#btnNext').click();

  await popup.locator('input#password').fill('I::8!]iS');
  await popup.locator('button#btnLogin').click();
  await popup.waitForTimeout(1500);
  const completeBtn = popup.locator('button[data-testid="submit-button-initial"]');
  await expect(completeBtn).toBeVisible({ timeout: 20000 });
  await completeBtn.click();

  await popup.waitForEvent('close', { timeout: 20000 });
  await expect(page.getByRole('alert')).toContainText('Thanh toán thành công!');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/order-detail/screenshots/check-paypal-success.png' });
});