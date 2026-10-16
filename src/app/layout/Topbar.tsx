import type { ReactNode } from 'react';

import { IconButton } from '@/shared/ui';

import styles from './Topbar.module.css';

export interface TopbarProps {
  title: string;
  subtitle?: string;
  sidebarId: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  actions?: ReactNode;
}

export function Topbar({
  title,
  subtitle,
  sidebarId,
  sidebarOpen,
  onToggleSidebar,
  actions,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.heading}>
        <IconButton
          className={styles.menuButton}
          aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={sidebarOpen}
          aria-controls={sidebarId}
          onClick={onToggleSidebar}
        >
          ☰
        </IconButton>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
      {actions}
    </header>
  );
}
