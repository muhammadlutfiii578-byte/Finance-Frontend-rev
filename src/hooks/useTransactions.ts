import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api-services';
import type { TransactionFilters, TransactionInput } from '@/types';

export const transactionKeys = {
  all: ['transactions'] as const,
  list: (filters: TransactionFilters) => [...transactionKeys.all, 'list', filters] as const,
};

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransactionInput) => transactionsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TransactionInput> }) =>
      transactionsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
