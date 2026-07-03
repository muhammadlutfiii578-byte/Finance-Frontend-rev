import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select } from '@/components/ui/Input';
import { categorySchema, type CategoryFormValues } from './category-schema';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useFinanceQueries';
import type { Category } from '@/types';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
    defaultType?: 'income' | 'expense';
    onCreated?: (category: Category) => void;
}

export function CategoryFormModal({
    isOpen,
    onClose,
    category,
    defaultType,
    onCreated,
}: CategoryFormModalProps) {
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const isEditing = Boolean(category);
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            type: defaultType ?? 'expense',
        },
    });

    useEffect(() => {
        if (category) {
            reset({ name: category.name, type: category.type });
        } else {
            reset({ name: '', type: defaultType ?? 'expense' });
        }
    }, [category, defaultType, reset, isOpen]);

    async function onSubmit(values: CategoryFormValues) {
        if (isEditing && category) {
            await updateMutation.mutateAsync({ id: category.id, input: values });
            onClose();
        } else {
            const created = await createMutation.mutateAsync(values);
            onClose();
            onCreated?.(created);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Kategori' : 'Tambah Kategori'}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FieldWrapper label="Nama Kategori" error={errors.name?.message}>
                    <Input placeholder="Contoh: Makan" {...register('name')} />
                </FieldWrapper>

                <FieldWrapper label="Tipe" error={errors.type?.message}>
                    <Select {...register('type')}>
                        <option value="expense">Pengeluaran</option>
                        <option value="income">Pemasukan</option>
                    </Select>
                </FieldWrapper>

                <div className="mt-2 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Kategori'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}