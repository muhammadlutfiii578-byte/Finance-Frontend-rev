import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency, formatPercent } from '@/lib/format';

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  changePct?: number;
  tone?: 'neutral' | 'income' | 'expense';
}

export function StatCard({ label, value, icon, changePct, tone = 'neutral' } : StatCardProps) {
  const toneIconBg = {
    neutral: 'bg-surface-subtle text-ink dark:bg-surface-subtle-dark dark:text-ink-dark',
    income: 'bg-income-soft text-income dark:bg-income-soft-dark',
    expense: 'bg-expense-soft text-expense dark:bg-expense-soft-dark',
  }[tone];

  const isPositiveGood = tone !== 'expense';
  const changeIsGood = changePct !== undefined ? (changePct >= 0) === isPositiveGood : undefined;

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">{label}</p>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', toneIconBg)}>
          {icon}
        </div>
      </div>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="num-tabular mt-3 text-2xl font-semibold tracking-tightest text-ink sm:text-3xl dark:text-ink-dark"
      >
        {formatCurrency(value)}
      </motion.p>
      {changePct !== undefined && (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-xs font-medium',
            changeIsGood ? 'text-income' : 'text-expense'
          )}
        >
          {changePct >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{formatPercent(changePct)}</span>
          <span className="font-normal text-ink-muted dark:text-ink-muted-dark">vs bulan lalu</span>
        </div>
      )}
    </Card>
  );
}
