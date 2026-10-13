import { Card, EmptyState } from '@/shared/ui';

export function RequestsPage() {
  return (
    <Card>
      <EmptyState
        icon="✉"
        title="Em construção"
        description={
          <>
            Solicitações de vínculo e de saída para aprovar ou recusar.
            Aguardando os endpoints de outing-requests e residents na
            care-senior-api.
          </>
        }
      />
    </Card>
  );
}
