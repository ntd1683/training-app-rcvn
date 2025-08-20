import {test, expect} from '@playwright/test';

test('Forget Password', async ({ page }) => {
  const urlForgotPassword = (process.env.TEST_URL || 'http://localhost:3000') + '/quen-mat-khau';
  await page.goto(urlForgotPassword);
  await page.fill('input[name="email"]', 'test@example.com');
  const btn = page.getByRole('button', { name: 'Quên Mật Khẩu' });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByRole('alert')).toContainText('Vui lòng kiểm tra email để lấy lại mật khẩu');
});