import { Button, Card, CardHeader } from '@/shared/ui';

import { useCurrentClinic } from '../api/use-current-clinic';
import { ClinicForm } from '../components/ClinicForm';
import { ClinicSideCard } from '../components/ClinicSideCard';

import styles from './ClinicPage.module.css';

export function ClinicPage() {
  const { data: clinic, isLoading, isError, refetch } = useCurrentClinic();

  if (!clinic) {
    if (isLoading) {
      return <p className={styles.feedback}>Carregando dados da clínica…</p>;
    }
    if (isError) {
      return (
        <div className={styles.feedback}>
          <p>Não foi possível carregar os dados da clínica.</p>
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      );
    }
    return <p className={styles.feedback}>Nenhuma clínica encontrada.</p>;
  }

  return (
    <div className={styles.grid}>
      <Card>
        <CardHeader title="Dados institucionais" />
        <ClinicForm key={clinic.id} clinic={clinic} />
      </Card>
      <ClinicSideCard clinic={clinic} />
    </div>
  );
}

/*
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
*/
