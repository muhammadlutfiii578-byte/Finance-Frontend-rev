import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/format';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, className, padded = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-soft dark:border-line-dark dark:bg-surface-dark dark:shadow-soft-dark',
        padded ? 'p-5 sm:p-6' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-ink dark:text-ink-dark">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-ink-muted dark:text-ink-muted-dark">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
