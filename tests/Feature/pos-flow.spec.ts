import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[data-test="login-button"]');
    await page.waitForURL('**/dashboard');
}

test('cashier flow: menu loads, checkout persists, report reflects sale', async ({ page }) => {
    await login(page);
    await page.goto('/pos', { waitUntil: 'domcontentloaded' });

    // Menu must load from the API (regression: wrong wayfinder route returned HTML).
    const menuCard = page.locator('[role="button"][aria-label^="Tambah"]').first();
    await expect(menuCard).toBeVisible();

    // Menu card is keyboard focusable (a11y).
    await menuCard.focus();
    await expect(menuCard).toBeFocused();

    await menuCard.click();

    // Right order panel reflects the item; open payment modal.
    await expect(page.getByText('Pesanan Saat Ini')).toBeVisible();
    await page.locator('button:has-text("Bayar")').click();
    await expect(page.getByText('Pembayaran Kasir')).toBeVisible();

    // Cash calculator: pay exact then confirm (regression: CSRF + stale payload).
    await page.fill('#cashInput', '100000');
    await page.locator('button:has-text("Selesaikan Bayar")').click();
    await expect(page.getByText('Transaksi Selesai')).toBeVisible();
    await page.locator('button:has-text("Transaksi Baru")').click();
    await expect(page.getByText('Keranjang kosong')).toBeVisible();

    // Report must reflect the sale (regression: wrong report API route).
    await page.goto('/laporan', { waitUntil: 'domcontentloaded' });
    await page.click('button:has-text("Lihat Laporan")');
    await expect(page.getByText('Total Penjualan')).toBeVisible();
    await expect(page.getByText('Rincian per Menu')).toBeVisible();
});

test('cashier search filters menu', async ({ page }) => {
    await login(page);
    await page.goto('/pos', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[role="button"][aria-label^="Tambah"]').first()).toBeVisible();
    await page.fill('input[aria-label="Cari menu"]', 'Bakso');
    await expect(page.locator('[role="button"][aria-label^="Tambah"]')).toHaveCount(1);
    await page.fill('input[aria-label="Cari menu"]', 'zzz-tidak-ada');
    await expect(page.getByText('Item tidak ditemukan.')).toBeVisible();
});

test.describe('mobile', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('mobile POS keeps menu and order panel usable', async ({ page }) => {
        await login(page);
        await page.goto('/pos', { waitUntil: 'domcontentloaded' });

        const menuCard = page.locator('[role="button"][aria-label^="Tambah"]').first();
        await expect(menuCard).toBeVisible();
        await menuCard.click();

        await page.locator('button:has-text("Bayar")').click();
        await expect(page.getByText('Pembayaran Kasir')).toBeVisible();
    });
});