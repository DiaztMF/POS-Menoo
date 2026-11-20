# TeFa-POS Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform TeFa-POS into a fast, elegant, and production-ready Kantin/Kafe POS with an Ordoo-inspired modern UI, real-time analytics dashboard, comprehensive sales reports, and menu management.

**Architecture:** Laravel 12 backend with atomic database transactions for checkout and analytical aggregation for reports/dashboard; React 19 + Inertia.js v3 + Tailwind v4 frontend with Recharts and Radix UI components, structured across 4 focused pages.

**Tech Stack:** Laravel 12, PHP 8.2+, Inertia.js v3, React 19, TypeScript, Tailwind CSS v4, Recharts, Radix UI, Lucide Icons, Sonner.

## Global Constraints
- Target workspace: `D:\Project\Web Project\Private Web\TeFa-POS`
- Package manager: `pnpm`
- Git default branch: `master`
- Strict 4-page scope: Kasir (`/pos`), Dashboard (`/dashboard`), Laporan (`/laporan`), Kelola Menu (`/menu`)
- Zero console errors in browser DevTools; all network responses properly handled

---

### Task 1: Database Migrations & Realistic Seed Data

**Files:**
- Modify: `database/migrations/2026_11_18_070345_create_menu_items_table.php`
- Modify: `database/migrations/2026_11_18_070346_create_transactions_table.php`
- Modify: `app/Models/MenuItem.php`
- Modify: `app/Models/Transaction.php`
- Create: `database/seeders/RealisticPosSeeder.php`
- Modify: `database/seeders/DatabaseSeeder.php`

**Interfaces:**
- Produces:
  - `transactions` schema with `invoice_no` (string, unique), `cash_given` (integer), `change_amount` (integer), `payment_method` (string: 'cash'|'qris')
  - `menu_items` schema with `image` (string, nullable)
  - Pre-seeded categories ('Makanan', 'Minuman', 'Camilan'), realistic items with prices, and past 7 days of historical transactions

- [ ] **Step 1: Update migrations for menu_items and transactions**
  - Add `image` column to `menu_items`.
  - Add `invoice_no`, `cash_given`, `change_amount` to `transactions`.
- [ ] **Step 2: Update Eloquent models with mass-assignment fillable attributes**
  - Update `MenuItem::$fillable`: `['menu_category_id', 'name', 'price', 'image', 'is_available']`.
  - Update `Transaction::$fillable`: `['invoice_no', 'user_id', 'total_amount', 'cash_given', 'change_amount', 'payment_method', 'payment_status', 'transaction_date']`.
  - Define relations: `Transaction::hasMany(TransactionItem::class)`, `TransactionItem::belongsTo(MenuItem::class)`.
- [ ] **Step 3: Create RealisticPosSeeder with categories, items, and 7 days of transactions**
  - Seed 8-12 realistic canteen items (e.g. Nasi Goreng, Mie Ayam, Es Teh Manis, Kopi Susu, Kentang Goreng).
  - Seed past 7 days of transactions with mixed Cash & QRIS so Dashboard and Reports are immediately populated.
- [ ] **Step 4: Run migration fresh and test seeder**
  - Run `php artisan migrate:fresh --seed`.
- [ ] **Step 5: Commit changes**
  - `git add . && git commit -m "feat(db): update schema for invoice and seed realistic pos data"`

---

### Task 2: Backend Controllers & Route Handlers

**Files:**
- Modify: `app/Http/Controllers/Pos/PosController.php`
- Create: `app/Http/Controllers/Pos/DashboardController.php`
- Modify: `app/Http/Controllers/Pos/ReportController.php`
- Create: `app/Http/Controllers/Pos/MenuController.php`
- Modify: `routes/web.php`
- Create: `tests/Feature/PosCheckoutTest.php`

**Interfaces:**
- Produces:
  - `POST /api/pos/checkout`: Atomic checkout with price verification and receipt JSON response
  - `GET /api/pos/menu`: JSON menu categories with items
  - `GET /dashboard`: Inertia render with `metrics`, `sales_trend_7d`, `recent_transactions`, `top_items`
  - `GET /api/laporan`: Query range analytics (total sales, cash vs qris, items breakdown)
  - `GET /menu`, `POST /api/menu`, `PUT /api/menu/{id}`, `PATCH /api/menu/{id}/toggle`, `DELETE /api/menu/{id}`

