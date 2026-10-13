/** Junta classes CSS ignorando valores falsy: `cx(styles.a, on && styles.b)`. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
