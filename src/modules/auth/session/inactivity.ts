const LAST_ACTIVITY_KEY = 'care-senior:last-activity';

export const INACTIVITY_LIMIT_MS = 30 * 60_000;
export const INACTIVITY_WARNING_MS = 60_000;

export function readLastActivity(): number | undefined {
  try {
    const stored = Number(localStorage.getItem(LAST_ACTIVITY_KEY));
    return stored > 0 ? stored : undefined;
  } catch {
    return undefined;
  }
}

export function markActivity(at = Date.now()) {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(at));
  } catch {
    // Sem storage, cada aba conta só a própria atividade.
  }
}

export function clearActivity() {
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch {
    // Nada para limpar.
  }
}

/** Atividade em qualquer aba conta, já que todas leem o mesmo localStorage. */
export function msUntilInactive(now = Date.now()) {
  const lastActivity = readLastActivity() ?? now;
  return lastActivity + INACTIVITY_LIMIT_MS - now;
}
