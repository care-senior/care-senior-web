import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { cx } from '@/shared/lib/cx';

import { ToastContext, type ToastApi, type ToastTone } from './toast-context';
import styles from './Toast.module.css';

const TOAST_DURATION_MS = 3200;

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, tone: ToastTone = 'default') => {
    const id = nextId++;
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'danger'),
    }),
    [show],
  );

  return (
    <ToastContext value={api}>
      {children}
      <div className={styles.stack} role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={cx(styles.toast, styles[toast.tone])}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext>
  );
}
