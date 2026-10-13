import type { ReactNode } from 'react';

import { Card } from '../Card/Card';

import styles from './StatTile.module.css';

export type StatTrend = 'up' | 'down' | 'flat';

export interface StatTileProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  /** Linha de variação abaixo do valor ("▲ 2 este mês"). */
  delta?: { trend: StatTrend; text: string };
}

export function StatTile({ label, value, icon, delta }: StatTileProps) {
  return (
    <Card padded={false} className={styles.tile}>
      <div className={styles.label}>
        <span>{label}</span>
        {icon && <span aria-hidden="true">{icon}</span>}
      </div>
      <div className={`${styles.value} tabular`}>{value}</div>
      {delta && (
        <div className={`${styles.delta} ${styles[delta.trend]}`}>
          {delta.text}
        </div>
      )}
    </Card>
  );
}
