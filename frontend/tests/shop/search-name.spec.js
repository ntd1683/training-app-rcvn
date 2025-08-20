import { test, expect } from '@playwright/test';

test('Shop - Search name', async ({ page }) => {
  const urlShop = (process.env.TEST_URL || 'http://localhost:3000') + '/shop';
  await page.goto(urlShop);

  const inputSearch = await page.locator('.product-grids .row .single-widget.search form input[name="search_name"]');
  await inputSearch.fill('Bút bi');

  const beforeUrl = page.url();

  await page.waitForSelector('.product-grids .row .product-sidebar .button .btn.w-100');
  await page.getByRole('button', { name: 'Tìm Kiếm', exact: true }).click();
  await page.waitForTimeout(3000);

  const notFoundLocator = await page.locator('.product-grids .row .tab-content .not-found');
  if (await notFoundLocator.isVisible()) {
    await expect(notFoundLocator).toHaveText('Không có sản phẩm nào.');
  } else {
    await expect(page.locator('.product-grids .row .tab-content .row .single-product h4.title').first()).toContainText('Bút bi');
  }
  await page.waitForURL(url => url !== beforeUrl);
  const afterUrl = page.url();
  expect(afterUrl).toEqual(urlShop + "?name=B%C3%BAt+bi");

  await page.mouse.wheel(0, -10000);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/shop/screenshots/search-name.png' });
});