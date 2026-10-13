import { Card, EmptyState } from '@/shared/ui';

export function ReportsPage() {
  return (
    <Card>
      <EmptyState
        icon="◫"
        title="Em construção"
        description={
          <>
            Adesão a medicação, conclusão de atividades, feedback e ocupação ao
            longo do tempo. Aguardando os endpoints de activities, feedback e
            rooms na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
