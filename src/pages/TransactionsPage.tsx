import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Pagination } from '@/components/ui/Badge';
import { Table, type ColumnDef } from '@/components/ui/Table';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { TransactionFiltersBar } from '@/components/transactions/TransactionFiltersBar';
import { TransactionFormModal } from '@/components/transactions/TransactionFormModal';
import { useTransactions, useDeleteTransaction } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/lib/format';
import { getApiErrorMessage } from '@/lib/api-client';
import type { Transaction, TransactionFilters } from '@/types';

const DEFAULT_FILTERS: TransactionFilters = {
  type: 'all',
  categoryId: 'all',
  page: 1,
  pageSize: 10,
};

export function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const { data, isLoading, isError, error, refetch } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();
  const hasRows = (data?.data.length ?? 0) > 0;

  function openAddModal() {
    setEditingTx(null);
    setModalOpen(true);
  }

  function openEditModal(tx: Transaction) {
    setEditingTx(tx);
    setModalOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  // FIX: any filter change other than an explicit page change must reset page to 1.
  // Without this, changing type/category/search/date while on page 3+ can request
  // a page that no longer exists for the new result set, silently rendering an
  // empty table even though matching transactions exist.
  function handleFiltersChange(next: TransactionFilters) {
    const pageChangedOnly =
      next.page !== filters.page &&
      next.type === filters.type &&
      next.categoryId === filters.categoryId &&
      next.search === filters.search &&
      next.dateFrom === filters.dateFrom &&
      next.dateTo === filters.dateTo;

    setFilters(pageChangedOnly ? next : { ...next, page: 1 });
  }

  const columns: ColumnDef<Transaction>[] = [
    {
      key: 'date',
      header: 'Tanggal',
      render: (tx) => (
        <span className="whitespace-nowrap text-ink-muted dark:text-ink-muted-dark">{formatDate(tx.date)}</span>
      ),
    },
    {
      key: 'description',
      header: 'Deskripsi',
      render: (tx) => (
        <div className="min-w-[10rem]">
          <p className="font-medium">{tx.description}</p>
          {tx.note && <p className="text-xs text-ink-muted dark:text-ink-muted-dark">{tx.note}</p>}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      render: (tx) => (
        <span className="inline-block whitespace-nowrap">
          <Badge tone="neutral">{tx.categoryName}</Badge>
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipe',
      // NOTE: backend currently stores/returns `type` as UPPERCASE
      // ("INCOME" / "EXPENSE"), while the rest of the frontend assumes
      // lowercase ('income' / 'expense'). Normalizing here with
      // toLowerCase() so this comparison works regardless of casing.
      render: (tx) => {
        const isIncome = tx.type.toLowerCase() === 'income';
        return (
          <span className="inline-block whitespace-nowrap">
            <Badge tone={isIncome ? 'income' : 'expense'}>
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </Badge>
          </span>
        );
      },
    },
    {
      key: 'amount',
      header: 'Jumlah',
      align: 'right',
      render: (tx) => {
        const isIncome = tx.type.toLowerCase() === 'income';
        return (
          <span
            className={`num-tabular whitespace-nowrap font-semibold ${isIncome ? 'text-income' : 'text-expense'
              }`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(tx.amount)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (tx) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => openEditModal(tx)}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark dark:hover:text-ink-dark"
            aria-label={`Edit transaksi ${tx.description}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(tx)}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-expense-soft hover:text-expense dark:text-ink-muted-dark dark:hover:bg-expense-soft-dark"
            aria-label={`Hapus transaksi ${tx.description}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Topbar
        title="Transaksi"
        subtitle="Kelola semua catatan pemasukan dan pengeluaran"
        action={
          <Button size="sm" onClick={openAddModal}>
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Card>
          <div className="mb-5">
            <TransactionFiltersBar filters={filters} onChange={handleFiltersChange} />
          </div>

          {isError ? (
            <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
          ) : (
            <>
              {/* Horizontal scroll guard: only forces a min-width when there are
                  actual rows to lay out. If we forced min-w-[640px] unconditionally,
                  the EmptyState/loading skeleton (which are centered, not tabular)
                  would get dragged to 640px wide too and clip off-screen on mobile
                  when there's no data — that was the earlier bug. */}
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className={hasRows ? 'min-w-[640px] sm:min-w-0' : ''}>
                  <Table
                    columns={columns}
                    data={data?.data ?? []}
                    getRowId={(tx) => tx.id}
                    isLoading={isLoading}
                    emptyContent={
                      <EmptyState
                        title="Tidak ada transaksi"
                        description="Coba ubah filter atau tambahkan transaksi baru."
                        action={
                          <Button size="sm" variant="outline" onClick={openAddModal}>
                            <Plus className="h-4 w-4" />
                            Tambah Transaksi
                          </Button>
                        }
                      />
                    }
                  />
                </div>
              </div>
              {data && data.totalPages > 1 && (
                <div className="mt-4 flex justify-center sm:justify-end">
                  <Pagination
                    page={data.page}
                    totalPages={data.totalPages}
                    onPageChange={(page) => handleFiltersChange({ ...filters, page })}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </main>

      <TransactionFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} transaction={editingTx} />

      {deleteTarget && (
        <ConfirmDeleteDialog
          transaction={deleteTarget}
          isLoading={deleteMutation.isPending}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

function ConfirmDeleteDialog({
  transaction,
  isLoading,
  onCancel,
  onConfirm,
}: {
  transaction: Transaction;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-soft dark:border-line-dark dark:bg-surface-dark">
        <h3 id="confirm-delete-title" className="text-base font-semibold text-ink dark:text-ink-dark">
          Hapus transaksi?
        </h3>
        <p className="mt-2 break-words text-sm text-ink-muted dark:text-ink-muted-dark">
          &quot;{transaction.description}&quot; akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button variant="danger" isLoading={isLoading} onClick={onConfirm} className="w-full sm:w-auto">
            Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}