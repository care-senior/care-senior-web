import { Link } from 'react-router';

import { authResetPassword } from '@/shared/api/generated/endpoints';
import { paths } from '@/shared/routing';
import { Alert } from '@/shared/ui';

import styles from '../components/AuthPage.module.css';
import { SetPasswordForm } from '../components/SetPasswordForm';

/** O mesmo link de redefinição vai para colaboradores e responsáveis. */
export function ResetPasswordPage() {
  return (
    <SetPasswordForm
      title="Criar uma nova senha"
      description="Escolha a senha que você vai usar daqui pra frente."
      submitLabel="Salvar nova senha"
      submit={authResetPassword}
      invalidLinkMessage='Este link é inválido ou já expirou. Peça um novo em "Esqueci minha senha", no painel ou no app.'
      success={
        <Alert tone="success">
          Senha alterada! Colaboradores já podem entrar no painel; responsáveis,
          no app Care Senior.
        </Alert>
      }
      footer={
        <Link to={paths.login} className={styles.link}>
          Ir para o login do painel
        </Link>
      }
    />
  );
}
