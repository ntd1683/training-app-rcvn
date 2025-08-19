import {test, expect} from '@playwright/test';

test('Email Invalid', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-ky');
  await page.fill('input[name="email"]', 'test');
  const registerButton = page.getByRole('button', { name: 'Đăng Ký' });
  await expect(registerButton).toBeVisible();
  await registerButton.click();
  await expect(page.getByText('Email không hợp lệ')).toBeVisible();
});