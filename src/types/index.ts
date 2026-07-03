// Core domain types shared across the app

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number; // always positive; sign derived from `type`
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  note?: string;
}

export interface TransactionFilters {
  search?: string;
  type?: TransactionType | 'all';
  categoryId?: string | 'all';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  monthIncomeChangePct: number;
  monthExpenseChangePct: number;
  balanceTrend: { date: string; balance: number }[];
  expenseByCategory: { categoryId: string; categoryName: string; amount: number; color: string }[];
  recentTransactions: Transaction[];
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  color: string;
  limit: number;
  spent: number;
  month: string; // YYYY-MM
}

export interface BudgetComparison {
  categoryId: string;
  categoryName: string;
  currentMonth: number;
  previousMonth: number;
}

export interface BudgetInput {
  categoryId: string;
  limit: number;
  month: string;
}

export interface MonthlyReportRow {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  net: number;
}

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  user: User;
  token: string;
}

export type AuthResponse = ApiResponse<AuthData>;

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
