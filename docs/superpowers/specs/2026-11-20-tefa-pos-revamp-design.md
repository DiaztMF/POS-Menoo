# Design Document: TeFa-POS Revamp (Kantin & Kafe Cepat Saji)

- **Date:** 2026-11-20
- **Project:** TeFa-POS (`D:\Project\Web Project\Private Web\TeFa-POS`)
- **Status:** Approved Design Specification
- **Primary Goal:** Revamp TeFa-POS from a barebone prototype into a high-performance, polished, and intuitive Web POS tailored for fast-service canteen/cafe operations, featuring an Ordoo-inspired clean visual system, real-time analytics dashboard, sales reporting, and menu management.

---

## 1. Problem Statement & Scope

### 1.1 Problems in Previous Versions
1. **`cafe-management-system`**: Over-engineered with guest QR table ordering, Midtrans payment gateway webhooks, customer authentication, and table session management, creating operational bloat for simple cashiering.
2. **`TeFa-POS` (Existing)**: Over-simplified to the point of being unusable in production:
   - Dashboard only contains static, non-functional placeholder cards.
   - POS lacks real cashier convenience: no quick-cash calculator buttons (e.g. Uang Pas, 10k, 20k, 50k, 100k), no clear feedback, and no thermal receipt printing.
   - Report screen only has a single flat date query without payment method breakdown, analytics charts, or print options.
   - No UI to manage menu items or categories without running seeders.

### 1.2 Target Scope (Strictly 4 Pages)
1. **POS / Kasir (`/pos`)**: High-speed, 2-column fixed-height cashier checkout with instant search, category filtering, cart management, quick cash & QRIS payment modal, and 58mm/80mm thermal receipt generator.
2. **Dashboard (`/dashboard`)**: Actionable real-time metrics (Today's Gross Revenue, Today's Transactions, Average Order Value, Top Selling Item), 7-day sales trend area chart (Recharts), and latest 5 transactions.
3. **Laporan Penjualan (`/laporan`)**: Date-range filtered sales reports, breakdown of Cash vs QRIS revenue, top items breakdown, transaction ledger table, and clean print/PDF view.
4. **Kelola Menu (`/menu`)**: Simple master data CRUD for menu categories and menu items with image support, price configuration, and availability toggles.

---

## 2. Technical Stack & Dependencies

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, Inertia.js v3, TypeScript
- **Styling**: Tailwind CSS v4, tw-animate-css, Radix UI primitives, Lucide Icons, Sonner (Toasts)
- **Charts**: Recharts (for Dashboard & Report analytics)
- **Database**: SQLite (default local) or MySQL
- **Build Tool**: Vite Plus (`vp` / `vite`)

---

## 3. Database Architecture & Schema Changes

### 3.1 Schema Definition

#### `menu_categories`
- `id`: unsigned big integer, primary key, auto-increment
- `name`: string (e.g., 'Makanan', 'Minuman', 'Camilan')
- `slug`: string, unique
- `sort_order`: integer, default 1
- `timestamps`

#### `menu_items`
- `id`: unsigned big integer, primary key, auto-increment
- `menu_category_id`: foreign key references `menu_categories.id` on delete cascade
- `name`: string
- `price`: integer (in IDR)
- `image`: string, nullable (URL or relative storage path for product thumbnail)
- `is_available`: boolean, default true
- `timestamps`

#### `transactions`
- `id`: unsigned big integer, primary key, auto-increment
- `invoice_no`: string, unique, indexed (e.g., `INV-261120-0001`)
- `user_id`: foreign key references `users.id` on delete set null
- `total_amount`: integer (in IDR)
- `cash_given`: integer, default 0 (amount handed by customer)
- `change_amount`: integer, default 0 (change returned)
- `payment_method`: enum/string (`cash`, `qris`), default `cash`
- `payment_status`: string, default `paid`
- `transaction_date`: date, indexed
- `timestamps`

#### `transaction_items`
- `id`: unsigned big integer, primary key, auto-increment
- `transaction_id`: foreign key references `transactions.id` on delete cascade
- `menu_item_id`: foreign key references `menu_items.id` on delete cascade
- `quantity`: integer, default 1
- `unit_price`: integer (snapshot of menu item price at transaction time)
- `subtotal`: integer (quantity * unit_price)
- `timestamps`

---

## 4. Backend Endpoints & Controller Contracts

All routes are protected under `auth` and `verified` middleware.

### 4.1 POS & Checkout (`PosController`)
- `GET /pos`: Inertia page render for Cashier UI.
- `GET /api/pos/menu`: JSON response returning list of categories with their active `menu_items`.
- `POST /api/pos/checkout`: JSON endpoint.
  - **Payload**:
    ```json
    {
      "items": [
        { "menu_item_id": 1, "quantity": 2 }
      ],
      "payment_method": "cash",
      "cash_given": 50000
    }
    ```
  - **Processing**:
    - Wrap in DB Transaction (`DB::transaction`).
    - Recalculate price from database to prevent client-side tampering.
    - Generate sequential invoice number `INV-YYMMDD-XXXX`.
    - If `payment_method === 'cash'`, assert `cash_given >= total_amount` and calculate `change_amount`.
    - If `payment_method === 'qris'`, set `cash_given = total_amount` and `change_amount = 0`.
    - Create `transactions` and `transaction_items` records.
  - **Response**: Return created transaction with items, formatted for instant receipt generation.

