import { cx } from '@/shared/lib/cx';
import { getInitials } from '@/shared/lib/initials';

import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span className={cx(styles.avatar, styles[size], className)} title={name}>
      <span aria-hidden="true">{getInitials(name)}</span>
      <span className="visually-hidden">{name}</span>
    </span>
  );
}
