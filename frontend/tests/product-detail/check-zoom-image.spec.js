import { test, expect } from '@playwright/test';

test('Product Detail - Check hover zoom image', async ({ page }) => {
    const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
    await page.goto(urlHome);

    await page.locator('.single-product').first().click();
    await page.waitForTimeout(500);
    const image = page.locator('.item-details.section #current_image');
    await image.scrollIntoViewIfNeeded();
    await image.hover();
    const zoomWindow = page.locator('.item-details.section .zoom-image-display');
    await expect(zoomWindow).toBeVisible();
    await page.screenshot({ path: 'tests/product-detail/screenshots/check-hover-zoom-image.png' });
});
