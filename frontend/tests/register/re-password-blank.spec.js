import {test, expect} from '@playwright/test';

test('Repassword Blank', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-ky');
  await page.fill('input[name="password"]', '');
  await page.fill('input[name="rePassword"]', '');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Vui lòng xác nhận mật khẩu')).toBeVisible();
});