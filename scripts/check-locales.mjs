// @ts-check
/**
 * Every `<slice>/locales/<lang>.json` must have exactly the same keys as the
 * default language file next to it. Fails on missing, extra and empty keys.
 */
import { globSync, readFileSync } from 'node:fs'
import path from 'node:path'

const DEFAULT_LANGUAGE = 'en'

/**
 * @param {unknown} value
 * @param {string} [prefix]
 * @returns {Map<string, unknown>}
 */
function flatten(value, prefix = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return new Map([[prefix, value]])
  }

  return new Map(
    Object.entries(value).flatMap(([key, nested]) => [
      ...flatten(nested, prefix ? `${prefix}.${key}` : key),
    ])
  )
}

/** @param {string} file */
const readKeys = (file) => flatten(JSON.parse(readFileSync(file, 'utf8')))

/**
 * @param {Map<string, unknown>} baseKeys
 * @param {string} file
 * @returns {string[]}
 */
function compareWithBase(baseKeys, file) {
  const keys = readKeys(file)
  const missing = [...baseKeys.keys()]
    .filter((key) => !keys.has(key))
    .map((key) => `${file}: missing "${key}"`)
  const extra = [...keys.keys()]
    .filter((key) => !baseKeys.has(key))
    .map((key) => `${file}: extra "${key}" (not in ${DEFAULT_LANGUAGE}.json)`)
  const empty = [...keys]
    .filter(([, value]) => value === '')
    .map(([key]) => `${file}: empty "${key}"`)

  return [...missing, ...extra, ...empty]
}

const problems = globSync(`src/**/locales/${DEFAULT_LANGUAGE}.json`).flatMap((baseFile) => {
  const baseKeys = readKeys(baseFile)
  return globSync(`${path.dirname(baseFile)}/*.json`)
    .filter((file) => file !== baseFile)
    .flatMap((file) => compareWithBase(baseKeys, file))
})

if (problems.length > 0) {
  console.error(`Locale files are out of sync:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
