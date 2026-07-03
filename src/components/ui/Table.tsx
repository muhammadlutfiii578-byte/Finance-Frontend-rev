import type { ReactNode } from 'react';
import { cn } from '@/lib/format';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyContent?: ReactNode;
}

export function Table<T>({ columns, data, getRowId, isLoading, skeletonRows = 6, emptyContent }: TableProps<T>) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line dark:border-line-dark">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                  col.align === undefined || col.align === 'left' ? 'text-left' : ''
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={i} className="border-b border-line dark:border-line-dark">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-surface-subtle dark:bg-surface-subtle-dark" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="border-b border-line transition-colors last:border-0 hover:bg-surface-subtle/60 dark:border-line-dark dark:hover:bg-surface-subtle-dark/60"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'px-4 py-3 align-middle text-ink dark:text-ink-dark',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        col.className
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
      {!isLoading && data.length === 0 && emptyContent}
    </div>
  );
}
