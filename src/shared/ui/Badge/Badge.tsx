import type { ReactNode } from 'react';

import { cx } from '@/shared/lib/cx';

import styles from './Badge.module.css';

export type BadgeTone =
  'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'role';

export interface BadgeProps {
  tone?: BadgeTone;
  /** Ponto colorido antes do texto — status usam, categorias não. */
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({
  tone = 'neutral',
  dot = true,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cx(styles.badge, styles[tone], dot && styles.dot, className)}
    >
      {children}
    </span>
  );
}
