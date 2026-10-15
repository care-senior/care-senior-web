import { useEffect, useState } from 'react';

import { Button, Modal } from '@/shared/ui';

import {
  INACTIVITY_WARNING_MS,
  markActivity,
  msUntilInactive,
} from '../session/inactivity';
import { session } from '../session/session';

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
const ACTIVITY_SAVE_INTERVAL_MS = 5_000;
const CHECK_INTERVAL_MS = 1_000;

export function InactivityWarning() {
  const [secondsLeft, setSecondsLeft] = useState<number>();

  useEffect(() => {
    let lastSavedAt = 0;

    function registerActivity() {
      const now = Date.now();
      if (now - lastSavedAt < ACTIVITY_SAVE_INTERVAL_MS) return;
      lastSavedAt = now;
      markActivity(now);
    }

    function checkInactivity() {
      const remaining = msUntilInactive();
      if (remaining <= 0) {
        void session.signOut('inactivity');
        return;
      }
      setSecondsLeft(
        remaining <= INACTIVITY_WARNING_MS
          ? Math.ceil(remaining / 1000)
          : undefined,
      );
    }

    ACTIVITY_EVENTS.forEach((type) => {
      window.addEventListener(type, registerActivity, { passive: true });
    });
    const interval = window.setInterval(checkInactivity, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      ACTIVITY_EVENTS.forEach((type) => {
        window.removeEventListener(type, registerActivity);
      });
    };
  }, []);

  function stayConnected() {
    markActivity();
    setSecondsLeft(undefined);
  }

  return (
    <Modal
      open={secondsLeft !== undefined}
      onClose={stayConnected}
      size="sm"
      title="Você ainda está aí?"
      description={`Por segurança, sua sessão será encerrada em ${secondsLeft ?? 0} segundos sem uso.`}
      footer={
        <>
          <Button variant="ghost" onClick={() => void session.signOut()}>
            Sair
          </Button>
          <Button data-autofocus onClick={stayConnected}>
            Continuar conectado
          </Button>
        </>
      }
    />
  );
}
