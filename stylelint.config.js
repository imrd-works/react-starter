// @ts-check
/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-css-modules',
    'stylelint-config-recess-order',
  ],
  plugins: ['stylelint-declaration-strict-value'],
  ignoreFiles: ['src/shared/styles/tokens/**', 'src/shared/styles/base/_reset.scss'],
  rules: {
    // CSS Modules: camelCase classes map 1:1 to `styles.className` in TS.
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*$',
      { message: 'Use camelCase class names in CSS Modules (styles.myClass)' },
    ],
    'keyframes-name-pattern': '^[a-z][a-z0-9-]*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9-]*$',
    'scss/comment-no-empty': null, // empty `//` lines separate paragraphs in doc comments

    // Design tokens only: no hardcoded colors, z-indexes or font families.
    'scale-unlimited/declaration-strict-value': [
      ['/color$/', 'fill', 'stroke', 'z-index', 'font-family'],
      {
        ignoreValues: [
          'currentcolor',
          'transparent',
          'inherit',
          'initial',
          'unset',
          'none',
          'auto',
        ],
        disableFix: true,
      },
    ],
    'color-named': 'never',
    'color-no-hex': true,
    'declaration-no-important': true,

    // Keep selectors flat and component-scoped.
    'selector-max-id': 0,
    'selector-max-compound-selectors': 3,
    'max-nesting-depth': [3, { ignore: ['pseudo-classes'], ignoreAtRules: ['include', 'media'] }],
    'selector-no-qualifying-type': true,
  },
  overrides: [
    {
      // Global layer: element selectors, resets and `!important` for reduced motion are expected.
      files: ['src/shared/styles/**/*.scss', 'src/app/styles/**/*.scss'],
      rules: {
        'declaration-no-important': null,
        'selector-no-qualifying-type': null,
      },
    },
  ],
}
