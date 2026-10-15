import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

import { authForgotStaffPassword } from '@/shared/api/generated/endpoints';
import { paths } from '@/shared/routing';
import { Alert, Button, TextField } from '@/shared/ui';

import styles from '../components/AuthPage.module.css';
import { forgotPasswordSchema } from '../schemas/auth-schemas';
import { authErrorMessage } from '../utils/auth-errors';

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const submit = handleSubmit(async ({ email }) => {
    try {
      await authForgotStaffPassword({ email });
      setSentTo(email);
    } catch (error) {
      setError('root', { message: authErrorMessage(error) });
    }
  });

  if (sentTo) {
    return (
      <>
        <header className={styles.header}>
          <h1 className={styles.title}>Confira seu e-mail</h1>
        </header>
        <Alert tone="success">
          Se {sentTo} estiver cadastrado no painel, enviamos um link para criar
          uma nova senha. O link vale por 1 hora.
        </Alert>
        <Link to={paths.login} className={styles.link}>
          Voltar para o login
        </Link>
      </>
    );
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Esqueci minha senha</h1>
        <p className={styles.description}>
          Informe o e-mail que você usa no painel. Vamos enviar um link para
          criar uma nova senha, que também serve para quem ainda não ativou o
          convite.
        </p>
      </header>

      {errors.root?.message && (
        <Alert tone="danger">{errors.root.message}</Alert>
      )}

      <form
        noValidate
        className={styles.form}
        onSubmit={(event) => void submit(event)}
      >
        <TextField
          label="E-mail"
          type="email"
          autoComplete="username"
          autoFocus
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" block disabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Enviar link'}
        </Button>
      </form>

      <Link to={paths.login} className={styles.link}>
        Voltar para o login
      </Link>
    </>
  );
}
