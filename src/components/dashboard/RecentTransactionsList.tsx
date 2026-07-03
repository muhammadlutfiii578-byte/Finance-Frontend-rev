import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/format';
import type { Transaction } from '@/types';
import { EmptyState } from '@/components/ui/States';

export function RecentTransactionsList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <EmptyState title="Belum ada transaksi" description="Transaksi terbaru akan muncul di sini." />;
  }

  return (
    <ul className="flex flex-col">
      {transactions.map((tx) => {
        // Backend menyimpan/mengirim `type` sebagai UPPERCASE ("INCOME" /
        // "EXPENSE"), sementara sisi frontend lain berasumsi lowercase.
        // Normalisasi di sini supaya perbandingan selalu benar.
        const isIncome = tx.type.toLowerCase() === 'income';

        return (
          <li
            key={tx.id}
            className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0 dark:border-line-dark"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  isIncome
                    ? 'bg-income-soft text-income dark:bg-income-soft-dark'
                    : 'bg-expense-soft text-expense dark:bg-expense-soft-dark'
                )}
              >
                {isIncome ? (
                  <ArrowDownLeft className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink dark:text-ink-dark">{tx.description}</p>
                <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
                  {tx.categoryName} · {formatDate(tx.date)}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 num-tabular text-sm font-semibold',
                isIncome ? 'text-income' : 'text-expense'
              )}
            >
              {isIncome ? '+' : '-'}
              {formatCurrency(tx.amount)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}