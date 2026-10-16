import { useId, type ComponentProps, type ReactNode } from 'react';

import { cx } from '@/shared/lib/cx';

import styles from './TextField.module.css';

export interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
  hint?: ReactNode;
  trailing?: ReactNode;
}

export function TextField({
  label,
  error,
  hint,
  trailing,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <div className={cx(styles.control, error && styles.invalid)}>
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
      {message && (
        <div
          id={messageId}
          className={cx(styles.message, error && styles.errorMessage)}
        >
          {message}
        </div>
      )}
    </div>
  );
}
