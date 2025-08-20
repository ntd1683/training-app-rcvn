import { test, expect } from '@playwright/test';

test('Shop - Search with page and perpage', async ({ page }) => {
  const urlShop = (process.env.TEST_URL || 'http://localhost:3000') + '/shop';
  await page.goto(urlShop);

  const beforeUrl = page.url();
  const sorting = page.locator('#sorting');
  await sorting.selectOption({ label: 'A - Z' });
  await expect(sorting).toHaveValue('name_asc');
  await page.waitForTimeout(500);
  const selectPerPage = page.locator('.product-grids .tab-content .row select.form-perpage');
  await selectPerPage.selectOption('5');
  await page.waitForTimeout(500);
  const selectPage = page.getByRole('link', { name: '2', exact: true });
  await selectPage.click();
  await page.waitForTimeout(3000);

  const notFoundLocator = await page.locator('.product-grids .row .tab-content .not-found');
  if (await notFoundLocator.isVisible()) {
    await expect(notFoundLocator).toHaveText('Không có sản phẩm nào.');
  } else {
    await expect(page.locator('.product-grids .row .tab-content .single-product .price span').first()).toBeVisible();
  }

  await page.waitForURL(url => url !== beforeUrl);
  const afterUrl = page.url();
  expect(afterUrl).toEqual(urlShop + "?sort_name=name_asc&page=2&per_page=5");

  await page.mouse.wheel(0, -10000);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/shop/screenshots/search-with-sorting.png' });
});