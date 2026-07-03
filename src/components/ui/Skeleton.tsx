import type { CSSProperties } from 'react';
import { cn } from '@/lib/format';

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-surface-subtle dark:bg-surface-subtle-dark',
        className
      )}
      style={style}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft dark:border-line-dark dark:bg-surface-dark">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="mb-2 h-8 w-40" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1"
          style={{ height: `${30 + ((i * 37) % 70)}%` } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
