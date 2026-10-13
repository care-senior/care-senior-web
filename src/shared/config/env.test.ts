import { parseEnv } from './env';

describe('parseEnv', () => {
  it('usa /api quando VITE_API_URL não é definida', () => {
    expect(parseEnv({}).VITE_API_URL).toBe('/api');
  });

  it('aceita uma URL absoluta', () => {
    expect(parseEnv({ VITE_API_URL: 'https://api.caresenior.app' })).toEqual({
      VITE_API_URL: 'https://api.caresenior.app',
    });
  });

  it('falha com VITE_API_URL vazia', () => {
    expect(() => parseEnv({ VITE_API_URL: '  ' })).toThrow(
      /Variáveis de ambiente inválidas/,
    );
  });
});
