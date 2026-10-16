/**
 * Todas as URLs da aplicação. Módulos linkam entre si por aqui (ex.: o
 * dashboard aponta para `paths.requests`), nunca com string solta.
 */
export const paths = {
  dashboard: '/',
  staff: '/colaboradores',
  residents: '/idosos',
  rooms: '/quartos',
  schedule: '/agenda',
  requests: '/solicitacoes',
  reports: '/relatorios',
  clinic: '/clinica',
  login: '/entrar',
  forgotPassword: '/esqueci-senha',
  resetPassword: '/redefinir-senha',
  staffInvite: '/criar-senha',
  guardianInvite: '/responsavel/criar-senha',
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];
