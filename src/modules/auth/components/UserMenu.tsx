import { useState } from 'react';

import { Avatar, Button } from '@/shared/ui';

import { useCurrentUser } from '../hooks/use-session';
import { session } from '../session/session';
import { staffRoleLabels } from '../utils/staff-role';

import styles from './UserMenu.module.css';

export function UserMenu() {
  const user = useCurrentUser();
  const [signingOut, setSigningOut] = useState(false);

  function signOut() {
    setSigningOut(true);
    void session.signOut();
  }

  return (
    <div className={styles.menu}>
      <Avatar name={user.name} size="sm" />
      <div className={styles.identity}>
        <span className={styles.name}>{user.name}</span>
        {user.staffRole && (
          <span className={styles.role}>{staffRoleLabels[user.staffRole]}</span>
        )}
      </div>
      <Button variant="ghost" size="sm" disabled={signingOut} onClick={signOut}>
        Sair
      </Button>
    </div>
  );
}
