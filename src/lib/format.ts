export function formatCurrency(amount: number, currency = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });
  return `Rp${formatter.format(amount)}`;
}

export function formatDate(dateString: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(new Date(dateString));
}

export function formatMonthLabel(monthString: string): string {
  // monthString format: YYYY-MM
  const [year, month] = monthString.split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, 1)
  );
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function toCsv<T extends Record<string, unknown>>(rows: T[], headers?: string[]): string {
  if (rows.length === 0) return '';
  const keys = headers ?? Object.keys(rows[0]);
  const escape = (val: unknown) => {
    const str = String(val ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [keys.join(',')];
  for (const row of rows) {
    lines.push(keys.map((k) => escape(row[k])).join(','));
  }
  return lines.join('\n');
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