- [ ] **Step 1: Write test for PosCheckoutTest**
  - Test valid cash transaction calculates change properly.
  - Test insufficient cash rejected with 422.
  - Test prices recalculated from database.
- [ ] **Step 2: Implement PosController::store with DB::transaction**
  - Generate invoice number: `INV-{date}-{seq}`.
  - Recalculate item prices from DB.
  - Validate and save `Transaction` and `TransactionItem`.
- [ ] **Step 3: Implement DashboardController**
  - Aggregate today's gross sales, today's transactions, basket size (AOV).
  - Generate 7-day historical daily revenue array for Recharts.
  - Fetch 5 most recent transactions with kasir & items count.
- [ ] **Step 4: Enhance ReportController**
  - Accept `start_date` and `end_date` parameters (default to current month).
  - Calculate total sales, transaction count, cash revenue, QRIS revenue.
  - Group top-selling menu items by quantity and revenue.
- [ ] **Step 5: Implement MenuController for master data CRUD**
  - Handle create, update, toggle availability (`is_available = !is_available`), and delete.
- [ ] **Step 6: Register all routes in routes/web.php**
  - Bind `/dashboard`, `/pos`, `/laporan`, and `/menu` to their controllers.
- [ ] **Step 7: Run PHPUnit/Pest tests and verify 100% pass**
  - `php artisan test --filter=PosCheckoutTest`.
- [ ] **Step 8: Commit changes**
  - `git add . && git commit -m "feat(api): implement checkout, dashboard, report, and menu controllers"`

---

### Task 3: Install Frontend Recharts & Unified Sidebar Navigation

**Files:**
- Modify: `package.json` (install `recharts`)
- Modify: `resources/js/components/app-sidebar.tsx` (or main layout navigation)
- Modify: `resources/js/layouts/app-layout.tsx`

**Interfaces:**
- Produces:
  - Working `recharts` package in `node_modules`
  - Clean sidebar with links: 🛒 Kasir (`/pos`), 📊 Dashboard (`/dashboard`), 📑 Laporan (`/laporan`), 🍽️ Kelola Menu (`/menu`)

- [ ] **Step 1: Install recharts via pnpm**
  - `pnpm add recharts`
- [ ] **Step 2: Update sidebar navigation links and active states**
  - Ensure links point cleanly to `route('pos')`, `route('dashboard')`, `route('report')`, and `route('menu.index')`.
- [ ] **Step 3: Verify TypeScript builds without errors**
  - `pnpm run types:check`
- [ ] **Step 4: Commit changes**
  - `git add . && git commit -m "feat(ui): add recharts and update sidebar navigation"`

---

### Task 4: High-Speed POS Cashier Screen & Thermal Receipt

**Files:**
- Modify: `resources/js/pages/pos.tsx`
- Create: `resources/js/components/pos/payment-modal.tsx`
- Create: `resources/js/components/pos/receipt-dialog.tsx`

**Interfaces:**
- Produces:
  - Fixed viewport 2-column POS interface (`h-screen overflow-hidden`)
  - Instant category pills filter & search bar
  - Interactive cart with quantity steppers and subtotal
  - Payment modal with Tunai / QRIS tabs, quick-cash chips (`[Uang Pas]`, `[10k]`, `[20k]`, `[50k]`, `[100k]`), and automatic change display
  - 58mm/80mm formatted thermal receipt dialog with print trigger

- [ ] **Step 1: Build the 2-column fixed layout in pos.tsx**
  - Left column: Category chips + search input + responsive item grid.
  - Right column: Cart panel with items list, total summary, and checkout CTA.
- [ ] **Step 2: Create PaymentModal component**
  - Support Tunai and QRIS modes.
  - Implement smart chip calculations based on cart total.
  - Calculate and display change in real-time with clear visual feedback.
- [ ] **Step 3: Create ReceiptDialog component with print CSS**
  - Format receipt simulating a 58mm/80mm thermal paper roll.
  - Add print action triggering `window.print()` with `@media print` scoped stylesheet that hides everything except the receipt paper.
- [ ] **Step 4: Connect checkout flow with Sonner toasts & error handling**
  - On checkout success, clear cart and display ReceiptDialog.
