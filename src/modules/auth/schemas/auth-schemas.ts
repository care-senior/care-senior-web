import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const emailField = z
  .string()
  .trim()
  .min(1, 'Informe seu e-mail.')
  .pipe(z.email('Informe um e-mail válido.'));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Informe sua senha.'),
});

export const forgotPasswordSchema = z.object({ email: emailField });

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      )
      .max(
        PASSWORD_MAX_LENGTH,
        `A senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
      ),
    confirmation: z.string().min(1, 'Repita a nova senha.'),
  })
  .refine((values) => values.password === values.confirmation, {
    path: ['confirmation'],
    error: 'As senhas não são iguais.',
  });
