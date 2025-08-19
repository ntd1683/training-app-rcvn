import {test, expect} from '@playwright/test';

test('Register Customer', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-ky');
  await page.fill('input[name="fullName"]', 'Testing');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.fill('input[name="rePassword"]', 'password');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Đăng ký thành công')).toBeVisible();
});