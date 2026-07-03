import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/format';
import type { Budget } from '@/types';
import { Badge } from '@/components/ui/Badge';

export function BudgetProgressBar({ budget }: { budget: Budget }) {
  const pct = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 999) : 0;
  const isOver = budget.spent > budget.limit;
  const isNear = !isOver && pct >= 80;

  return (
    <div className="py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: budget.color }} />
          <span className="text-sm font-medium text-ink dark:text-ink-dark">{budget.categoryName}</span>
          {isOver && <Badge tone="expense">Melebihi</Badge>}
          {isNear && <Badge tone="warn">Mendekati</Badge>}
        </div>
        <span className="num-tabular text-xs text-ink-muted dark:text-ink-muted-dark">
          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-subtle dark:bg-surface-subtle-dark">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            isOver ? 'bg-expense' : isNear ? 'bg-warn' : 'bg-brand-500'
          )}
        />
      </div>
    </div>
  );
}
