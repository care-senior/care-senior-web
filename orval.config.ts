import { defineConfig } from 'orval';

/**
 * Gera o cliente da care-senior-api a partir do snapshot versionado em
 * `openapi/care-senior-api.json` (atualizado com `npm run api:sync`).
 *
 * `tags-split` cria uma pasta por tag do Swagger — cada controller do NestJS
 * vira uma tag, então cada domínio da API (residents, staff, rooms, ...) ganha
 * seu próprio arquivo de hooks, consumido pelo módulo equivalente em
 * `src/modules/<domínio>/api`.
 */
const toOperationName = (operationId: string) =>
  operationId
    .replace(/Controller_(\w)/, (_, initial: string) => initial.toUpperCase())
    .replace(/^\w/, (initial) => initial.toLowerCase());

export default defineConfig({
  careSeniorApi: {
    input: {
      target: './openapi/care-senior-api.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated/endpoints',
      schemas: './src/shared/api/generated/model',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      formatter: 'prettier',
      override: {
        operationName: ({ operationId = '' }) => toOperationName(operationId),
        mutator: {
          path: './src/shared/api/http-client.ts',
          name: 'httpClient',
        },
        query: {
          useQuery: true,
          signal: true,
        },
      },
    },
  },
});
