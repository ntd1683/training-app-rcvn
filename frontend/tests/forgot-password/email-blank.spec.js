import {test, expect} from '@playwright/test';

test('Email Blank', async ({ page }) => {
  await page.goto('http://localhost:3000/quen-mat-khau');
  await page.fill('input[name="email"]', '');
  const btn = page.getByRole('button', { name: 'Quên Mật Khẩu' });
  await expect(btn).toBeVisible();
  await btn.click();
  await expect(page.getByText('Email không được bỏ trống')).toBeVisible();
});