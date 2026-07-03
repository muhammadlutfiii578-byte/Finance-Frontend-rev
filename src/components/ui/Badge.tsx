import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/format';
import { Button } from './Button';

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'income' | 'expense' | 'neutral' | 'warn';
}) {
  const toneClasses = {
    income: 'bg-income-soft text-income dark:bg-income-soft-dark',
    expense: 'bg-expense-soft text-expense dark:bg-expense-soft-dark',
    neutral: 'bg-surface-subtle text-ink-muted dark:bg-surface-subtle-dark dark:text-ink-muted-dark',
    warn: 'bg-warn-soft text-warn',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-line px-1 pt-4 dark:border-line-dark">
      <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
        Halaman {page} dari {Math.max(totalPages, 1)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Berikutnya
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
