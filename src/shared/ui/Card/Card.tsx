import type { ComponentProps, ReactNode } from 'react';

import { cx } from '@/shared/lib/cx';

import styles from './Card.module.css';

export interface CardProps extends ComponentProps<'section'> {
  padded?: boolean;
}

export function Card({ padded = true, className, ...props }: CardProps) {
  return (
    <section
      className={cx(styles.card, padded && styles.padded, className)}
      {...props}
    />
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  /** Texto auxiliar à direita ("6 atividades", "últimos 7 dias"). */
  hint?: ReactNode;
  actions?: ReactNode;
}

export function CardHeader({ title, hint, actions }: CardHeaderProps) {
  return (
    <header className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {hint && <span className={styles.hint}>{hint}</span>}
      {actions}
    </header>
  );
}