- [ ] **Step 5: Verify build & commit**
  - `pnpm run types:check && git add . && git commit -m "feat(pos): revamp cashier screen with quick cash and thermal receipt"`

---

### Task 5: Live Analytics Dashboard with Recharts

**Files:**
- Modify: `resources/js/pages/dashboard.tsx`
- Create: `resources/js/components/dashboard/sales-trend-chart.tsx`
- Create: `resources/js/components/dashboard/stat-card.tsx`

**Interfaces:**
- Produces:
  - 4 KPI metric cards (Today's Sales, Transactions Count, Average Order Value, Top Item)
  - 7-Day sales trend gradient area chart using Recharts
  - 5 Recent transactions list with Cash/QRIS badges
  - Quick action button jumping straight to Kasir (`/pos`)

- [ ] **Step 1: Create StatCard component for KPI metrics**
  - Support title, formatted value, icon, and trend badge.
- [ ] **Step 2: Create SalesTrendChart component using Recharts AreaChart**
  - Smooth curve, custom IDR tooltip, responsive container.
- [ ] **Step 3: Assemble dashboard.tsx with live controller data**
  - Render KPI cards, sales chart, recent transactions, and top 5 items.
- [ ] **Step 4: Verify build & commit**
  - `pnpm run types:check && git add . && git commit -m "feat(dashboard): add live metrics, recharts sales trend, and recent orders"`

---

### Task 6: Sales Reports Screen with Filters and Print View

**Files:**
- Modify: `resources/js/pages/report.tsx`
- Create: `resources/js/components/report/report-summary.tsx`
- Create: `resources/js/components/report/report-table.tsx`

**Interfaces:**
- Produces:
  - Quick date presets ("Hari Ini", "7 Hari Terakhir", "Bulan Ini") and custom date inputs
  - Cash vs QRIS distribution progress bar
  - Top-selling items table
  - Detailed transaction history table
  - Print / PDF layout button

- [ ] **Step 1: Create DateRangeSelector and filter state**
  - Fetch report dynamically when date range changes.
- [ ] **Step 2: Create ReportSummary component**
  - Display total revenue, transactions count, and Cash vs QRIS split.
- [ ] **Step 3: Create ReportTable component**
  - Render detailed rows with invoice, cashier, payment method badge, and total.
- [ ] **Step 4: Add print-friendly CSS for A4 report printing**
- [ ] **Step 5: Verify build & commit**
  - `pnpm run types:check && git add . && git commit -m "feat(report): add date range filters, payment split, and print report"`

---

### Task 7: Menu Management Screen (Master Data CRUD)

**Files:**
- Create: `resources/js/pages/menu/index.tsx`
- Create: `resources/js/components/menu/menu-dialog.tsx`

**Interfaces:**
- Produces:
  - Menu items table with category filter
  - Quick toggle switch for `is_available`
  - Create and Edit dialog modal with price formatting and category select
  - Delete confirmation dialog

- [ ] **Step 1: Create menu table with category filter in resources/js/pages/menu/index.tsx**
  - Show thumbnail/icon, name, category, price, availability switch, and action buttons.
- [ ] **Step 2: Create MenuDialog for adding and editing menu items**
  - Form validation with Inertia `useForm`.
- [ ] **Step 3: Implement toggle availability with fast optimistic update**
- [ ] **Step 4: Verify build & commit**
  - `pnpm run types:check && git add . && git commit -m "feat(menu): implement menu items management and availability toggle"`

---

### Task 8: End-to-End Verification, CI Setup & Documentation

**Files:**
- Modify: `README.md` (format standard accelint-readme-writer)
- Create: `LICENSE` (MIT)
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Run full production build & typecheck**
  - `pnpm run build && pnpm run types:check && php artisan test`
- [ ] **Step 2: Auto-setup GitHub Actions CI (.github/workflows/ci.yml)**
  - Add PHP 8.2+ setup, composer install, pnpm install, pnpm build, php artisan test.
- [ ] **Step 3: Write comprehensive humanized README.md and LICENSE file**
  - Follow accelint-readme-writer format rules.
- [ ] **Step 4: Final commit to master**
  - `git add . && git commit -m "chore: setup CI, documentation, and verify production readiness"`
