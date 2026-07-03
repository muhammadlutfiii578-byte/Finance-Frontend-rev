import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartWrapper, chartTooltipStyle } from './ChartWrapper';
import { formatCompactCurrency, formatDate } from '@/lib/format';

interface BalanceTrendChartProps {
  data: { date: string; balance: number }[];
}

export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
  return (
    <ChartWrapper>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D6BFF" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#3D6BFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#E8E8E6" strokeDasharray="4 4" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => formatDate(d, { day: 'numeric', month: 'short', year: undefined })}
          tick={{ fontSize: 11, fill: '#6B6D76' }}
          axisLine={false}
          tickLine={false}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          tick={{ fontSize: 11, fill: '#6B6D76' }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip
          {...chartTooltipStyle}
          formatter={(value: number) => [formatCompactCurrency(value), 'Saldo']}
          labelFormatter={(d: string) => formatDate(d)}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#3D6BFF"
          strokeWidth={2}
          fill="url(#balanceFill)"
          animationDuration={500}
        />
      </AreaChart>
    </ChartWrapper>
  );
}
