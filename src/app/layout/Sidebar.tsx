import { NavLink } from 'react-router';

import { useCurrentClinic } from '@/modules/clinic';
import { cx } from '@/shared/lib/cx';
import { APP_NAME, paths } from '@/shared/routing';

import { navigation } from './navigation';
import styles from './Sidebar.module.css';

export interface SidebarProps {
  id: string;
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ id, open, onNavigate }: SidebarProps) {
  const { data: clinic } = useCurrentClinic();

  return (
    <aside id={id} className={cx(styles.sidebar, open && styles.open)}>
      <div className={styles.brand}>
        <div className={styles.mark} aria-hidden="true">
          🩺
        </div>
        <div className={styles.brandText}>
          <div className={styles.name}>{clinic?.name ?? APP_NAME}</div>
          <div className={styles.sub}>Painel da clínica</div>
        </div>
      </div>

      <nav aria-label="Menu principal" className={styles.nav}>
        {navigation.map((group) => (
          <div key={group.label} className={styles.group}>
            <div className={styles.groupLabel}>{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === paths.dashboard}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(styles.item, isActive && styles.active)
                }
              >
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
