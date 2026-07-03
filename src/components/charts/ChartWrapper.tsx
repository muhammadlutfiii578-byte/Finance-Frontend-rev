import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';

interface ChartWrapperProps {
  children: ReactNode;
  height?: number;
}

/**
 * Wraps any Recharts chart with a ResponsiveContainer and a subtle fade-in
 * animation so re-renders (e.g. on filter change) feel smooth rather than jumpy.
 */
export function ChartWrapper({ children, height = 280 }: ChartWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ width: '100%', height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </motion.div>
  );
}

export const chartTooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: '1px solid #E8E8E6',
    fontSize: 12,
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 8px 24px -12px rgba(20,21,26,0.18)',
  },
  labelStyle: { color: '#6B6D76', marginBottom: 4, fontWeight: 500 },
};
