import { test, expect } from '@playwright/test';

test('Product Detail - Check add to cart', async ({ page }) => {
    const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
    await page.goto(urlHome);

    const product = await page.locator('.single-product').first().click();
    await page.waitForTimeout(500);
    const inputSearch = await page.locator('.item-details.section .product-info input[name="quantity"]');
    await inputSearch.fill('2');
    await page.locator('.item-details.section .product-info .cart-button button').click();
    const btnText = await page.locator('.item-details.section .product-info .cart-button button').innerText();
    await expect(btnText).toContain('Đã Thêm Vào Giỏ Hàng');

    await expect(page.locator('.cart-items .main-btn .total-items')).toHaveText(/2/);
    await page.screenshot({ path: 'tests/product-detail/screenshots/check-add-to-cart.png' });
});
