import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
