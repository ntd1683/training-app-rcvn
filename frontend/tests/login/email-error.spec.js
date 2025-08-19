import {test, expect} from '@playwright/test';

test('Email Error', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-nhap');
  await page.fill('input[name="email"]', 'test');
  const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Email không hợp lệ')).toBeVisible();
});