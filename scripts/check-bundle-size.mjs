// @ts-check
/**
 * Bundle budget: sums the gzip size of everything `dist/index.html` loads on the
 * first visit (entry script, modulepreload links, stylesheets) and fails if it
 * exceeds the budget. Lazy route chunks are reported but not counted.
 *
 *   npm run build && npm run size
 */
import { existsSync, globSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

const DIST = 'dist'

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html not found. Run `npm run build` first.')
  process.exit(1)
}

const BUDGET_KB = { js: 150, css: 10 }

const html = readFileSync(path.join(DIST, 'index.html'), 'utf8')
const initial = new Set(
  [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((match) => match[1] ?? '')
)

/** @param {string} file */
const gzipKb = (file) => gzipSync(readFileSync(path.join(DIST, file))).length / 1024

/** @param {'js' | 'css'} extension */
const total = (extension) =>
  [...initial]
    .filter((file) => file.endsWith(`.${extension}`))
    .reduce((sum, file) => sum + gzipKb(file), 0)

const lazyChunks = globSync('assets/*.js', { cwd: DIST }).filter((file) => !initial.has(file))
const largestLazy = lazyChunks
  .map((file) => ({ file, size: gzipKb(file) }))
  .toSorted((a, b) => b.size - a.size)
  .slice(0, 5)

const results = /** @type {const} */ (['js', 'css']).map((extension) => ({
  extension,
  size: total(extension),
  budget: BUDGET_KB[extension],
}))

console.log(`Initial load (${String(initial.size)} files, gzip):`)
for (const { extension, size, budget } of results) {
  const status = size <= budget ? '✔' : '✖'
  console.log(
    `  ${status} ${extension.toUpperCase()}: ${size.toFixed(1)} kB / ${String(budget)} kB`
  )
}
console.log('Largest lazy chunks:')
for (const { file, size } of largestLazy) console.log(`    ${file}: ${size.toFixed(1)} kB`)

if (results.some(({ size, budget }) => size > budget)) {
  console.error('\nBundle budget exceeded. Lazy-load heavy code or raise the budget consciously.')
  process.exit(1)
}
