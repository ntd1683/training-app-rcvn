import {test, expect} from '@playwright/test';

test('Reset Password', async ({ page }) => {
  let token = 'a9e005c2b6ee1f65ef1ae6ec6b73cc513ad697963610e752c2731423a1ae5b6d';
  const urlResetPassword = (process.env.TEST_URL || 'http://localhost:3000') + '/khoi-phuc-mat-khau/' + token;
  await page.goto(urlResetPassword);
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.fill('input[name="rePassword"]', 'password');
  const btn = page.getByRole('button', { name: 'Khôi Phục Mật Khẩu' });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByRole('alert')).toContainText('Đổi mật khẩu thành công');
});