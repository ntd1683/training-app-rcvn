import {test, expect} from '@playwright/test';

test('Email Blank', async ({ page }) => {
  const urlRegister = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-ky';
  await page.goto(urlRegister);
  await page.fill('input[name="email"]', '');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Email không được bỏ trống')).toBeVisible();
});