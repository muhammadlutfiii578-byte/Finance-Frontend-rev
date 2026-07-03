import { z } from 'zod';

export const transactionSchema = z.object({
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().min(2, 'Deskripsi minimal 2 karakter').max(120, 'Deskripsi terlalu panjang'),
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  type: z.enum(['income', 'expense'], { errorMap: () => ({ message: 'Pilih tipe transaksi' }) }),
  categoryId: z.string().min(1, 'Pilih kategori'),
  note: z.string().max(280, 'Catatan terlalu panjang').optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
