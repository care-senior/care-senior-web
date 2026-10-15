import { useId, useState } from 'react';
import { Outlet } from 'react-router';

import { APP_NAME, useDocumentTitle, useRouteHandle } from '@/shared/routing';

import styles from './AppShell.module.css';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/** Layout das telas autenticadas: menu lateral + topbar + conteúdo. */
export function AppShell() {
  const sidebarId = useId();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handle = useRouteHandle();
  const title = handle?.title ?? APP_NAME;
  useDocumentTitle(handle?.title);

  return (
    <div className={styles.shell}>
      <Sidebar
        id={sidebarId}
        open={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div
          className={styles.scrim}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={styles.main}>
        <Topbar
          title={title}
          subtitle={handle?.subtitle}
          sidebarId={sidebarId}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
