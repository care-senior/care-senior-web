import { Card, EmptyState } from '@/shared/ui';

export function StaffPage() {
  return (
    <Card>
      <EmptyState
        icon="◔"
        title="Em construção"
        description={
          <>
            Lista da equipe com busca, cadastro e edição de colaboradores e seus
            cargos. Aguardando os endpoints de staff na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
