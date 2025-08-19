import {test, expect} from '@playwright/test';

test('Fullname Invalid', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-ky');
  await page.fill('input[name="fullName"]', 'a');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Tên đầy đủ phải có ít nhất 3 ký tự')).toBeVisible();
});