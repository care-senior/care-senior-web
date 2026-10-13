# Care Senior Web

Painel administrativo (web) do Care Senior, exclusivo para colaboradores da clínica. Consome a [care-senior-api](https://github.com/care-senior/care-senior-api) e segue o [care-senior-prototype](https://github.com/care-senior/care-senior-prototype) como referência de layout e de funcionalidades.

## Stack

| Camada            | Tecnologia                                                   |
| ----------------- | ------------------------------------------------------------ |
| Build / dev       | Vite                                                         |
| UI                | React 19 + TypeScript                                        |
| Rotas             | React Router (data router, páginas em lazy por módulo)       |
| Dados do servidor | TanStack Query                                               |
| Cliente da API    | Orval (gerado da spec OpenAPI do NestJS) + axios             |
| Estilo            | CSS Modules + design tokens em CSS custom properties         |
| Validação         | Zod                                                          |
| Testes            | Vitest + Testing Library                                     |
| Qualidade         | ESLint (typescript-eslint, import-x, react-hooks) + Prettier |

## Rodando localmente

```bash
nvm use            # Node 24 (.nvmrc)
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

Com a care-senior-api rodando (`docker compose up` no repo dela), o Vite repassa `/api/*` para `API_PROXY_TARGET` (padrão `http://localhost:3000`), sem o prefixo `/api`. Assim o browser não esbarra em CORS durante o desenvolvimento.

## Scripts

| Script                 | O que faz                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `npm run dev`          | Dev server                                                   |
| `npm run build`        | Typecheck + build de produção em `dist/`                     |
| `npm run lint`         | ESLint (inclui as regras de fronteira entre camadas/módulos) |
| `npm run format`       | Prettier                                                     |
| `npm run typecheck`    | `tsc -b`                                                     |
| `npm test`             | Vitest                                                       |
| `npm run api:sync`     | Atualiza `openapi/care-senior-api.json` a partir da API      |
| `npm run api:generate` | Regenera o cliente em `src/shared/api/generated`             |
| `npm run api:update`   | `api:sync` + `api:generate`                                  |

## Arquitetura

```
src/
 ├── app/                 # Composition root: providers, roteador, layout (sidebar + topbar)
 ├── modules/             # Uma pasta por área do painel — espelha o menu do protótipo
 │    ├── dashboard/
 │    ├── staff/          # Colaboradores
 │    ├── residents/      # Idosos
 │    ├── rooms/          # Quartos
 │    ├── schedule/       # Agenda & Rotinas
 │    ├── requests/       # Solicitações (vínculo e saída)
 │    ├── reports/        # Relatórios
 │    └── clinic/         # Clínica
 ├── shared/              # Base reutilizável, sem regra de negócio de nenhum módulo
 │    ├── api/            # Cliente HTTP, ApiError e o código gerado pelo Orval
 │    ├── config/         # Variáveis de ambiente validadas com Zod
 │    ├── lib/            # Funções utilitárias puras
 │    ├── routing/        # `paths` e o tipo dos metadados de rota
 │    ├── styles/         # Tokens de design (claro/escuro) e CSS global
 │    └── ui/             # Design system: Button, Badge, Card, Modal, Toast, ...
 └── test/                # Setup do Vitest e helpers de render
```

### Dependências entre camadas

`app → modules → shared`. O ESLint garante isso (`import-x/no-restricted-paths`):

- `shared/` não importa `modules/` nem `app/`;
- `modules/` não importam `app/`;
- um módulo só usa outro pela API pública dele (`@/modules/<nome>`, ou seja, o `index.ts`). Dentro do próprio módulo, use imports relativos.

### Anatomia de um módulo

Os módulos crescem conforme a necessidade. Quando uma pasta ainda não tem uso, ela não existe:

```
modules/residents/
 ├── index.ts             # API pública: rotas e o que outros módulos podem usar
 ├── routes.ts            # Rotas do módulo (path, título da topbar, página em lazy)
 ├── pages/               # Uma página por rota
 ├── components/          # Componentes do módulo (tabela, modais, ficha, ...)
 ├── hooks/               # Hooks de tela que combinam queries, mutations e estado
 └── api/                 # Hooks gerados do domínio + invalidações e adaptações do módulo
```

Para criar uma tela nova: crie o módulo, exporte `xxxRoutes` no `index.ts`, registre em `src/app/router/routes.tsx` e adicione o item em `src/app/layout/navigation.ts`.

### Layout e metadados de rota

O `AppShell` desenha a sidebar e a topbar do protótipo. O título e o subtítulo da topbar (e o `document.title`) vêm do `handle` da rota ativa, então cada módulo declara os seus no próprio `routes.ts`.

### Cliente da API (Orval)

1. A care-senior-api publica a spec OpenAPI do NestJS em `/api/docs-json`.
2. `npm run api:sync` salva essa spec em `openapi/care-senior-api.json`. O arquivo é versionado: o build não depende da API rodando e o diff mostra no PR o que mudou no contrato.
3. `npm run api:generate` gera em `src/shared/api/generated/`:
   - `endpoints/<tag>/<tag>.ts`: funções e hooks do TanStack Query (`useXxx`, `getXxxQueryKey`, ...), um arquivo por tag do Swagger. Cada controller do Nest vira uma tag, então cada domínio da API ganha o seu arquivo;
   - `model/`: os tipos dos DTOs.
4. Todo request passa por `src/shared/api/http-client.ts`, o mutator do Orval. Ele aplica a `baseURL`, o token Bearer e a normalização de erros: toda falha chega como `ApiError`, já com as mensagens do `ValidationPipe` do Nest.

Nunca edite `generated/` à mão. O CI regenera o cliente e falha se o resultado não bater com o que foi commitado.

### Estilo

Os tokens de `src/shared/styles/tokens.css` são os mesmos do protótipo, que por sua vez herdou a paleta do app mobile. Componentes usam apenas `var(--token)`, nunca cor literal, e por isso o tema escuro (preferência do sistema ou `data-theme="dark"` no `<html>`) funciona em tudo. Cada componente tem o seu `.module.css`.
