import { createTestingPinia } from '@pinia/testing'
import { render } from '@testing-library/vue'
import { fn } from '@vitest/spy'
import { createPinia, setActivePinia } from 'pinia'
import { createApp, markRaw } from 'vue'
import { createMemoryHistory, createWebHistory, createRouter } from '/__mocks__/vue-router'
import vueDompurifyHTMLPlugin from 'vue-dompurify-html'
import i18n from '../plugins/i18n'
import piniaPluginSetupStoreReset from '../plugins/pinia/resetStorePlugin'
import vuetify from '../plugins/vuetify'

import VAppWrapper from './VAppWrapper.vue';

/* eslint-disable vue/one-component-per-file */
/**
 * Top section copied and trimmed from CUI src/router/index.js
 */

// Create the History Mode
// https://router.vuejs.org/guide/essentials/history-mode.html
const base = import.meta.env.VITE_ROUTE_BASE || '/'

// Create a basic router config
// https://router.vuejs.org/api/interfaces/RouterOptions.html
export const createRouterConfig = () => ({
  history: createWebHistory(base),
})

/**
 * Contents below copied and trimmed from CUI src/testing/testUtils.js
 */
/**
 * Creates a pinia instance good for our testing. Takes all the normal options of createTestingPinia
 * @param {external:@pinia/testing.TestingOptions} options See https://pinia.vuejs.org/api/interfaces/pinia_testing.TestingOptions.html
 * @returns {external:@pinia/testing.TestingPinia}
 */
export function createTestingPiniaWrapper(options = {}) {
  return createTestingPinia({
    // We don't want to stub patch or actions so our components act more like they would in production.
    stubPatch: false,
    stubActions: false,
    plugins: options.plugins || [piniaPluginSetupStoreReset],
    createSpy: fn,
    ...options
  })
}

/**
 * Sets the active pinia instance to a new blank-slate testing pinia instance.
 * This is useful for resetting the state of pinia stores between tests.
 * See https://pinia.vuejs.org/cookbook/testing.html#initial-state
 * @returns {external:@pinia/testing.TestingPinia}
 */
export function setTestingPiniaToDefaults() {
  return setActivePinia(createTestingPiniaWrapper())
}

/**
 * Create a real pinia instance with the resetStorePlugin.
 * This is the minimal real pinia instance needed to test most things.
 */
export function createRealPinia() {
  return createPinia().use(piniaPluginSetupStoreReset)
}

/**
 * Sets real pinia as the active pinia instance.
 * Useful for testing pinia plugins and stores directly.
 * See https://pinia.vuejs.org/cookbook/testing.html#initial-state
 */
export function setRealPiniaToDefaults() {
  // eslint-disable-next-line vue/one-component-per-file
  const app = createApp({})
  const pinia = createRealPinia()
  app.use(pinia)
  setActivePinia(pinia)
  return pinia
}

/**
 * @typedef {import('@testing-library/vue').RenderOptions} RenderWrapperOptions
 * @property {object} [initialState] The initial state of pinia stores by id
 */

/**
 * Wraps Vue Testing Library's render function (keeping mostly the same function signature).
 * Adds automatic setup of plugins, wraps the component in VApp, and adds more options.
 *
 * Adds an 'initialState' option to set the initial state of pinia stores by id.
 * See https://pinia.vuejs.org/cookbook/testing.html#initial-state for more information
 *
 * See https://testing-library.com/docs/vue-testing-library/api#rendercomponent-options
 * for more information on the render function.
 *
 * @param {import('vue').Component} Component A Vue Component
 * @param {RenderWrapperOptions} options
 * @returns {import('@testing-library/vue').RenderResult} helper methods
 */
export function renderWrapper(
  Component,
  { initialState, initialRoute, props, ...otherOptions } = {}
) {
  // Make sure the component is not wrapped in a proxy (performance optimization and vue 3 suggestion)
  markRaw(Component)

  // Use Pinia helpers to create auto-resetting stores
  const pinia = createTestingPiniaWrapper({ initialState })

  // Vue router 4 has async caveats that make it complicated to use with testing-library
  // We're adding it so the <router-link> component works, but anything else (useRouter etc.) may fail
  // unless handling the async nature of the router within each test.
  // see https://test-utils.vuejs.org/guide/advanced/vue-router.html
  const router = createRouter({
    ...createRouterConfig(),
    history: createMemoryHistory()
  })

  // Collect all our plugins
  const plugins = [vueDompurifyHTMLPlugin, i18n, vuetify, pinia, router]

  /** https://testing-library.com/docs/vue-testing-library/api */
  return {
    ...render(VAppWrapper, {
      global: { plugins },
      props: { is: Component, ...props },
      ...otherOptions
    })
  }
}