import {test, expect} from '@playwright/test';

test('Remember Me', async ({ page }) => {
  const urlLogin = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-nhap';
  await page.goto(urlLogin);
  await page.check('#remember-me');
  await expect(page.locator('#remember-me')).toBeChecked();
});