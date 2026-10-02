# Настройка и процессы

## Окружение

- **Node.js 24 LTS** (`.nvmrc`). В `.npmrc` включён `engine-strict` — на старой версии
  `npm install` упадёт сразу, а не странной ошибкой позже.
- Версии зависимостей фиксируются точно (`save-exact`), обновления приходят через Dependabot.

```bash
nvm install && nvm use
npm install
```

`npm install` выполняет `prepare` → `husky`, который подключает git-хуки из `.husky/`.

### Переменные окружения

Скопируйте `.env.example` в `.env.local`. Все `VITE_*` читаются **только** через
`env` из `@/shared/config` (`src/shared/config/env.ts`) — там же валидация:
приложение падает при старте с понятной ошибкой, а не в случайном месте.

| Переменная          | По умолчанию           | Описание                                  |
| ------------------- | ---------------------- | ----------------------------------------- |
| `VITE_API_BASE_URL` | `/api`                 | Базовый URL REST API                      |
| `VITE_SITE_URL`     | `https://example.com`  | URL сайта для sitemap.xml и robots.txt    |
| `VITE_API_MOCKING`  | `false` (`true` в dev) | Моки MSW в dev. В прод-сборку не попадают |
| `OPENAPI_SPEC_URL`  | `./openapi.json`       | Источник для `npm run generate:api`       |

Новая переменная: добавить в `env.d.ts`, прочитать в `env.ts`, описать в `.env.example`.

## Git-хуки (Husky)

| Хук          | Что делает                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pre-commit` | Проверка имени ветки и запрет коммитов в `main`/`master`/`develop`; затем `lint-staged` по staged-файлам: secretlint → prettier → eslint → stylelint → типы CSS-модулей → проверка локалей → `tsc -b` → `vitest related` |
| `commit-msg` | Commitlint: формат `type(scope): subject`                                                                                                                                                                                |
| `pre-push`   | Проверка ветки + полный `npm run verify`                                                                                                                                                                                 |

Задачи lint-staged идут последовательно (`--concurrent false`): glob-ы пересекаются,
и параллельные фиксеры могли бы одновременно переписывать один файл.

### Ветки

Формат: `<type>/<kebab-case-описание>`, например `feat/user-profile`, `fix/login-redirect`.
Типы: `feat, fix, refactor, perf, style, docs, test, chore, build, ci, release, hotfix`.
Единственный разрешённый прямой коммит в `main` — самый первый коммит нового репозитория.

### Коммиты

```text
type(scope): subject

feat(auth): add password reset
fix(router): keep query params on redirect
chore(deps): bump react to 19.3
```

- `type`: `feat, fix, refactor, perf, style, docs, test, chore, build, ci, revert`
- `scope` обязателен, kebab-case — обычно имя слайса
- `subject` с маленькой буквы, без точки, заголовок до 100 символов

### Обход хуков

Только в экстренных случаях и с объяснением в PR — CI всё равно проверит то же самое:

```bash
HUSKY=0 git commit -m "fix(hotfix): ..."
```

## CI (GitHub Actions)

`.github/workflows/ci.yml` — параллельные job-ы:

| Job       | Что проверяет                                                                  |
| --------- | ------------------------------------------------------------------------------ |
| `quality` | `npm run verify` (формат, линт, архитектура, типы, тесты, покрытие, knip)      |
| `build`   | Production-сборка + бюджет бандла (`npm run size`)                             |
| `e2e`     | Playwright + axe на десктопе и мобильном                                       |
| `commits` | Commitlint для всех коммитов PR **и заголовка PR** (он станет squash-коммитом) |
| `audit`   | `npm audit --audit-level=high` и проверка подписей пакетов                     |

Также: `concurrency` отменяет устаревшие запуски, `permissions: read`, таймауты,
кэш npm. Dependabot (`.github/dependabot.yml`) раз в неделю группирует обновления
npm и GitHub Actions.

## Защита `main` на GitHub

Правила веток не хранятся в репозитории — их включают в настройках после первого push.
`Settings → Rules → Rulesets → New branch ruleset`:

| Настройка                             | Значение                                         |
| ------------------------------------- | ------------------------------------------------ |
| Target branches                       | Default branch (`main`)                          |
| Restrict deletions                    | ✔                                                |
| Block force pushes                    | ✔                                                |
| Require linear history                | ✔                                                |
| Require a pull request before merging | ✔, approvals ≥ 1, dismiss stale approvals        |
| Require review from Code Owners       | ✔ (заполните `.github/CODEOWNERS`)               |
| Require conversation resolution       | ✔                                                |
| Require status checks to pass         | ✔: `quality`, `build`, `e2e`, `commits`, `audit` |
| Require branches to be up to date     | ✔                                                |

`Settings → General → Pull Requests`: оставьте только **Squash merging** с заголовком PR
в качестве сообщения коммита — история `main` останется в формате Conventional Commits.

## Бюджеты качества

| Метрика                    | Порог     | Где менять                      |
| -------------------------- | --------- | ------------------------------- |
| Покрытие строк / веток     | 90% / 85% | `vitest.config.ts`              |
| JS первой загрузки (gzip)  | 150 kB    | `scripts/check-bundle-size.mjs` |
| CSS первой загрузки (gzip) | 10 kB     | `scripts/check-bundle-size.mjs` |
| Сложность функции          | 10        | `eslint.config.js`              |
| Строк в файле              | 300       | `eslint.config.js`              |
| Параметров функции         | 3         | `eslint.config.js`              |

Пороги — «храповик»: поднимаются осознанно, снижаются только с обоснованием в PR.

## Отключение опций

| Что            | Как                                                               |
| -------------- | ----------------------------------------------------------------- |
| Моки API в dev | `VITE_API_MOCKING=false` в `.env.local`                           |
| React Compiler | Убрать `babel(...)` из `vite.config.ts`                           |
| Второй язык    | Удалить `ru` из `SUPPORTED_LANGUAGES` и файлы `locales/ru.json`   |
| Git-хуки       | `HUSKY=0` разово; насовсем — удалить скрипт `prepare` и `.husky/` |

## Редактор

Рекомендуемые расширения VS Code — `.vscode/extensions.json`. Настройки проекта
включают форматирование и автофикс ESLint/Stylelint при сохранении и группировку
`*.module.scss.d.ts` под исходными файлами.
