import {test, expect} from '@playwright/test';

test('Email Blank', async ({ page }) => {
  let token = '1376884366155ac51135e60682997c967e1b7647a7ac6f59fe411cb797e8f670';
  await page.goto('http://localhost:3000/khoi-phuc-mat-khau/' + token);
  await page.fill('input[name="email"]', '');
  const btn = page.getByRole('button', { name: 'Khôi Phục Mật Khẩu' });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByText('Email không được bỏ trống')).toBeVisible();
});