### 4.2 Dashboard (`DashboardController`)
- `GET /dashboard`: Inertia page render passing:
  - `metrics`:
    - `today_sales`: Total gross revenue for current date.
    - `today_transactions`: Total completed transaction count for current date.
    - `average_order_value`: Average transaction value for current date.
    - `top_item_today`: Most ordered item today.
  - `sales_trend_7d`: Array of `{ date: '2026-11-14', formatted: '14 Nov', total: 450000 }` for Recharts.
  - `recent_transactions`: 5 most recent transactions with invoice, time, payment method, and total.

### 4.3 Sales Report (`ReportController`)
- `GET /laporan`: Inertia page render for Report UI.
- `GET /api/laporan`: JSON endpoint.
  - **Query Params**: `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD).
  - **Response**:
    - `summary`: Total revenue, total transactions, cash revenue, QRIS revenue.
    - `top_selling_items`: Aggregated quantity and revenue by menu item.
    - `transactions`: Full paginated or date-bound list of transactions with item breakdown.

### 4.4 Menu Management (`MenuController`)
- `GET /menu`: Inertia page render with categories and menu items list.
- `POST /api/menu`: Store new menu item.
- `PUT /api/menu/{id}`: Update menu item name, price, category, image.
- `PATCH /api/menu/{id}/toggle`: Fast toggle `is_available` boolean.
- `DELETE /api/menu/{id}`: Delete menu item.

---

## 5. UI/UX Specifications

### 5.1 Application Shell & Navigation
- Shared modern sidebar layout with minimal footprint:
  - Brand header: TeFa POS logo + Active Cashier Name.
  - Navigation Links:
    - 🛒 Kasir (`/pos`)
    - 📊 Dashboard (`/dashboard`)
    - 📑 Laporan (`/laporan`)
    - 🍽️ Kelola Menu (`/menu`)
  - Footer: User profile dropdown & logout.

### 5.2 POS Screen (`/pos`)
- **Layout**: Fixed viewport `h-screen overflow-hidden` (zero window scrollbar).
- **Left Column (Catalog, 65%)**:
  - Top bar: Search bar (`autofocus`, instant filter) + horizontal category pill chips with count badges.
  - Content: Responsive card grid.
    - Card: Image/Icon, bold title, formatted price (e.g., `Rp 15.000`), subtle tap feedback, "Habis" badge if unavailable.
- **Right Column (Cart Panel, 35%)**:
  - Header: Order items count + "Kosongkan" button.
  - Items list: Compact rows with item title, `[-] [qty] [+]` stepper, item subtotal, and delete button.
  - Footer calculation: Subtotal, total amount in large clear typography.
  - Action button: Full-width vibrant "Bayar Pesanan (F9)".

### 5.3 Payment & Thermal Receipt Dialogs
- **Payment Dialog**:
  - Segmented toggle: **Tunai** vs **QRIS**.
  - Tunai mode: Input nominal + smart quick-cash chips: `[Uang Pas]`, `[Rp 10.000]`, `[Rp 20.000]`, `[Rp 50.000]`, `[Rp 100.000]`.
  - Automatic change calculation: Green positive callout for change, red notice if cash given is insufficient.
  - QRIS mode: Static canteen QRIS preview image + "Konfirmasi Pembayaran QRIS".
- **Thermal Receipt Dialog**:
  - Monospace receipt preview simulating 58mm/80mm roll:
    - Header: Kantin TeFa SMK, invoice number, timestamp, cashier name.
    - Items table: Name, quantity, unit price, subtotal.
    - Summary: Total, Cash Given, Change, Payment Method.
    - Footer: "Terima kasih atas kunjungan Anda".
  - Actions: "Cetak Struk" (triggers `@media print` scoped stylesheet) & "Transaksi Baru".

### 5.4 Dashboard Screen (`/dashboard`)
- 4 KPI metric cards with subtle background badges and trend arrows.
- 7-Day sales area chart rendered with Recharts (custom tooltip with IDR formatting).
- Recent transactions list with payment method badges (`Cash` in emerald, `QRIS` in violet).

### 5.5 Report Screen (`/laporan`)
- Date presets: "Hari Ini", "7 Hari Terakhir", "Bulan Ini", plus custom date picker.
- Metric summary cards (Total Revenue, Cash vs QRIS split progress bar).
- Top items ranking bar/table.
- Detailed transactions table.
- "Cetak Laporan" action formatted for clean A4 print preview.

---

## 6. Error Handling & Validation Rules

1. **Checkout Integrity**:
   - Empty cart submission is rejected with 422 Unprocessable Entity.
   - Menu items that are marked `is_available: false` cannot be checked out.
   - Cash given must be `>= total_amount`.
2. **Concurrency & Race Conditions**:
   - Sequential invoice numbers generated inside DB transactions with table locking or atomic timestamp format (`INV-ymd-His-rand`).
3. **Frontend Feedback**:
   - All network failures gracefully surface Sonner toast notifications.
   - Buttons enter disabled loading state during network requests to prevent double-submit.

---

## 7. Verification & Testing Strategy

1. **Database Seeders**:
   - Provide realistic canteen categories ('Makanan', 'Minuman', 'Snack').
   - Provide initial products with realistic prices.
   - Seed past 7 days of realistic transaction history so Dashboard and Report are instantly visually rich and testable.
2. **Browser & Console Verification**:
   - Verify zero console errors in DevTools.
   - Verify POS cart calculation, quick-cash clicks, and change computation.
   - Verify thermal receipt print trigger.
   - Verify Recharts rendering on Dashboard.
   - Verify date filtering on Laporan.
