/**
 * Duplicated from the CUI at src/plugins/vuetify/index.js
 */
import { createVuetify } from "vuetify";
import { fa } from "vuetify/iconsets/fa";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VDataTable } from "vuetify/labs/VDataTable";

// Translations provided by Vuetify
import { en } from "vuetify/locale";

// Styles
import "vuetify/styles";
import { cbLightTheme } from "./theme";

export default createVuetify({
  /**
   * Global configuration
   * For example, you can set defaults, as in the commented out example below
   * https://vuetifyjs.com/en/features/global-configuration/
   */
  defaults: {
    global: {
      density: "compact",
    },
    VIcon: {
      size: "small",
    },
    VChip: {
      density: "default",
    },
    VBtn: {
      // Removes the all-caps and wide letter spacing from buttons
      class: "text-none",
      style: "letter-spacing: normal",
    },
    VMenu: {
      VBtn: {
        density: "default",
      },
    },
    VTextarea: {
      hideDetails: "auto",
    },
    VCheckbox: {
      hideDetails: "auto",
    },
  },

  /**
   * Components
   * Most of our components are imported on demand with the vite plugin,
   * but we need to import VDataTable here to use the `labs` version, which is in beta
   * @see {@link https://vuetifyjs.com/en/labs/introduction/}
   */
  components: {
    VDataTable,
  },

  /**
   * Icon Fonts
   * TODO: Load these with npm instead of a CDN so we have better vulnerability/version tracking
   * @see {@link https://vuetifyjs.com/en/features/icon-fonts/}
   */
  icons: {
    // The documentation shows re-setting the default `defaultSet: 'mdi'` shown here for clarity,
    // but it was causing a testing environment error. It's been omitted here, but can be brought
    // back later once our dependencies resolve the issue.
    aliases,
    sets: {
      // This gives us access to the full fontawesome icon set in VIcon like `fa:fa-plus` or `fas fa-plus`
      fa,
      mdi,
    },
  },

  /**
   * Internationalization (i18n)
   * @see {@link https://vuetifyjs.com/en/features/internationalization/#internationalization-i18n}
   */
  locale: {
    locale: "en",
    fallback: "en",
    messages: { en },
  },

  /**
   * Theme
   * @see {@link https://vuetifyjs.com/en/features/theme/}
   */
  theme: {
    themes: {
      cbLightTheme,
    },
    defaultTheme: "cbLightTheme",
    variations: {
      // If you use more color variations or lighten/darken amounts, add them here
      colors: ["primary", "secondary", "grey"],
      lighten: 5,
      darken: 2,
    },
  },
});
