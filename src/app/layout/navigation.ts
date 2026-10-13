import { paths, type AppPath } from '@/shared/routing';

export interface NavItem {
  label: string;
  to: AppPath;
  icon: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Menu lateral — mesma ordem e agrupamento do protótipo. */
export const navigation: NavGroup[] = [
  {
    label: 'Visão geral',
    items: [{ label: 'Dashboard', to: paths.dashboard, icon: '◧' }],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Colaboradores', to: paths.staff, icon: '◔' },
      { label: 'Idosos', to: paths.residents, icon: '◑' },
      { label: 'Quartos', to: paths.rooms, icon: '▦' },
    ],
  },
  {
    label: 'Operação',
    items: [
      { label: 'Agenda & Rotinas', to: paths.schedule, icon: '▤' },
      { label: 'Solicitações', to: paths.requests, icon: '✉' },
    ],
  },
  {
    label: 'Análise',
    items: [
      { label: 'Relatórios', to: paths.reports, icon: '◫' },
      { label: 'Clínica', to: paths.clinic, icon: '⌂' },
    ],
  },
];
