import { test, expect } from '@playwright/test';

test('Product Detail - layout', async ({ page }) => {
    const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
    await page.goto(urlHome);

    const product = page.locator('.single-product').first();
    const productInfo = await product.locator('.product-info');
    const title = await productInfo.locator('.title').innerText();
    const price = await productInfo.locator('.price').innerText();
    const quantity = await productInfo.locator('.product-item-quantity').innerText();
    console.log({ title, price, quantity });
    await page.locator('.single-product').first().click();
    await page.waitForTimeout(500);
    const productDetailInfo = page.locator('.item-details.section .product-info');
    await expect(productDetailInfo.locator('.title')).toHaveText(title);
    await expect(productDetailInfo.locator('.price')).toHaveText(price);

    await page.screenshot({ path: 'tests/product-detail/screenshots/layout.png' });
});
