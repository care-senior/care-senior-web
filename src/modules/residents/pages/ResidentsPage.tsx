import { Card, EmptyState } from '@/shared/ui';

export function ResidentsPage() {
  return (
    <Card>
      <EmptyState
        icon="◑"
        title="Em construção"
        description={
          <>
            Lista de idosos, ficha com responsáveis e medicamentos, troca de
            quarto e desvinculação. Aguardando os endpoints de residents,
            guardians e medications na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
