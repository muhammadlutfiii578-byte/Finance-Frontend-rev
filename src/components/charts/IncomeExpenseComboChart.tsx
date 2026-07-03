import { ComposedChart, Bar, CartesianGrid, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartWrapper, chartTooltipStyle } from './ChartWrapper';
import { formatCompactCurrency, formatCurrency, formatMonthLabel } from '@/lib/format';
import type { MonthlyReportRow } from '@/types';

export function IncomeExpenseComboChart({ data }: { data: MonthlyReportRow[] }) {
  return (
    <ChartWrapper height={320}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#E8E8E6" strokeDasharray="4 4" />
        <XAxis
          dataKey="month"
          tickFormatter={(m: string) => formatMonthLabel(m)}
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
        <Tooltip
          {...chartTooltipStyle}
          formatter={(value: number) => formatCurrency(value)}
          labelFormatter={(m: string) => formatMonthLabel(m)}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
        <Bar dataKey="income" name="Pemasukan" fill="#16A34A" radius={[6, 6, 0, 0]} barSize={22} />
        <Bar dataKey="expense" name="Pengeluaran" fill="#E2462C" radius={[6, 6, 0, 0]} barSize={22} />
        <Line
          type="monotone"
          dataKey="net"
          name="Net"
          stroke="#14151A"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ChartWrapper>
  );
}
