import { useEffect, useId, useState } from 'react';
import { Outlet, useMatches } from 'react-router';

import { isRouteHandle } from '@/shared/routing';

import styles from './AppShell.module.css';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const APP_NAME = 'Care Senior';

/** Layout das telas autenticadas: menu lateral + topbar + conteúdo. */
export function AppShell() {
  const sidebarId = useId();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handle = useMatches()
    .map((match) => match.handle)
    .findLast(isRouteHandle);
  const title = handle?.title ?? APP_NAME;

  useEffect(() => {
    document.title = handle ? `${handle.title} · ${APP_NAME}` : APP_NAME;
  }, [handle]);

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
