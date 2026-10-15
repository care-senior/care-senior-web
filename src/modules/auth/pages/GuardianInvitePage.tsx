import { authAcceptGuardianInvite } from '@/shared/api/generated/endpoints';
import { Alert } from '@/shared/ui';

import { SetPasswordForm } from '../components/SetPasswordForm';

/** Página pública para o responsável cadastrado pela clínica; ele usa o app, não o painel. */
export function GuardianInvitePage() {
  return (
    <SetPasswordForm
      title="Crie sua senha"
      description="Escolha a senha que você vai usar para entrar no app Care Senior."
      submitLabel="Criar senha"
      submit={authAcceptGuardianInvite}
      invalidLinkMessage='Este convite é inválido, já foi usado ou expirou. No app Care Senior, toque em "Esqueci minha senha" para receber um novo link.'
      success={
        <Alert tone="success">
          Senha criada! Abra o app Care Senior e entre com seu e-mail e a nova
          senha.
        </Alert>
      }
    />
  );
}
