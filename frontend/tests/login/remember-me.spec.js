import {test, expect} from '@playwright/test';

test('Remember Me', async ({ page }) => {
  await page.goto('http://localhost:3000/dang-nhap');
  await page.check('#remember-me');
  await expect(page.locator('#remember-me')).toBeChecked();
});