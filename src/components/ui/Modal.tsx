import { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm dark:bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-t-2xl border border-line bg-surface p-6 shadow-soft scrollbar-thin sm:rounded-2xl dark:border-line-dark dark:bg-surface-dark dark:shadow-soft-dark`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink dark:text-ink-dark">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink dark:text-ink-muted-dark dark:hover:bg-surface-subtle-dark dark:hover:text-ink-dark"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
