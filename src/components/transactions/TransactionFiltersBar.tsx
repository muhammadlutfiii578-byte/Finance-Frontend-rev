import { Search } from 'lucide-react';
import { Input, Select } from '@/components/ui/Input';
import { useCategories } from '@/hooks/useFinanceQueries';
import type { TransactionFilters } from '@/types';

interface TransactionFiltersBarProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export function TransactionFiltersBar({ filters, onChange }: TransactionFiltersBarProps) {
  const { data: categories = [] } = useCategories();

  function update(partial: Partial<TransactionFilters>) {
    onChange({ ...filters, ...partial, page: 1 });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
        <Input
          placeholder="Cari transaksi..."
          className="pl-9"
          value={filters.search ?? ''}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      <Select
        value={filters.type ?? 'all'}
        onChange={(e) => update({ type: e.target.value as TransactionFilters['type'] })}
        className="sm:w-40"
      >
        <option value="all">Semua tipe</option>
        <option value="income">Pemasukan</option>
        <option value="expense">Pengeluaran</option>
      </Select>
      <Select
        value={filters.categoryId ?? 'all'}
        onChange={(e) => update({ categoryId: e.target.value })}
        className="sm:w-48"
      >
        <option value="all">Semua kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input
        type="date"
        value={filters.dateFrom ?? ''}
        onChange={(e) => update({ dateFrom: e.target.value })}
        className="sm:w-40"
      />
      <Input
        type="date"
        value={filters.dateTo ?? ''}
        onChange={(e) => update({ dateTo: e.target.value })}
        className="sm:w-40"
      />
    </div>
  );
}
