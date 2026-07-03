# Ledger — Finance Tracker (Frontend)

Frontend React + TypeScript untuk aplikasi finance tracker bergaya fintech modern (Mercury/Linear/Wise-inspired). Proyek ini adalah **frontend murni** — backend Express disambungkan lewat REST API yang base URL-nya diatur via environment variable.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (custom design tokens: warna netral + aksen income/expense)
- React Router v6
- TanStack Query (React Query) untuk data fetching & caching
- React Hook Form + Zod untuk validasi form
- Recharts untuk semua visualisasi (area, donut, bar, combo chart)
- Framer Motion untuk micro-interaction halus
- Lucide React untuk ikon

## Menjalankan proyek

```bash
npm install
cp .env.example .env   # sesuaikan VITE_API_BASE_URL dengan backend Anda
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Struktur folder

```
src/
  components/
    ui/          # Button, Card, Input, Modal, Table, Badge, Skeleton, States (komponen reusable)
    layout/      # Sidebar, BottomNav, Topbar, AppLayout, ProtectedRoute
    charts/      # ChartWrapper + chart spesifik (BalanceTrend, ExpenseDonut, BudgetComparison, IncomeExpenseCombo)
    dashboard/   # StatCard, RecentTransactionsList
    transactions/# TransactionFormModal, TransactionFiltersBar, schema Zod
    budget/      # BudgetProgressBar
    auth/        # schema Zod untuk login/register
  pages/         # DashboardPage, TransactionsPage, BudgetPage, ReportsPage, LoginPage, RegisterPage
  hooks/         # useTransactions, useFinanceQueries (React Query hooks)
  context/       # AuthContext (JWT + user), ThemeContext (dark mode)
  lib/           # api-client (axios instance), api-services (endpoint per resource), format.ts
  types/         # seluruh interface TypeScript domain & API
```

Semua props komponen dan response API memiliki interface TypeScript di `src/types/index.ts` — tidak ada `any` yang disengaja.

## Kontrak API yang diharapkan backend Express

Base URL diambil dari `VITE_API_BASE_URL` (default `http://localhost:4000/api`). Token JWT disimpan di `localStorage` (`ledger_token`) dan otomatis dikirim sebagai header `Authorization: Bearer <token>`. Respons 401 akan otomatis redirect ke `/login`.

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` → `{ user, token }` |
| POST | `/auth/register` | `{ name, email, password, confirmPassword }` → `{ user, token }` |
| GET | `/auth/me` | → `User` (validasi token) |
| GET | `/dashboard/summary` | → `DashboardSummary` (saldo, income/expense bulan ini, trend 30 hari, breakdown kategori, 5 transaksi terbaru) |
| GET | `/categories` | → `Category[]` |
| GET | `/transactions` | query: `search, type, categoryId, dateFrom, dateTo, page, pageSize` → `PaginatedResponse<Transaction>` |
| POST | `/transactions` | body `TransactionInput` → `Transaction` |
| PUT | `/transactions/:id` | body `Partial<TransactionInput>` → `Transaction` |
| DELETE | `/transactions/:id` | → `204` |
| GET | `/budgets?month=YYYY-MM` | → `Budget[]` |
| GET | `/budgets/comparison?month=YYYY-MM` | → `BudgetComparison[]` (bulan ini vs bulan lalu per kategori) |
| POST | `/budgets` | body `BudgetInput` (upsert limit per kategori per bulan) → `Budget` |
| GET | `/reports/monthly?dateFrom&dateTo` | → `MonthlyReportRow[]` (income, expense, net per bulan) |

Lihat `src/types/index.ts` untuk bentuk persis tiap interface.

## Catatan desain

- Palet netral (putih/abu gelap) dengan aksen hijau (`income`) dan merah-oranye (`expense`), didefinisikan sebagai design token di `tailwind.config.js`.
- Tipografi: Inter untuk UI, JetBrains Mono tersedia untuk angka jika dibutuhkan; ukuran saldo besar (`text-2xl`/`text-3xl`) vs label kecil (`text-xs`) untuk hierarki yang jelas.
- Dark mode lewat class `dark` di `<html>`, dikontrol oleh `ThemeContext` dan toggle di Topbar.
- Sidebar collapsible di desktop (≥1024px), bottom navigation di mobile.
- Loading state memakai skeleton (bukan spinner) di setiap halaman; error state punya pesan + tombol "Coba lagi".
- Komponen chart dibungkus `ChartWrapper` agar transisi data terasa halus (fade-in saat filter berubah) tanpa animasi berlebihan.

## Pengembangan lanjutan

Proyek ini siap dikembangkan: tambahkan resource baru dengan pola yang sama (service di `lib/api-services.ts` → hook React Query di `hooks/` → komponen di `components/<domain>/` → halaman di `pages/`).
