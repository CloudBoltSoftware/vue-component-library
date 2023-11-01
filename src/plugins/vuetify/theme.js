/**
 * Duplicated from the CUI at src/plugins/vuetify/theme.js
 * Removed Cloudbolt defaultPortalTheme
 */
import colors from 'vuetify/lib/util/colors'

/**
 * Custom theme for CloudBolt
 * Many of these colors are defaults from Vuetify, re-declared here for clarity
 *
 * @type {import('vuetify/lib/framework.mjs').ThemeDefinition}
 * @see {@link https://vuetifyjs.com/en/features/theme/#color-variations}
 * @see {@link https://vuetifyjs.com/en/styles/colors/#javascript-color-pack}
 */
export const cbLightTheme = {
  dark: false,

  colors: {
    primary: colors.blue.darken2,
    'primary-lighten-5': colors.blue.lighten5,
    secondary: colors.grey.darken3,
    accent: colors.blue.accent1,
    error: colors.red.accent2,
    info: colors.blue.base,
    success: colors.green.base,
    warning: colors.amber.base
  }
}
