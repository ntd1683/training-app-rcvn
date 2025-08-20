import { test, expect } from '@playwright/test';

test('Check banner', async ({ page }) => {
    const urlHome = (process.env.TEST_URL || 'http://localhost:3000') + '/';
    await page.goto(urlHome);

    await page.waitForSelector('.hero-area .single-slider .content .button a.btn');
    const bannerBtns = page.locator('.hero-area .single-slider .content .button a.btn');
    const count = await bannerBtns.count();
    console.log("Banner button locator: ", count);

    if (count === 0) {
        throw new Error('❌ Không tìm thấy nút "Mua Ngay" trong banner');
    }

    for (let i = 0; i < count; i++) {
        console.log(`👉 Kiểm tra nút Mua Ngay trong banner thứ ${i + 1}`);

        const beforeUrl = page.url();

        const btn = bannerBtns.nth(i);
        await expect(btn).toBeVisible();
        await btn.click();

        await page.waitForURL(url => url !== beforeUrl);
        const afterUrl = page.url();
        expect(afterUrl).not.toBe(beforeUrl);
        await page.screenshot({ path: `tests/home_page/screenshots/check_banner_${i + 1}.png` });

        console.log(`✅ Redirect thành công: ${beforeUrl} → ${afterUrl}`);
        await page.goto('http://localhost:3000/');
    }
});