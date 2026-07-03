import { useState } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { BudgetProgressBar } from '@/components/budget/BudgetProgressBar';
import { BudgetComparisonChart } from '@/components/charts/BudgetComparisonChart';
import { useBudgets, useBudgetComparison } from '@/hooks/useFinanceQueries';
import { getApiErrorMessage } from '@/lib/api-client';
import { formatMonthLabel } from '@/lib/format';

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function BudgetPage() {
  const [month, setMonth] = useState(currentMonth());

  const budgetsQuery = useBudgets(month);
  const comparisonQuery = useBudgetComparison(month);

  return (
    <>
      <Topbar
        title="Anggaran"
        subtitle={`Pantau batas pengeluaran untuk ${formatMonthLabel(month)}`}
        action={
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-40" />
        }
      />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Realisasi vs Limit" subtitle="Per kategori bulan ini" />
            {budgetsQuery.isError ? (
              <ErrorState message={getApiErrorMessage(budgetsQuery.error)} onRetry={() => budgetsQuery.refetch()} />
            ) : budgetsQuery.isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-xl bg-surface-subtle dark:bg-surface-subtle-dark" />
                ))}
              </div>
            ) : !budgetsQuery.data || budgetsQuery.data.length === 0 ? (
              <EmptyState title="Belum ada anggaran" description="Tetapkan limit pengeluaran per kategori untuk bulan ini." />
            ) : (
              <div className="divide-y divide-line dark:divide-line-dark">
                {budgetsQuery.data.map((b) => (
                  <BudgetProgressBar key={b.id} budget={b} />
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Perbandingan Bulanan" subtitle="Bulan ini vs bulan lalu" />
            {comparisonQuery.isError ? (
              <ErrorState
                message={getApiErrorMessage(comparisonQuery.error)}
                onRetry={() => comparisonQuery.refetch()}
              />
            ) : comparisonQuery.isLoading ? (
              <ChartSkeleton />
            ) : !comparisonQuery.data || comparisonQuery.data.length === 0 ? (
              <EmptyState title="Belum ada data perbandingan" />
            ) : (
              <BudgetComparisonChart data={comparisonQuery.data} />
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
