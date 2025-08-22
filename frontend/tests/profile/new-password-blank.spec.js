import { test, expect } from '@playwright/test';
import { test as testLaravel } from '@hyvor/laravel-playwright';
import { Agent } from 'http';

const profile = {
    name: "John Doe",
    email: "john_doe@example.com",
    password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
}

// testLaravel('example', async ({ laravel }) => {
//     await laravel.factory('Customer', profile);
// });

test('Profile - change name', async ({ page }) => {
    const urlLogin = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-nhap';
    await page.goto(urlLogin);
    await page.fill('input[name="email"]', profile.email);
    await page.fill('input[name="password"]', "password"); // profile.password  = password
    const loginButton = page.getByRole('button', { name: 'Đăng Nhập' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('alert')).toContainText('Đăng nhập thành công');

    const urlProfile = (process.env.TEST_URL || 'http://localhost:3000') + '/trang-ca-nhan';
    await page.goto(urlProfile);
    await expect(page.getByText(profile.email)).toBeVisible();

    await page.getByRole('button', { name: 'Đổi mật khẩu' }).click();
    const inputPassword = page.locator('input[name="newPassword"]');
    await inputPassword.fill('');
    await page.getByRole('button', { name: 'Cập nhật thông tin' }).click();
    await expect(page.getByText('Vui lòng nhập mật khẩu mới')).toBeVisible();

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/profile/screenshots/new-password-blank.png' });
});