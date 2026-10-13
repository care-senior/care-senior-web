import { Card, EmptyState } from '@/shared/ui';

export function SchedulePage() {
  return (
    <Card>
      <EmptyState
        icon="▤"
        title="Em construção"
        description={
          <>
            Agenda da semana por tipo de atividade e rotinas recorrentes que
            geram atividades. Aguardando os endpoints de activities e routines
            na care-senior-api.
          </>
        }
      />
    </Card>
  );
}
