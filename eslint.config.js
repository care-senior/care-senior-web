import { readdirSync } from 'node:fs';

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const modules = readdirSync(new URL('./src/modules', import.meta.url), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

/**
 * Fronteiras da arquitetura:
 *  - shared não conhece nada acima dele (modules, app);
 *  - modules não importam o app;
 *  - um módulo só usa outro pela API pública dele (`modules/<nome>/index.ts`).
 */
const boundaryZones = [
  {
    target: './src/shared',
    from: ['./src/modules', './src/app'],
    message: 'shared/ é a base: não pode depender de modules/ nem de app/.',
  },
  {
    target: './src/modules',
    from: './src/app',
    message: 'Módulos não importam app/ — o app é quem compõe os módulos.',
  },
  ...modules.flatMap((target) =>
    modules
      .filter((source) => source !== target)
      .map((source) => ({
        target: `./src/modules/${target}`,
        from: `./src/modules/${source}`,
        except: ['./index.ts'],
        message: `Importe "${source}" pela API pública (@/modules/${source}), não pelos arquivos internos.`,
      })),
  ),
];

export default defineConfig(
  globalIgnores(['dist', 'coverage', 'src/shared/api/generated']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver()],
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      'import-x/no-restricted-paths': ['error', { zones: boundaryZones }],
      'import-x/no-cycle': 'error',
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules/*/*'],
              message:
                'Use a API pública do módulo (@/modules/<nome>), não arquivos internos.',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['src/**/*.tsx'],
    extends: [reactRefresh.configs.vite],
  },

  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    languageOptions: { globals: globals.vitest },
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

  {
    files: ['*.config.ts'],
    languageOptions: { globals: globals.node },
  },

  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },

  prettier,
);
