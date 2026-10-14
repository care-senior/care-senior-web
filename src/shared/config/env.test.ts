import { parseEnv } from './env';

describe('parseEnv', () => {
  it('usa a mesma origem quando VITE_API_URL não é definida', () => {
    expect(parseEnv({}).VITE_API_URL).toBe('');
  });

  it('aceita uma URL absoluta', () => {
    expect(parseEnv({ VITE_API_URL: 'https://api.caresenior.app' })).toEqual({
      VITE_API_URL: 'https://api.caresenior.app',
    });
  });

  it('falha com um caminho relativo, já que as rotas geradas trazem /api/v1', () => {
    expect(() => parseEnv({ VITE_API_URL: '/api' })).toThrow(
      /Variáveis de ambiente inválidas/,
    );
  });
});
