import { Link } from 'react-router';

import { authAcceptStaffInvite } from '@/shared/api/generated/endpoints';
import { paths } from '@/shared/routing';
import { Alert } from '@/shared/ui';

import styles from '../components/AuthPage.module.css';
import { SetPasswordForm } from '../components/SetPasswordForm';

export function StaffInvitePage() {
  return (
    <SetPasswordForm
      title="Crie sua senha de acesso"
      description="Boas-vindas ao painel Care Senior! Escolha a senha que você vai usar para entrar."
      submitLabel="Criar senha"
      submit={authAcceptStaffInvite}
      invalidLinkMessage='Este convite é inválido, já foi usado ou expirou. Use "Esqueci minha senha" para receber um novo link.'
      success={
        <Alert tone="success">
          Senha criada! Agora é só entrar com seu e-mail e a nova senha.
        </Alert>
      }
      footer={
        <Link to={paths.login} className={styles.link}>
          Ir para o login
        </Link>
      }
    />
  );
}
