import {test, expect} from '@playwright/test';

test('Fullname Blank', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-ky');
  await page.fill('input[name="fullName"]', '');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Tên đầy đủ không được bỏ trống')).toBeVisible();
});