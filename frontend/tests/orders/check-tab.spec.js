import { test, expect } from '@playwright/test';

test('order - check-tab', async ({ page }) => {
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
  const count = await listTab.count();
  console.log(`Total tabs: ${count}`);

  for (let index = 0; index < count; index++) {
    const element = listTab.nth(index);
    await element.click();
    await expect(element).toHaveClass(/active/);
    await page.waitForTimeout(500);

    const notFound = page.locator('.order.container-fluid .order-list .text-muted p')
      .filter({ hasText: 'Không tìm thấy đơn hàng nào' });

    if (await notFound.isVisible()) {
      console.log(`Tab ${index}: ${await element.textContent()} → Không có đơn hàng`);
      if (index == 2) {
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'tests/orders/screenshots/check-tab.png' });
      }
      continue;
    }

    console.log(`Tab ${index}: ${await element.textContent()}`);
    if (index == 0) {
      await expect(page.locator('.order.container-fluid .order-list .text-end .badge').first()).toBeVisible();
    } else if (index == 1) {
      const badge = await page.locator('.order.container-fluid .order-list .text-end .badge').first();
      await expect(badge).toBeVisible();
      const badgeText = await badge.textContent();
      expect(["Đang xử lý", "Đang chờ"]).toContain(badgeText?.trim());
    } else if (index == 2) {
      await expect(page.locator('.order.container-fluid .order-list .text-end .badge').first()).toContainText("Đã hoàn thành");
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'tests/orders/screenshots/check-tab.png' });
    } else if (index == 3) {
      const badge = page.locator('.order.container-fluid .order-list .text-end .badge').first();
      await expect(badge).toBeVisible();
      const badgeText = await badge.textContent();
      expect(["Thanh toán thất bại", "Đã huỷ"]).toContain(badgeText?.trim());
    }
  }
});