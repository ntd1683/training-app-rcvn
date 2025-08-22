import { test, expect } from '@playwright/test';

test('Product Detail - Check add to wishlist', async ({ page }) => {
    const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
    await page.goto(urlHome);

    await page.locator('.single-product').first().click();
    await page.waitForTimeout(500);
    await page.locator('.item-details.section .product-info .wish-button button').click();
    const btnText = await page.locator('.item-details.section .product-info .wish-button button').innerText();
    await expect(btnText).toContain('Xoá yêu thích');
    await expect(page.locator('.wishlist .total-items')).toHaveText(/1/);

    await page.mouse.wheel(0, -10000);
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/product-detail/screenshots/check-add-to-wishlist.png' });
});
