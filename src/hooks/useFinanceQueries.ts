import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, categoriesApi, budgetsApi, reportsApi } from '@/lib/api-services';
import type { BudgetInput, ReportFilters } from '@/types';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardApi.getSummary,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.list,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; type: 'income' | 'expense' }) =>
      categoriesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<{ name: string; type: 'income' | 'expense' }>;
    }) => categoriesApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useBudgets(month: string) {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn: () => budgetsApi.list(month),
  });
}

export function useBudgetComparison(month: string) {
  return useQuery({
    queryKey: ['budgets', 'comparison', month],
    queryFn: () => budgetsApi.comparison(month),
  });
}

export function useUpsertBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BudgetInput) => budgetsApi.upsert(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useMonthlyReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ['reports', 'monthly', filters],
    queryFn: () => reportsApi.monthly(filters),
    enabled: Boolean(filters.dateFrom && filters.dateTo),
  });
}