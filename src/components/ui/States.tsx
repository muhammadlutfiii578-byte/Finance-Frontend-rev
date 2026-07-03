import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle text-ink-muted dark:bg-surface-subtle-dark dark:text-ink-muted-dark">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <div>
        <p className="text-sm font-medium text-ink dark:text-ink-dark">{title}</p>
        {description && (
          <p className="mt-1 max-w-xs text-xs text-ink-muted dark:text-ink-muted-dark">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-expense-soft text-expense dark:bg-expense-soft-dark">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-ink dark:text-ink-dark">Gagal memuat data</p>
        <p className="mt-1 max-w-xs text-xs text-ink-muted dark:text-ink-muted-dark">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}
