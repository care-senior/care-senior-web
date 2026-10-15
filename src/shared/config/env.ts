import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.union([z.literal(''), z.url()]).default(''),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, unknown>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Variáveis de ambiente inválidas:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

export const env = parseEnv(import.meta.env);
