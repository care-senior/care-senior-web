import { isRouteErrorResponse, useRouteError } from 'react-router';

import { Button, Card, EmptyState } from '@/shared/ui';

/**
 * Erro inesperado ao renderizar/carregar uma rota. Fica dentro do layout,
 * então o menu continua disponível para o usuário sair da tela quebrada.
 */
export function RouteError() {
  const error = useRouteError();
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : undefined;

  return (
    <Card>
      <EmptyState
        icon="⚠"
        title="Algo deu errado ao abrir esta tela"
        description={detail}
        action={
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        }
      />
    </Card>
  );
}
