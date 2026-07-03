import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader } from '@/components/ui/Card';
import { CardSkeleton, ChartSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList';
import { BalanceTrendChart } from '@/components/charts/BalanceTrendChart';
import { ExpenseDonutChart } from '@/components/charts/ExpenseDonutChart';
import { useDashboardSummary } from '@/hooks/useFinanceQueries';
import { getApiErrorMessage } from '@/lib/api-client';

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboardSummary();

  return (
    <>
      <Topbar title="Dashboard" subtitle="Ringkasan keuangan Anda hari ini" />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {isError ? (
          <Card>
            <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {isLoading || !data ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                <>
                  <StatCard label="Total Saldo" value={data.totalBalance} icon={<Wallet className="h-4 w-4" />} />
                  <StatCard
                    label="Pemasukan Bulan Ini"
                    value={data.monthIncome}
                    icon={<TrendingUp className="h-4 w-4" />}
                    changePct={data.monthIncomeChangePct}
                    tone="income"
                  />
                  <StatCard
                    label="Pengeluaran Bulan Ini"
                    value={data.monthExpense}
                    icon={<TrendingDown className="h-4 w-4" />}
                    changePct={data.monthExpenseChangePct}
                    tone="expense"
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader title="Tren Saldo" subtitle="30 hari terakhir" />
                {isLoading || !data ? <ChartSkeleton /> : <BalanceTrendChart data={data.balanceTrend} />}
              </Card>
              <Card>
                <CardHeader title="Pengeluaran per Kategori" subtitle="Bulan ini" />
                {isLoading || !data ? (
                  <ChartSkeleton height={220} />
                ) : data.expenseByCategory.length === 0 ? (
                  <p className="py-10 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
                    Belum ada pengeluaran bulan ini.
                  </p>
                ) : (
                  <ExpenseDonutChart data={data.expenseByCategory} />
                )}
              </Card>
            </div>

            <Card>
              <CardHeader title="Transaksi Terbaru" subtitle="5 transaksi terakhir" />
              {isLoading || !data ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-xl bg-surface-subtle dark:bg-surface-subtle-dark" />
                  ))}
                </div>
              ) : (
                <RecentTransactionsList transactions={data.recentTransactions} />
              )}
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
