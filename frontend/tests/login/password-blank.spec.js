import {test, expect} from '@playwright/test';

test('Password Blank', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-nhap');
  await page.fill('input[name="password"]', '');
  const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Mật khẩu không được bỏ trống')).toBeVisible();
});