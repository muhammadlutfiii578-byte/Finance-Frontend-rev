import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input } from '@/components/ui/Input';
import { registerSchema, type RegisterFormValues } from '@/components/auth/auth-schema';
import { useAuth } from '@/context/AuthContext';
import { getApiErrorMessage } from '@/lib/api-client';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);
    try {
      await registerUser(values);
      navigate('/');
    } catch (err) {
      setFormError(getApiErrorMessage(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 dark:bg-canvas-dark">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white dark:bg-ink-dark dark:text-ink">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tightest text-ink dark:text-ink-dark">
              Buat akun Ledger
            </h1>
            <p className="mt-1 text-sm text-ink-muted dark:text-ink-muted-dark">
              Mulai lacak keuangan Anda dalam hitungan menit.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-soft dark:border-line-dark dark:bg-surface-dark dark:shadow-soft-dark">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl bg-expense-soft px-3 py-2.5 text-xs text-expense dark:bg-expense-soft-dark">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {formError}
            </div>
          )}
          <FieldWrapper label="Nama Lengkap" error={errors.name?.message}>
            <Input placeholder="Nama Anda" {...register('name')} />
          </FieldWrapper>
          <FieldWrapper label="Email" error={errors.email?.message}>
            <Input type="email" placeholder="nama@email.com" {...register('email')} />
          </FieldWrapper>
          <FieldWrapper label="Kata Sandi" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register('password')} />
          </FieldWrapper>
          <FieldWrapper label="Konfirmasi Kata Sandi" error={errors.confirmPassword?.message}>
            <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
          </FieldWrapper>
          <Button type="submit" className="mt-1 w-full" isLoading={isSubmitting}>
            Daftar
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted dark:text-ink-muted-dark">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-medium text-ink hover:underline dark:text-ink-dark">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
