// @ts-check
import js from '@eslint/js'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import eslintReact from '@eslint-react/eslint-plugin'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import vitest from '@vitest/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import boundaries from 'eslint-plugin-boundaries'
import checkFile from 'eslint-plugin-check-file'
import importX from 'eslint-plugin-import-x'
import jsxA11y from 'eslint-plugin-jsx-a11y-x'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/**
 * Feature-Sliced Design layers, top → bottom. A layer may import only layers below it.
 * @see docs/ARCHITECTURE.md
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities', 'shared']

const CYRILLIC = String.raw`/[\u0400-\u04FF]/`

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    '**/*.d.ts',
    'playwright-report',
    'test-results',
    'public/mockServiceWorker.js',
  ]),

  // ─── Base: every JS/TS file ──────────────────────────────────────────────
  {
    name: 'base',
    files: ['**/*.{js,mjs,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      unicorn.configs.unopinionated,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      comments.recommended,
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
    },
    rules: {
      // Code quality budgets
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['error', 4],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-alert': 'error',
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['config'] }],
      'no-implicit-coercion': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],

      // TypeScript
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // React Router redirects are thrown Responses.
      '@typescript-eslint/only-throw-error': [
        'error',
        { allow: [{ from: 'lib', name: 'Response' }], allowRethrowing: true },
      ],

      // Imports
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      'import-x/no-default-export': 'error',
      'import-x/no-named-as-default-member': 'off',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // Unicorn: opinionated rules that do not fit this codebase
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off', // handled by check-file
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-ternary': 'off', // early returns read better
      'unicorn/no-useless-undefined': 'off', // conflicts with explicit `() => undefined` callbacks
      'unicorn/no-top-level-side-effects': 'off', // module-level setup (i18n, interceptors) is idiomatic

      // Every eslint-disable must explain why
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    },
  },

  // ─── Node files: configs, scripts, e2e ───────────────────────────────────
  {
    name: 'node',
    files: ['*.{js,ts}', 'scripts/**', 'e2e/**'],
    languageOptions: { globals: globals.node },
    rules: {
      'max-lines': 'off',
      'import-x/no-default-export': 'off',
      'import-x/default': 'off', // CJS plugins in configs
      'import-x/no-named-as-default': 'off',
      'no-console': 'off',
      'unicorn/no-process-exit': 'off',
    },
  },

  // ─── React application code ──────────────────────────────────────────────
  {
    name: 'react',
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      eslintReact.configs['strict-type-checked'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.configs.strict,
      tanstackQuery.configs['flat/recommended-strict'],
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      // Cyrillic is allowed only in locales/*.json — all UI text goes through i18n.
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${CYRILLIC}]`,
          message: 'Cyrillic in code is forbidden: move the text to locales/*.json and use t().',
        },
        {
          selector: `TemplateElement[value.raw=${CYRILLIC}]`,
          message: 'Cyrillic in code is forbidden: move the text to locales/*.json and use t().',
        },
        {
          selector: `JSXText[value=${CYRILLIC}]`,
          message: 'Cyrillic in code is forbidden: move the text to locales/*.json and use t().',
        },
        {
          selector:
            "MemberExpression[object.object.type='MetaProperty'][object.property.name='env'][property.name=/^VITE_/]",
          message: 'Read VITE_* variables only through the validated `env` from @/shared/config.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message:
                'Deep relative imports leak slice internals. Use the @/ alias and public API.',
            },
          ],
          paths: [
            { name: 'react-router-dom', message: 'Import from "react-router" (v7+).' },
            { name: 'axios', message: 'Use `api` from @/shared/api.' },
          ],
        },
      ],
    },
  },

  {
    name: 'env-reader',
    files: ['src/shared/config/env.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },

  // ─── File & folder naming ────────────────────────────────────────────────
  {
    name: 'naming',
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/**/ui/**/*.tsx': 'PASCAL_CASE',
          'src/**/*.ts': 'CAMEL_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  // ─── Architecture: Feature-Sliced Design boundaries ──────────────────────
  {
    name: 'architecture',
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', partialMatch: false },
        ...SLICED_LAYERS.map((layer) => ({
          type: layer,
          pattern: `src/${layer}/*`,
          capture: ['slice'],
          partialMatch: false,
        })),
      ],
      'boundaries/files': [{ category: 'test', pattern: '**/*.test.{ts,tsx}' }],
      // boundaries reads the legacy resolver setting to understand the `@/` alias.
      'import/resolver': { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message:
            '{{from.element.type}} "{{from.element.captured.slice}}" must not import {{to.element.type}} "{{to.element.captured.slice}}" ({{to.fileInternalPath}}). See docs/ARCHITECTURE.md',
          policies: [
            // 1. External packages are allowed everywhere (narrowed by no-restricted-imports).
            { allow: { to: { module: { origin: 'external' } } } },
            { allow: { to: { module: { origin: 'core' } } } },

            // 2. Layer hierarchy: only downward imports.
            ...LAYERS.map((layer, index) => ({
              from: { element: { type: layer } },
              allow: { to: { element: { types: { anyOf: LAYERS.slice(index + 1) } } } },
            })),
            // Shared segments may use each other (ui → lib → config).
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },

            // 3. Public API: other slices are imported only through their index.ts.
            {
              disallow: {
                to: {
                  element: {
                    types: { anyOf: SLICED_LAYERS },
                    fileInternalPath: '!index.{ts,tsx}',
                  },
                },
              },
            },
            // Exceptions: mocks have separate browser/node entry points; app registers slice locales.
            {
              allow: {
                to: {
                  element: {
                    type: 'shared',
                    captured: { slice: 'mocks' },
                    fileInternalPath: '{browser,node}.ts',
                  },
                },
              },
            },
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { fileInternalPath: 'locales/*.json' } } },
            },
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { type: 'shared', captured: { slice: 'locales' } } } },
            },

            // 4. Anything inside the same slice is allowed (relative imports).
            {
              allow: {
                to: {
                  element: {
                    type: '{{ from.element.types.[0] }}',
                    captured: { slice: '{{ from.element.captured.slice }}' },
                  },
                },
              },
            },
            { from: { element: { type: 'app' } }, allow: { to: { element: { type: 'app' } } } },

            // 5. Test-only code (shared/testing, shared/mocks) never reaches production code.
            //    Exceptions: tests themselves and the app layer (dev-only MSW worker, test setup).
            {
              disallow: {
                to: { element: { type: 'shared', captured: { slice: '{testing,mocks}' } } },
              },
            },
            {
              from: { file: { categories: 'test' } },
              allow: {
                to: { element: { type: 'shared', captured: { slice: '{testing,mocks}' } } },
              },
            },
            {
              from: { element: { type: 'app' } },
              allow: {
                to: {
                  element: {
                    type: 'shared',
                    captured: { slice: 'mocks' },
                    fileInternalPath: '{browser,node}.ts',
                  },
                },
              },
            },
            {
              from: { element: { type: 'shared', captured: { slice: '{testing,mocks}' } } },
              allow: { to: { element: { type: 'shared' } } },
            },
          ],
        },
      ],
    },
  },

  // ─── Tests ───────────────────────────────────────────────────────────────
  {
    name: 'tests',
    files: ['src/**/*.test.{ts,tsx}'],
    extends: [vitest.configs.recommended, testingLibrary.configs['flat/react']],
    rules: {
      'vitest/consistent-test-it': ['error', { fn: 'it' }],
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/require-top-level-describe': 'error',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // Must stay last: disables stylistic rules that conflict with Prettier.
  prettier,
])
