import { zodResolver } from '@hookform/resolvers/zod';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';

import { Alert, Button, PasswordField } from '@/shared/ui';

import {
  newPasswordSchema,
  PASSWORD_MIN_LENGTH,
} from '../schemas/auth-schemas';
import { tokenErrorMessage } from '../utils/auth-errors';

import styles from './AuthPage.module.css';

export interface SetPasswordFormProps {
  title: string;
  description: string;
  submitLabel: string;
  submit: (body: { token: string; password: string }) => Promise<unknown>;
  invalidLinkMessage: string;
  success: ReactNode;
  footer?: ReactNode;
}

/** Formulário das páginas que recebem `?token=` por e-mail (convite e redefinição). */
export function SetPasswordForm({
  title,
  description,
  submitLabel,
  submit,
  invalidLinkMessage,
  success,
  footer,
}: SetPasswordFormProps) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(newPasswordSchema) });

  const onSubmit = handleSubmit(async ({ password }) => {
    if (!token) return;
    try {
      await submit({ token, password });
      setDone(true);
    } catch (error) {
      setError('root', {
        message: tokenErrorMessage(error, invalidLinkMessage),
      });
    }
  });

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {!done && token && <p className={styles.description}>{description}</p>}
      </header>

      {done ? (
        success
      ) : token ? (
        <>
          {errors.root?.message && (
            <Alert tone="danger">{errors.root.message}</Alert>
          )}
          <form
            noValidate
            className={styles.form}
            onSubmit={(event) => void onSubmit(event)}
          >
            <PasswordField
              label="Nova senha"
              autoComplete="new-password"
              autoFocus
              hint={`Mínimo de ${PASSWORD_MIN_LENGTH} caracteres.`}
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordField
              label="Confirme a nova senha"
              autoComplete="new-password"
              error={errors.confirmation?.message}
              {...register('confirmation')}
            />
            <Button type="submit" block disabled={isSubmitting}>
              {isSubmitting ? 'Salvando…' : submitLabel}
            </Button>
          </form>
        </>
      ) : (
        <Alert tone="danger">{invalidLinkMessage}</Alert>
      )}

      {footer}
    </>
  );
}
