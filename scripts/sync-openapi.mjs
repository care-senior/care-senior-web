#!/usr/bin/env node
/**
 * Atualiza o snapshot da spec OpenAPI da care-senior-api que o Orval consome.
 *
 * Uso:
 *   npm run api:sync                          # http://localhost:3000/api/docs-json
 *   npm run api:sync -- https://host/api/docs-json
 *   npm run api:sync -- ../care-senior-api/openapi.json
 *
 * Também lê OPENAPI_SOURCE do ambiente. O snapshot é versionado para que o
 * build/CI não dependam da API rodando — e o diff dele mostra no PR o que
 * mudou no contrato.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DEFAULT_SOURCE = 'http://localhost:3000/api/docs-json';
const OUTPUT = resolve(import.meta.dirname, '../openapi/care-senior-api.json');

const source = process.argv[2] ?? process.env.OPENAPI_SOURCE ?? DEFAULT_SOURCE;

async function load(from) {
  if (/^https?:\/\//.test(from)) {
    const response = await fetch(from);
    if (!response.ok) {
      throw new Error(`GET ${from} respondeu ${response.status}`);
    }
    return response.json();
  }
  return JSON.parse(await readFile(resolve(from), 'utf8'));
}

try {
  const spec = await load(source);
  if (typeof spec?.openapi !== 'string' || typeof spec.paths !== 'object') {
    throw new Error(`${source} não parece ser uma spec OpenAPI`);
  }
  await writeFile(OUTPUT, `${JSON.stringify(spec, null, 2)}\n`);
  console.log(`Spec OpenAPI ${spec.info?.version ?? ''} salva em ${OUTPUT}`);
} catch (error) {
  console.error(`Falha ao sincronizar a spec: ${error.message}`);
  console.error(
    'A care-senior-api está rodando? (docker compose up na care-senior-api)',
  );
  process.exit(1);
}
