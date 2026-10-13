import type { ComponentProps } from 'react';

import { cx } from '@/shared/lib/cx';

import styles from './IconButton.module.css';

export interface IconButtonProps extends ComponentProps<'button'> {
  /** Obrigatório: o botão só tem ícone, então o nome acessível vem daqui. */
  'aria-label': string;
  /** Mostra o ponto vermelho de "há novidades". */
  indicator?: boolean;
}

export function IconButton({
  indicator = false,
  type = 'button',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button type={type} className={cx(styles.iconButton, className)} {...props}>
      <span aria-hidden="true">{children}</span>
      {indicator && <span className={styles.dot} />}
    </button>
  );
}
