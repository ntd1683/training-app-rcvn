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
    const inputPassword = page.locator('input[name="password"]');
    await inputPassword.fill('password');
    const inputNewPassword = page.locator('input[name="newPassword"]');
    await inputNewPassword.fill('password');
    const inputReNewPassword = page.locator('input[name="confirmPassword"]');
    await inputReNewPassword.fill('password');
    await page.getByRole('button', { name: 'Cập nhật thông tin' }).click();
    await expect(page.getByRole('alert')).toContainText('Cập nhật thông tin thành công');

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/profile/screenshots/change-password.png' });

    const urlLogout = (process.env.TEST_URL || 'http://localhost:3000') + '/dang-xuat';
    await page.goto(urlLogout);
    await page.waitForTimeout(500);
    await page.goto(urlLogin);
    await page.fill('input[name="email"]', profile.email);
    await page.fill('input[name="password"]', "password"); // profile.password  = password
    const loginButtonV1 = page.getByRole('button', { name: 'Đăng Nhập' });
    await expect(loginButtonV1).toBeVisible();
    await loginButtonV1.click();
    await page.waitForTimeout(500);
    await expect(page.getByRole('alert')).toContainText('Đăng nhập thành công');
});