import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink text-white hover:bg-ink/90 dark:bg-ink-dark dark:text-ink dark:hover:bg-ink-dark/90',
  secondary:
    'bg-surface-subtle text-ink hover:bg-line dark:bg-surface-subtle-dark dark:text-ink-dark dark:hover:bg-line-dark',
  outline:
    'border border-line bg-transparent text-ink hover:bg-surface-subtle dark:border-line-dark dark:text-ink-dark dark:hover:bg-surface-subtle-dark',
  ghost: 'bg-transparent text-ink hover:bg-surface-subtle dark:text-ink-dark dark:hover:bg-surface-subtle-dark',
  danger: 'bg-expense text-white hover:bg-expense/90',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
