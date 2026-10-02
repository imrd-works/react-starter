# React Starter

Production-ready стартер на React 19 + Vite + TypeScript со строгой архитектурой
(Feature-Sliced Design) и автоматическими проверками на каждом шаге: в редакторе,
на коммите, на пуше и в CI.

```bash
nvm use            # Node 24 LTS (см. .nvmrc)
npm install        # заодно ставит git-хуки (husky)
npm run dev        # http://localhost:5173, API замокан через MSW
```

Демо-аккаунт для входа в dev-режиме: `demo@example.com` / `password123`.

---

## Стек

| Задача               | Решение                                                       |
| -------------------- | ------------------------------------------------------------- |
| UI                   | React 19 + **React Compiler** (автомемоизация)                |
| Сборка               | Vite 8 (Rolldown), code splitting по страницам                |
| Язык                 | TypeScript 6, максимально строгий `tsconfig`                  |
| Роутинг              | React Router 8 (data router, ленивые маршруты, middleware)    |
| Серверное состояние  | TanStack Query 5                                              |
| Клиентское состояние | Zustand 5                                                     |
| HTTP                 | Нативный `fetch` за интерфейсом `ApiClient` (без axios)       |
| Контракт API         | OpenAPI → TypeScript (`openapi-typescript`)                   |
| Формы и валидация    | React Hook Form + Zod 4                                       |
| i18n                 | i18next — типизированные ключи, ленивые языки                 |
| Стили                | SCSS Modules + дизайн-токены, **типизированные классы**       |
| Тосты                | Sonner, загружается лениво при первом вызове                  |
| SEO                  | Нативные `<title>`/`<meta>` React 19, sitemap.xml, robots.txt |
| Моки API             | MSW 3 — одни хендлеры для dev и тестов                        |
| Тесты                | Vitest 5 + Testing Library, Playwright + axe (a11y)           |

## Что проверяется автоматически

| Проверка                  | Инструмент                                           | Где                        |
| ------------------------- | ---------------------------------------------------- | -------------------------- |
| Архитектура (слои FSD)    | `eslint-plugin-boundaries`                           | IDE, commit, push, CI      |
| Качество кода             | ESLint: typescript-eslint strict, React, hooks, a11y | IDE, commit, push, CI      |
| Именование файлов/папок   | `eslint-plugin-check-file`                           | IDE, commit, push, CI      |
| Стили и токены            | Stylelint: camelCase-классы, запрет хардкода цветов  | IDE, commit, push, CI      |
| Форматирование            | Prettier                                             | IDE, commit, push, CI      |
| Типы                      | `tsc` + типы CSS-модулей + типы ключей i18n          | commit, push, CI           |
| Полнота переводов         | `scripts/check-locales.mjs`                          | commit, push, CI           |
| Тесты + порог покрытия    | Vitest (90% строк, 85% веток)                        | commit (related), push, CI |
| Мёртвый код и зависимости | Knip                                                 | push, CI                   |
| Секреты в коде            | Secretlint                                           | commit, push, CI           |
| Сообщения коммитов        | Commitlint (Conventional Commits, scope обязателен)  | commit-msg, CI             |
| Имя ветки, запрет `main`  | `scripts/check-branch-name.mjs`                      | commit, push               |
| Бюджет бандла             | `scripts/check-bundle-size.mjs` (150 kB JS gzip)     | CI                         |
| E2E и доступность         | Playwright + axe-core (WCAG 2.2 AA)                  | CI                         |
| Уязвимости зависимостей   | `npm audit`, Dependabot                              | CI                         |

## Структура

```
src/
├── app/        # инициализация: провайдеры, роутер, middleware, i18n, глобальные стили
├── pages/      # страницы — композиция виджетов и фич, свой route.ts
├── widgets/    # крупные самостоятельные блоки (header)
├── features/   # пользовательские сценарии (auth, contact-form, language-switcher)
├── entities/   # бизнес-сущности (session, user)
└── shared/     # переиспользуемое без бизнес-логики: ui, api, lib, config, styles
```

Слой может импортировать только слои **ниже** себя, а чужой слайс — только через его
`index.ts`. Подробности и примеры — в [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Скрипты

| Команда                     | Описание                                                        |
| --------------------------- | --------------------------------------------------------------- |
| `npm run dev`               | Dev-сервер                                                      |
| `npm run build`             | Production-сборка                                               |
| `npm run build:checked`     | `verify` + сборка                                               |
| `npm run build:analyze`     | Сборка с интерактивной картой бандла (`dist/stats.html`)        |
| `npm run preview`           | Просмотр собранного билда                                       |
| `npm run verify`            | **Единый quality gate**: формат, линт, типы, тесты, мёртвый код |
| `npm run lint`              | ESLint + Stylelint с автофиксом                                 |
| `npm run format`            | Prettier для всего проекта                                      |
| `npm run typecheck`         | Типы CSS-модулей + `tsc -b`                                     |
| `npm run test`              | Vitest в watch-режиме                                           |
| `npm run test:coverage`     | Тесты с порогами покрытия                                       |
| `npm run test:e2e`          | Playwright (сам собирает и поднимает preview)                   |
| `npm run size`              | Проверка бюджета размера бандла (после `build`)                 |
| `npm run knip`              | Неиспользуемые файлы, экспорты, зависимости                     |
| `npm run css:types`         | Сгенерировать `*.module.scss.d.ts`                              |
| `npm run i18n:check`        | Сверить ключи всех языков с `en.json`                           |
| `npm run generate:api`      | OpenAPI → `src/shared/api/contracts.d.ts`                       |
| `npm run generate:slice`    | Создать слайс: `npm run generate:slice -- features add-to-cart` |
| `npm run patch/minor/major` | Поднять версию и создать git-тег                                |

## Рабочий процесс

```bash
git switch -c feat/user-profile       # имя ветки: <type>/<kebab-case>
# ...работа...
git commit -m "feat(profile): add avatar upload"   # type(scope): subject
git push -u origin feat/user-profile  # pre-push запустит npm run verify
```

Дальше — Pull Request; в `main` попадает только через PR с зелёным CI.
Настройка хуков, CI и защиты веток GitHub — в [SETUP.md](SETUP.md).
