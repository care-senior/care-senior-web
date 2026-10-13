import { Link } from 'react-router';

import { paths } from '@/shared/routing';
import { Card, EmptyState } from '@/shared/ui';

export function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon="⌕"
        title="Página não encontrada"
        description="O endereço acessado não existe neste painel."
        action={<Link to={paths.dashboard}>Voltar ao dashboard</Link>}
      />
    </Card>
  );
}
