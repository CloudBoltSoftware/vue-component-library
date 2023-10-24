/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  // This tells eslint to use this file for all files in this directory and subdirectories.
  root: true,
  // This tells eslint which global variables and features are available.
  env: {
    browser: true,
    node: true,
  },
  // These are sets of linting rules to use by default.
  extends: [
    // This plugin checks for common vue errors in your code.
    "plugin:vue/vue3-recommended",
    // "plugin:vuetify/recommended",
    // This plugin checks for common js errors in your code.
    "eslint:recommended",

    // This plugin keeps linting from clashing with prettier formatting.
    "prettier",
    "plugin:@intlify/vue-i18n/recommended",
    // This plugin checks for accessibility issues in your code.
    "plugin:vuejs-accessibility/recommended",

    // This plugin helps your styles from leaking outside of your components.
    "plugin:vue-scoped-css/vue3-recommended",
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Allows some HTML tags to be self-closing
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "any",
          normal: "any",
          component: "any",
        },
        svg: "never",
        math: "never",
      },
    ],

    // Allows for vuetify syntax with v-slot modifiers
    "vue/valid-v-slot": ["error", { allowModifiers: true }],

    // Allows for multiple root elements in a component
    "vue/no-multiple-template-root": "off",

    // Vuetify icons are fine to skip i18n, always beginning with mdi-
    '@intlify/vue-i18n/no-raw-text': ['warn', { ignorePattern: '^mdi-.*$' }],

    // We don't want errant console.logs in production
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // We don't want unused vars hanging around
    'no-unused-vars': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      { ignoreRestSiblings: true }
    ]

  },
  ignorePatterns: ['node_modules/*', 'dist/*'],
}
