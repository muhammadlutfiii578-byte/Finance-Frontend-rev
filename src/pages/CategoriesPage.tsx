import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, type ColumnDef } from '@/components/ui/Table';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { useCategories, useDeleteCategory } from '@/hooks/useFinanceQueries';
import { getApiErrorMessage } from '@/lib/api-client';
import type { Category } from '@/types';

export function CategoriesPage() {
    const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
    const deleteMutation = useDeleteCategory();

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    function openAddModal() {
        setEditingCategory(null);
        setModalOpen(true);
    }

    function openEditModal(cat: Category) {
        setEditingCategory(cat);
        setModalOpen(true);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        await deleteMutation.mutateAsync(deleteTarget.id);
        setDeleteTarget(null);
    }

    const columns: ColumnDef<Category>[] = [
        {
            key: 'name',
            header: 'Nama',
            render: (c) => <span className="font-medium">{c.name}</span>,
        },
        {
            key: 'type',
            header: 'Tipe',
            render: (c) => (
                <Badge tone={c.type === 'income' ? 'income' : 'expense'}>
                    {c.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            render: (c) => (
                <div className="flex justify-end gap-1.5">
                    <button
                        onClick={() => openEditModal(c)}
                        className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark dark:hover:text-ink-dark"
                        aria-label={`Edit kategori ${c.name}`}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => setDeleteTarget(c)}
                        className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-expense-soft hover:text-expense dark:text-ink-muted-dark dark:hover:bg-expense-soft-dark"
                        aria-label={`Hapus kategori ${c.name}`}
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
                title="Kategori"
                subtitle="Kelola kategori pemasukan dan pengeluaran"
                action={
                    <Button size="sm" onClick={openAddModal}>
                        <Plus className="h-4 w-4" />
                        Tambah
                    </Button>
                }
            />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                <Card>
                    {isError ? (
                        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
                    ) : (
                        <Table
                            columns={columns}
                            data={categories}
                            getRowId={(c) => c.id}
                            isLoading={isLoading}
                            emptyContent={
                                <EmptyState
                                    title="Belum ada kategori"
                                    description="Tambahkan kategori pertama kamu."
                                    action={
                                        <Button size="sm" variant="outline" onClick={openAddModal}>
                                            <Plus className="h-4 w-4" />
                                            Tambah Kategori
                                        </Button>
                                    }
                                />
                            }
                        />
                    )}
                </Card>
            </main>

            <CategoryFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} category={editingCategory} />

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/60" onClick={() => setDeleteTarget(null)} />
                    <div className="relative z-10 w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-soft dark:border-line-dark dark:bg-surface-dark">
                        <h3 className="text-base font-semibold text-ink dark:text-ink-dark">Hapus kategori?</h3>
                        <p className="mt-2 text-sm text-ink-muted dark:text-ink-muted-dark">
                            &quot;{deleteTarget.name}&quot; akan dihapus permanen.
                        </p>
                        <div className="mt-5 flex flex-col-reverse justify-end gap-2 sm:flex-row">
                            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="w-full sm:w-auto">
                                Batal
                            </Button>
                            <Button
                                variant="danger"
                                isLoading={deleteMutation.isPending}
                                onClick={confirmDelete}
                                className="w-full sm:w-auto"
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}