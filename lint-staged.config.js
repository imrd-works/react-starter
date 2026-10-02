// @ts-check
/**
 * Runs on staged files only — fast enough for every commit.
 * The full project check (`npm run verify`) runs on pre-push and in CI.
 *
 * The hook runs lint-staged with `--concurrent false`: globs overlap (prettier
 * and eslint touch the same files), so fixers must not run in parallel.
 * Order: fixers → generators → checks.
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*': ['secretlint', 'prettier --write --ignore-unknown'],
  '*.{js,mjs,ts,tsx}': ['eslint --fix --max-warnings 0 --cache --no-warn-ignored'],
  'src/**/*.scss': ['stylelint --fix --cache'],
  // Regenerate class-name types for changed CSS modules and stage them.
  'src/**/*.module.scss': (files) => [
    `node scripts/css-module-types.mjs ${files.join(' ')}`,
    `git add ${files.map((file) => `${file}.d.ts`).join(' ')}`,
  ],
  'src/**/locales/*.json': () => 'node scripts/check-locales.mjs',
  // Type errors can appear in files that were not changed, so check the whole project.
  '*.{ts,tsx,scss}': () => 'tsc -b',
  'src/**/*.{ts,tsx}': ['vitest related --run --passWithNoTests'],
}
