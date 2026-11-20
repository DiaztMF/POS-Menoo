import { test, expect } from '@playwright/test';

test('landing page redirects to login', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/login/);
});

test('login page has Masuk button', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('button:has-text("Masuk")')).toBeVisible();
});

test('POS page is reachable (redirects to login when unauthenticated)', async ({ page }) => {
    await page.goto('/pos', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('button:has-text("Masuk")')).toBeVisible();
});

test('Report page is reachable (redirects to login when unauthenticated)', async ({ page }) => {
    await page.goto('/laporan', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('button:has-text("Masuk")')).toBeVisible();
});
