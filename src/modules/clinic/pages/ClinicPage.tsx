import { Card, EmptyState } from '@/shared/ui';

export function ClinicPage() {
  return (
    <Card>
      <EmptyState
        icon="⌂"
        title="Em construção"
        description={
          <>
            Dados institucionais, foto/localização e papéis da equipe.
            Aguardando os endpoints de clinics na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
