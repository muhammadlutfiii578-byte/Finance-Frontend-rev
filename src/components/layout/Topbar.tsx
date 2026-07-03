import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function Topbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-canvas/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8 dark:border-line-dark dark:bg-canvas-dark/80">
      <div>
        <h1 className="text-lg font-semibold tracking-tightest text-ink sm:text-xl dark:text-ink-dark">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-ink-muted dark:text-ink-muted-dark sm:text-sm">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <button
          onClick={toggleTheme}
          aria-label="Ganti tema"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink dark:border-line-dark dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark dark:hover:text-ink-dark"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
