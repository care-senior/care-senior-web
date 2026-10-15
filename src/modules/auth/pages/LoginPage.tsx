import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useSearchParams } from 'react-router';

import { paths } from '@/shared/routing';
import { Alert, Button, PasswordField, TextField } from '@/shared/ui';

import styles from '../components/AuthPage.module.css';
import { SessionSplash } from '../components/SessionSplash';
import { useRestoredSession } from '../hooks/use-session';
import { loginSchema } from '../schemas/auth-schemas';
import { session, type SessionEndReason } from '../session/session';
import { loginErrorMessage } from '../utils/auth-errors';
import { REDIRECT_PARAM, safeRedirectPath } from '../utils/redirect';

const endReasonNotices: Partial<Record<SessionEndReason, string>> = {
  expired: 'Sua sessão expirou. Entre novamente para continuar.',
  inactivity:
    'Por segurança, sua sessão foi encerrada depois de 30 minutos sem uso.',
};

export function LoginPage() {
  const state = useRestoredSession();
  const [searchParams] = useSearchParams();

  if (state.status === 'authenticated') {
    return (
      <Navigate
        to={safeRedirectPath(searchParams.get(REDIRECT_PARAM))}
        replace
      />
    );
  }
  if (state.status === 'unknown') return <SessionSplash />;
  return <LoginForm endReason={state.endReason} />;
}

function LoginForm({ endReason }: { endReason?: SessionEndReason }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const submit = handleSubmit(async (credentials) => {
    try {
      await session.signIn(credentials);
    } catch (error) {
      setError('root', { message: loginErrorMessage(error) });
    }
  });
  const notice = endReason && endReasonNotices[endReason];

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Entrar no painel</h1>
        <p className={styles.description}>
          Acesso exclusivo para colaboradores da clínica.
        </p>
      </header>

      {notice && <Alert>{notice}</Alert>}
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
        <PasswordField
          label="Senha"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Link
          to={paths.forgotPassword}
          className={`${styles.link} ${styles.forgotLink}`}
        >
          Esqueci minha senha
        </Link>
        <Button type="submit" block disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <p className={styles.footnote}>
        Responsável por um idoso? Acesse pelo app Care Senior.
      </p>
    </>
  );
}
