import { cx } from '@/shared/lib/cx';

import styles from './SessionSplash.module.css';

export function SessionSplash({
  fullScreen = false,
}: {
  fullScreen?: boolean;
}) {
  return (
    <div
      role="status"
      className={cx(styles.splash, fullScreen && styles.fullScreen)}
    >
      <span className={styles.spinner} aria-hidden="true" />
      Carregando…
    </div>
  );
}
