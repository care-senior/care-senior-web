import { Card, EmptyState } from '@/shared/ui';

export function DashboardPage() {
  return (
    <Card>
      <EmptyState
        icon="◧"
        title="Em construção"
        description={
          <>
            Indicadores do dia, agenda de hoje e solicitações pendentes.
            Aguardando os endpoints de activities, outing-requests, residents e
            rooms na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
