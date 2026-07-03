import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import { ChartWrapper, chartTooltipStyle } from './ChartWrapper';
import { formatCurrency } from '@/lib/format';

interface ExpenseDonutChartProps {
  data: { categoryId: string; categoryName: string; amount: number; color: string }[];
}

export function ExpenseDonutChart({ data }: ExpenseDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full max-w-[220px]">
        <ChartWrapper height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="categoryName"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              cornerRadius={6}
              animationDuration={500}
            >
              {data.map((entry) => (
                <Cell key={entry.categoryId} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip {...chartTooltipStyle} formatter={(value: number) => formatCurrency(value)} />
          </PieChart>
        </ChartWrapper>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wide text-ink-muted dark:text-ink-muted-dark">
            Total
          </span>
          <span className="text-sm font-semibold text-ink dark:text-ink-dark">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-2.5">
        {data.map((entry) => (
          <li key={entry.categoryId} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 truncate">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="truncate text-ink dark:text-ink-dark">{entry.categoryName}</span>
            </div>
            <span className="shrink-0 num-tabular text-ink-muted dark:text-ink-muted-dark">
              {formatCurrency(entry.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
