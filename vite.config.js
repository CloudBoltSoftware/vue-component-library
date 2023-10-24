import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls }  from "vite-plugin-vuetify";
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    vuetify({ autoImport: true }),
    // Set up vue i18n for translations, allowing <i18n> tags in .vue files
    // More setup in src/plugins/i18n/index.js
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n#-options
    VueI18nPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ["vuetify"],
  },
  build: {
    // https://vitejs.dev/guide/build.html#library-mode
    lib: {
      entry: resolve('src/main.js'),
      name: 'VueComponentLibrary',
    },
    // cssCodeSplit: false,
    rollupOptions: {
      // externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'pinia'],
      output: {
        // disable warning on src/main.js using both default and named export
        // exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          pinia: 'pinia'
        },
      },
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
    },
    server: {
      deps: {
        // https://vitest.dev/config/#deps-inline
        inline: [
          // Vuetify doesn't ship a vitest compatible code format, so we can inline it to bypass the issue.
          'vuetify'
        ]
      },
    },
    // jsdom is a lightweight browser environment that can be used for testing
    environment: 'jsdom',
    // Setup files to run before each test file
    setupFiles: ['src/testing/setupBeforeEachTestFile.js'],
    // Don't re-trigger tests on changes to some files
    watchExclude: ['**/node_modules/**'],
    // To have the greatest isolation between tests, we completely reset mocks every test
    restoreMocks: true
  },
})
