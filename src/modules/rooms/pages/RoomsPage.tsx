import { Card, EmptyState } from '@/shared/ui';

export function RoomsPage() {
  return (
    <Card>
      <EmptyState
        icon="▦"
        title="Em construção"
        description={
          <>
            Mapa de quartos por andar/ala, ocupação e transferência de idosos.
            Aguardando os endpoints de rooms na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
