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

test('Profile - Verify Email', async ({ page }) => {
    const id = "eyJpZCI6MTEyLCJoYXNoIjoiZmY4YTNhNjhjMjY0YzNmYjdlNWQ5MmU4ZGQ3MGI3NjRhMDBhZmU2YSIsImV4cGlyZXMiOjE3NTU2ODI4Mjh9";
    const urlVerifyEmail = (process.env.TEST_URL || 'http://localhost:3000') + '/xac-thuc-email/' + id;
    await page.goto(urlVerifyEmail);
    await page.getByRole('button', { name: "Xác thực email" }).click();
    await expect(page.getByRole('alert')).toContainText('Xác thực email thành công');

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
    const emailLabel = page.locator('label[for="email"]');
    const labelText = await emailLabel.innerText();
    expect(labelText).not.toContain('Email (Chưa xác minh)');

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'tests/profile/screenshots/verify-email.png' });
});