import { paths, type AppRoute } from '@/shared/routing';

export const authRoutes: AppRoute[] = [
  {
    path: paths.login,
    handle: { title: 'Entrar' },
    lazy: async () => ({
      Component: (await import('./pages/LoginPage')).LoginPage,
    }),
  },
  {
    path: paths.forgotPassword,
    handle: { title: 'Esqueci minha senha' },
    lazy: async () => ({
      Component: (await import('./pages/ForgotPasswordPage'))
        .ForgotPasswordPage,
    }),
  },
  {
    path: paths.resetPassword,
    handle: { title: 'Nova senha' },
    lazy: async () => ({
      Component: (await import('./pages/ResetPasswordPage')).ResetPasswordPage,
    }),
  },
  {
    path: paths.staffInvite,
    handle: { title: 'Criar senha' },
    lazy: async () => ({
      Component: (await import('./pages/StaffInvitePage')).StaffInvitePage,
    }),
  },
  {
    path: paths.guardianInvite,
    handle: { title: 'Criar senha' },
    lazy: async () => ({
      Component: (await import('./pages/GuardianInvitePage'))
        .GuardianInvitePage,
    }),
  },
];
