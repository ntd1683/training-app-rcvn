import { test, expect } from '@playwright/test';

test('Shop - Search all', async ({ page }) => {
  const urlShop = (process.env.TEST_URL || 'http://localhost:3000') + '/shop';
  await page.goto(urlShop);

  const inputSearch = await page.locator('.product-grids .row .single-widget.search form input[name="search_name"]');
  await inputSearch.fill('Bút bi');
  const inputSearchMin = await page.locator('.product-grids .row .single-widget.range .dual-range-container .range-inputs input[name="search_min"]');
  await inputSearchMin.fill('1');
  const inputSearchMax = await page.locator('.product-grids .row .single-widget.range .dual-range-container .range-inputs input[name="search_max"]');
  await inputSearchMax.fill('25');

  const beforeUrl = page.url();

  await page.waitForSelector('.product-grids .row .product-sidebar .button .btn.w-100');
  await page.getByRole('button', { name: 'Tìm Kiếm', exact: true }).click();
  await page.waitForTimeout(3000);
  const notFoundLocator = await page.locator('.product-grids .row .tab-content .not-found');

  if (await notFoundLocator.isVisible()) {
    await expect(notFoundLocator).toHaveText('Không có sản phẩm nào.');
  } else {
    const prices = await page.locator('.product-grids .row .tab-content .single-product .price span').allInnerTexts();
    for (const p of prices) {
      const numericPrice = parseFloat(p.replace(/[^0-9.]/g, ''));

      expect(numericPrice).toBeGreaterThanOrEqual(1);
      expect(numericPrice).toBeLessThanOrEqual(25);
    }
  }

  await page.waitForURL(url => url !== beforeUrl);
  const afterUrl = page.url();
  expect(afterUrl).toEqual(urlShop + "?name=B%C3%BAt+bi&price_from=1&price_to=25");

  await page.mouse.wheel(0, -10000);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'tests/shop/screenshots/search.png' });
});
