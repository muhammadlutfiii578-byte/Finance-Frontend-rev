import { apiClient, unwrap } from "@/lib/api-client";
import type {
  ApiResponse,
  AuthData,
  Budget,
  BudgetComparison,
  BudgetInput,
  Category,
  DashboardSummary,
  LoginInput,
  MonthlyReportRow,
  PaginatedResponse,
  RegisterInput,
  ReportFilters,
  Transaction,
  TransactionFilters,
  TransactionInput,
  User,
} from "@/types";

// =======================
// AUTH
// =======================

export const authApi = {
  login: (input: LoginInput) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>("/auth/login", input)),

  register: (input: RegisterInput) =>
    unwrap(apiClient.post<ApiResponse<AuthData>>("/auth/register", input)),

  me: () =>
    unwrap(apiClient.get<ApiResponse<User>>("/auth/me")),
};

// =======================
// DASHBOARD
// =======================

export const dashboardApi = {
  getSummary: () =>
    unwrap(apiClient.get<ApiResponse<DashboardSummary>>("/dashboard/summary")),
};

// =======================
// CATEGORIES
// =======================

export const categoriesApi = {
  list: () =>
    unwrap(apiClient.get<ApiResponse<Category[]>>("/categories")),

  create: (input: { name: string; type: "income" | "expense" }) =>
    unwrap(apiClient.post<ApiResponse<Category>>("/categories", input)),

  update: (id: string, input: Partial<{ name: string; type: "income" | "expense" }>) =>
    unwrap(apiClient.put<ApiResponse<Category>>(`/categories/${id}`, input)),

  remove: (id: string) =>
    unwrap(apiClient.delete<ApiResponse<void>>(`/categories/${id}`)),
};

// =======================
// TRANSACTIONS
// =======================

export const transactionsApi = {
  list: (filters: TransactionFilters) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>("/transactions", {
        params: filters,
      })
    ),

  create: (input: TransactionInput) =>
    unwrap(apiClient.post<ApiResponse<Transaction>>("/transactions", input)),

  update: (id: string, input: Partial<TransactionInput>) =>
    unwrap(apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, input)),

  // Returns void after unwrapping — do not expect a payload from this call.
  remove: (id: string) =>
    unwrap(apiClient.delete<ApiResponse<void>>(`/transactions/${id}`)),
};

// =======================
// BUDGETS
// =======================

export const budgetsApi = {
  list: (month: string) =>
    unwrap(
      apiClient.get<ApiResponse<Budget[]>>("/budgets", {
        params: { month },
      })
    ),

  comparison: (month: string) =>
    unwrap(
      apiClient.get<ApiResponse<BudgetComparison[]>>("/budgets/comparison", {
        params: { month },
      })
    ),

  upsert: (input: BudgetInput) =>
    unwrap(apiClient.post<ApiResponse<Budget>>("/budgets", input)),
};

// =======================
// REPORTS
// =======================

export const reportsApi = {
  monthly: (filters: ReportFilters) =>
    unwrap(
      apiClient.get<ApiResponse<MonthlyReportRow[]>>("/reports/monthly", {
        params: filters,
      })
    ),
};