import type { ClinicResponseDto } from '@/shared/api/generated/model';
import { Badge, Button, Card, CardHeader } from '@/shared/ui';

import { teamRoles } from '../lib/team-roles';

import styles from './ClinicSideCard.module.css';

export interface ClinicSideCardProps {
  clinic: ClinicResponseDto;
}

export function ClinicSideCard({ clinic }: ClinicSideCardProps) {
  return (
    <Card>
      <CardHeader title="Foto & localização" />
      <div className={styles.map} role="img" aria-label="Mapa ilustrativo">
        📍 Mapa ilustrativo
      </div>
      <p className={styles.coords}>
        {clinic.latitude.toFixed(5)}, {clinic.longitude.toFixed(5)}
      </p>
      <Button
        variant="outline"
        block
        disabled
        title="Disponível quando a API de upload de foto existir"
      >
        Trocar foto da clínica
      </Button>

      <hr className={styles.divider} />

      <h3 className={styles.subtitle}>Papéis da equipe</h3>
      <p className={styles.hint}>
        Define quem aprova solicitações de vínculo/saída e desvincula idosos.
      </p>
      <ul className={styles.roles}>
        {teamRoles.map((role) => (
          <li key={role.label} className={styles.role}>
            <Badge tone={role.tone} dot={role.dot}>
              {role.label}
            </Badge>
            <span className={styles.hint}>{role.description}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
