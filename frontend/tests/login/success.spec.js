import {test, expect} from '@playwright/test';

test('Login Customer', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-nhap');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await expect(page.getByText('Đăng nhập thành công')).toBeVisible();
});