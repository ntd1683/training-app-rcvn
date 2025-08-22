import { test, expect } from '@playwright/test';
import { test as testLaravel } from '@hyvor/laravel-playwright';

const profile = {
    name: "John Doe",
    email: "john_doe@example.com",
    password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
}

// testLaravel('example', async ({ laravel }) => {
//     await laravel.factory('Customer', profile);
// });

test('Profile - Send Verify Email', async ({ page }) => {
    const urlLogin = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-nhap';
    await page.goto(urlLogin);
    await page.fill('input[name="email"]', profile.email);
    await page.fill('input[name="password"]', "password"); // profile.password  = password
    const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Đăng nhập thành công')).toBeVisible();

    const urlProfile = (process.env.TEST_URL || 'http://localhost:3000') + '/trang-ca-nhan';
    await page.goto(urlProfile);
    await page.locator('.container.section a.verify-email').click();
    await page.getByRole('button', { name: "Xác minh email" }).click();
    await expect(page.getByRole('alert')).toContainText('Email xác minh đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/profile/screenshots/send-verify-email.png' });
});