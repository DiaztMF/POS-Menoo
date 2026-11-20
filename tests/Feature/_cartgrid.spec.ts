import { test } from '@playwright/test';

test('cart 3-per-row shot', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[data-test="login-button"]');
    await page.waitForURL('**/dashboard');
    await page.goto('/pos', { waitUntil: 'networkidle' });
    const cards = page.locator('[role="button"][aria-label^="Tambah"]');
    await cards.nth(0).click();
    await cards.nth(1).click();
    await cards.nth(2).click();
    await cards.nth(3).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'shots/kasir-cartgrid.png', fullPage: true });
});