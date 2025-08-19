import {test, expect} from '@playwright/test';

test('token invalid', async ({ page }) => {
  let token = '1376884366155ac51135e60682997c967e1b7647a7ac6f59fe411cb797e8f670';
  await page.goto('http://localhost:3000/khoi-phuc-mat-khau/' + token);
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.fill('input[name="rePassword"]', 'password');
  const btn = page.getByRole('button', { name: 'Khôi Phục Mật Khẩu' });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByRole('alert')).toContainText('Có lỗi xảy ra: Token không hợp lệ hoặc đã hết hạn');
});