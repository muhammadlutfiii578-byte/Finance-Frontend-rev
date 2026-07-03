import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select } from '@/components/ui/Input';
import { transactionSchema, type TransactionFormValues } from './transaction-schema';
import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { useCategories } from '@/hooks/useFinanceQueries';
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import type { Transaction } from '@/types';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function TransactionFormModal({ isOpen, onClose, transaction }: TransactionFormModalProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isEditing = Boolean(transaction);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      amount: 0,
      type: 'expense',
      categoryId: '',
      note: '',
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (transaction) {
      reset({
        date: transaction.date.slice(0, 10),
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId,
        note: transaction.note ?? '',
      });
    } else {
      reset({
        date: new Date().toISOString().slice(0, 10),
        description: '',
        amount: 0,
        type: 'expense',
        categoryId: '',
        note: '',
      });
    }
  }, [transaction, reset, isOpen]);

  const filteredCategories = categories.filter((c) => c.type === selectedType);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: TransactionFormValues) {
    if (isEditing && transaction) {
      await updateMutation.mutateAsync({ id: transaction.id, input: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Transaksi' : 'Tambah Transaksi'}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-subtle p-1 dark:bg-surface-subtle-dark">
            {(['expense', 'income'] as const).map((t) => (
              <label key={t} className="relative">
                <input type="radio" value={t} {...register('type')} className="peer sr-only" />
                <div className="cursor-pointer rounded-lg py-2 text-center text-sm font-medium text-ink-muted transition-colors peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-soft dark:text-ink-muted-dark dark:peer-checked:bg-surface-dark dark:peer-checked:text-ink-dark">
                  {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                </div>
              </label>
            ))}
          </div>

          <FieldWrapper label="Deskripsi" error={errors.description?.message}>
            <Input placeholder="Contoh: Makan siang" {...register('description')} />
          </FieldWrapper>

          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Jumlah (Rp)" error={errors.amount?.message}>
              <Input type="number" step="1" min="0" placeholder="0" {...register('amount')} />
            </FieldWrapper>
            <FieldWrapper label="Tanggal" error={errors.date?.message}>
              <Input type="date" {...register('date')} />
            </FieldWrapper>
          </div>

          <FieldWrapper label="Kategori" error={errors.categoryId?.message}>
            <div className="flex gap-2">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="">Pilih kategori</option>
                      {filteredCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(true)}>
                + Kategori
              </Button>
            </div>
          </FieldWrapper>

          <FieldWrapper label="Catatan (opsional)" error={errors.note?.message}>
            <Input placeholder="Tambahkan catatan" {...register('note')} />
          </FieldWrapper>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Simpan Perubahan' : 'Tambah Transaksi'}
            </Button>
          </div>
        </form>
      </Modal>

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        defaultType={selectedType}
        onCreated={(created) => setValue('categoryId', created.id)}
      />
    </>
  );
}