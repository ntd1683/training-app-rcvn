import {test, expect} from '@playwright/test';

test('Repassword Blank', async ({ page }) => {
  const urlRegister = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-ky';
  await page.goto(urlRegister);
  await page.fill('input[name="password"]', '');
  await page.fill('input[name="rePassword"]', '');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Vui lòng xác nhận mật khẩu')).toBeVisible();
});