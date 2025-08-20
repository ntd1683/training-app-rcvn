import {test, expect} from '@playwright/test';

test('Email Blank', async ({ page }) => {
  const urlForgotPassword = (process.env.TEST_URL || 'http://localhost:3000') + '/quen-mat-khau';
  await page.goto(urlForgotPassword);
  await page.fill('input[name="email"]', '');
  const btn = page.getByRole('button', { name: 'Quên Mật Khẩu' });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByText('Email không được bỏ trống')).toBeVisible();
});