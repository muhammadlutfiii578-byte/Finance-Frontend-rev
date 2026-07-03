import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartWrapper, chartTooltipStyle } from './ChartWrapper';
import { formatCompactCurrency, formatCurrency } from '@/lib/format';
import type { BudgetComparison } from '@/types';

export function BudgetComparisonChart({ data }: { data: BudgetComparison[] }) {
  return (
    <ChartWrapper>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={6}>
        <CartesianGrid vertical={false} stroke="#E8E8E6" strokeDasharray="4 4" />
        <XAxis
          dataKey="categoryName"
          tick={{ fontSize: 11, fill: '#6B6D76' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          tick={{ fontSize: 11, fill: '#6B6D76' }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip {...chartTooltipStyle} formatter={(value: number) => formatCurrency(value)} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
        <Bar
          dataKey="previousMonth"
          name="Bulan lalu"
          fill="#D9DBE3"
          radius={[6, 6, 0, 0]}
          animationDuration={500}
        />
        <Bar
          dataKey="currentMonth"
          name="Bulan ini"
          fill="#3D6BFF"
          radius={[6, 6, 0, 0]}
          animationDuration={500}
        />
      </BarChart>
    </ChartWrapper>
  );
}
