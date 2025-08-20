import { test, expect } from '@playwright/test';

test('Search Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 }); // desktop
  const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
  await page.goto(urlHome);

  await page.fill('input[name="search_desktop"]', 'Bút bi');
  await expect(page.locator('.search-dropdown .flex-grow-1 h6').first()).toContainText('Bút bi');
});
