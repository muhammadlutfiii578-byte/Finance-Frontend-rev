import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/format';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function FieldWrapper({ label, error, children, htmlFor }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-xs font-medium text-ink-muted dark:text-ink-muted-dark">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-expense">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand-500 dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark',
      error && 'border-expense',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink transition-colors focus:border-brand-500 dark:border-line-dark dark:bg-surface-dark dark:text-ink-dark',
      error && 'border-expense',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';
