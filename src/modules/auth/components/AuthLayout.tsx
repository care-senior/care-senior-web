import { Outlet } from 'react-router';

import { APP_NAME, useDocumentTitle, useRouteHandle } from '@/shared/routing';

import styles from './AuthLayout.module.css';

export function AuthLayout() {
  useDocumentTitle(useRouteHandle()?.title);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.mark} aria-hidden="true">
            🩺
          </div>
          <span className={styles.name}>{APP_NAME}</span>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
