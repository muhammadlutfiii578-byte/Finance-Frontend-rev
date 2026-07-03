import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChartSkeleton, TableRowSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { IncomeExpenseComboChart } from '@/components/charts/IncomeExpenseComboChart';
import { useMonthlyReport } from '@/hooks/useFinanceQueries';
import { getApiErrorMessage } from '@/lib/api-client';
import { downloadCsv, formatCurrency, formatMonthLabel, toCsv } from '@/lib/format';

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 5);
  return {
    dateFrom: from.toISOString().slice(0, 7) + '-01',
    dateTo: to.toISOString().slice(0, 10),
  };
}

export function ReportsPage() {
  const [range, setRange] = useState(defaultRange());
  const { data, isLoading, isError, error, refetch } = useMonthlyReport(range);

  const totals = useMemo(() => {
    if (!data) return { income: 0, expense: 0, net: 0 };
    return data.reduce(
      (acc, row) => ({
        income: acc.income + row.income,
        expense: acc.expense + row.expense,
        net: acc.net + row.net,
      }),
      { income: 0, expense: 0, net: 0 }
    );
  }, [data]);

  function handleExport() {
    if (!data || data.length === 0) return;
    const csvRows = data.map((row) => ({
      Bulan: formatMonthLabel(row.month),
      Pemasukan: row.income,
      Pengeluaran: row.expense,
      Net: row.net,
    }));
    const csv = toCsv(csvRows, ['Bulan', 'Pemasukan', 'Pengeluaran', 'Net']);
    downloadCsv(`laporan-keuangan-${range.dateFrom}-${range.dateTo}.csv`, csv);
  }

  return (
    <>
      <Topbar
        title="Laporan"
        subtitle="Analisis pemasukan dan pengeluaran dari waktu ke waktu"
        action={
          <Button size="sm" variant="outline" onClick={handleExport} disabled={!data || data.length === 0}>
            <Download className="h-4 w-4" />
            Ekspor CSV
          </Button>
        }
      />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <Card>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">Dari tanggal</label>
                <Input
                  type="date"
                  value={range.dateFrom}
                  onChange={(e) => setRange((r) => ({ ...r, dateFrom: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">Sampai tanggal</label>
                <Input
                  type="date"
                  value={range.dateTo}
                  onChange={(e) => setRange((r) => ({ ...r, dateTo: e.target.value }))}
                />
              </div>
            </div>
          </Card>

          {isError ? (
            <Card>
              <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader title="Pemasukan vs Pengeluaran" subtitle="Per bulan" />
                {isLoading ? <ChartSkeleton height={320} /> : data && data.length > 0 ? (
                  <IncomeExpenseComboChart data={data} />
                ) : (
                  <EmptyState title="Tidak ada data" description="Pilih rentang tanggal lain." />
                )}
              </Card>

              <Card>
                <CardHeader title="Ringkasan" subtitle="Detail per bulan" />
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-line dark:border-line-dark">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">Bulan</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">Pemasukan</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">Pengeluaran</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} columns={4} />)
                      ) : data && data.length > 0 ? (
                        data.map((row) => (
                          <tr key={row.month} className="border-b border-line last:border-0 dark:border-line-dark">
                            <td className="px-4 py-3 text-ink dark:text-ink-dark">{formatMonthLabel(row.month)}</td>
                            <td className="px-4 py-3 text-right num-tabular text-income">{formatCurrency(row.income)}</td>
                            <td className="px-4 py-3 text-right num-tabular text-expense">{formatCurrency(row.expense)}</td>
                            <td className="px-4 py-3 text-right num-tabular font-semibold text-ink dark:text-ink-dark">
                              {formatCurrency(row.net)}
                            </td>
                          </tr>
                        ))
                      ) : null}
                    </tbody>
                    {data && data.length > 0 && (
                      <tfoot>
                        <tr className="border-t-2 border-line font-semibold dark:border-line-dark">
                          <td className="px-4 py-3 text-ink dark:text-ink-dark">Total</td>
                          <td className="px-4 py-3 text-right num-tabular text-income">{formatCurrency(totals.income)}</td>
                          <td className="px-4 py-3 text-right num-tabular text-expense">{formatCurrency(totals.expense)}</td>
                          <td className="px-4 py-3 text-right num-tabular text-ink dark:text-ink-dark">
                            {formatCurrency(totals.net)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </main>
    </>
  );
}
