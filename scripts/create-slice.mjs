// @ts-check
/**
 * Scaffolds a Feature-Sliced Design slice with the conventions enforced by ESLint.
 *
 *   npm run generate:slice -- <layer> <slice-name>
 *   npm run generate:slice -- features add-to-cart
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const LAYERS = ['pages', 'widgets', 'features', 'entities']
const KEBAB_CASE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/

const [layer, slice] = process.argv.slice(2)

if (!layer || !slice || !LAYERS.includes(layer) || !KEBAB_CASE.test(slice)) {
  console.error(
    `Usage: npm run generate:slice -- <${LAYERS.join('|')}> <kebab-case-name>\n` +
      'Example: npm run generate:slice -- features add-to-cart'
  )
  process.exit(1)
}

const pascal = slice
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('')
const component = layer === 'pages' ? `${pascal}Page` : pascal
const root = path.join('src', layer, slice)

if (existsSync(root)) {
  console.error(`✖ ${root} already exists`)
  process.exit(1)
}

/** @type {Record<string, string>} */
const files = {
  [`ui/${component}.tsx`]: `import { useTranslation } from 'react-i18next'

import styles from './${component}.module.scss'

export function ${component}() {
  const { t } = useTranslation('${slice}')

  return <section className={styles.root}>{t('title')}</section>
}
`,
  [`ui/${component}.module.scss`]: `.root {
  display: block;
}
`,
  [`ui/${component}.test.tsx`]: `import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/shared/testing'

import { ${component} } from './${component}'

describe('${component}', () => {
  it('renders', () => {
    renderWithProviders(<${component} />)

    expect(screen.getByText('${pascal}')).toBeInTheDocument()
  })
})
`,
  'locales/en.json': `${JSON.stringify({ title: pascal }, null, 2)}\n`,
  'locales/ru.json': `${JSON.stringify({ title: pascal }, null, 2)}\n`,
  'index.ts':
    layer === 'pages'
      ? `export { ${slice.replaceAll(/-([a-z])/g, (_, char) => String(char).toUpperCase())}Route } from './route'\n`
      : `export { ${component} } from './ui/${component}'\n`,
}

if (layer === 'pages') {
  const routeName = `${slice.replaceAll(/-([a-z])/g, (_, char) => String(char).toUpperCase())}Route`
  files['route.ts'] = `import type { RouteObject } from 'react-router'

export const ${routeName}: RouteObject = {
  path: '/${slice}',
  lazy: async () => ({ Component: (await import('./ui/${component}')).${component} }),
}
`
}

for (const [relative, content] of Object.entries(files)) {
  const target = path.join(root, relative)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, content)
}

console.log(`✔ Created ${root}
Next steps:
  1. Register the namespace in src/app/i18n/resources.ts:  '${slice}': <import of ${root}/locales/en.json>
  2. npm run css:types${layer === 'pages' ? `\n  3. Add the route to src/app/router/routes.ts and the path to src/shared/config/routes.ts` : ''}`)
