import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { setRealPiniaToDefaults } from '@/testing/testUtils'
import CbApplet from './CbApplet.vue'
import { useAppletsStore } from '@/stores/applets'

/**
 * This file tests and mocks differently than most of our other tests.
 * Usually we want to use testing-library to test the rendered result of our components.
 * Here's we just want to know that the applet will get the correct props, which requires
 * lower-level testing that doesn't require rendering and looks more like a traditional
 * vue unit test.
 */

// mock timers like setTimeout for these tests
beforeAll(() => vi.useFakeTimers())
afterAll(() => vi.useRealTimers())

// Mock the useRoute function
vi.mock('vue-router', async () => ({
  ...(await vi.importActual('vue-router')),
  useRoute: () => ({ name: 'testPage' })
}))

// Mock the useThemeStore function
// vi.mock('./stores/theme', () => ({
//   useThemeStore: vi.fn(() => ({ color: 'blue' }))
// }))

// Mock the useUserStore function
vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => ({ name: 'John Doe' }))
}))

// Mock the api to something simpler to test for than that in __mocks__
vi.mock('@/api', () => ({ default: { get: vi.fn() } }))

// Mock the way CbApplet imports the entry component
const MockComponent = defineComponent({
  name: 'AsyncComponentWrapper',
  // eslint-disable-next-line vue/require-prop-types
  props: ['page', 'area', 'api', 'user', 'theme', 'context'],
  // emit "configure" event after 30s so we can test that it's passed to the applet
  emits: ['configure'],
  mounted() {
    setTimeout(() => this.$emit('configure'), 30000)
  },
  // eslint-disable-next-line @intlify/vue-i18n/no-raw-text
  template: /* html */ `<div>Mocked AsyncComponentWrapper</div>`
})
vi.mock('vue', async () => ({
  ...(await vi.importActual('vue')),
  defineAsyncComponent: () => MockComponent
}))

const setUpStore = () => {
  setRealPiniaToDefaults()
  const appletsStore = useAppletsStore()
  appletsStore.applets = [
    {
      id: 'APL-123',
      enabled: true,
      targets: { cui: { testPage: ['prepend'] } }
    }
  ]
}

/** Mount the applet, return the wrapper and Applet component to test */
const mountApplet = async (props = {}) => {
  setUpStore()
  const wrapper = mount(CbApplet, {
    props: {
      id: 'APL-123',
      page: 'testPage',
      area: 'testArea',
      context: { test: 'context' },
      ...props
    }
  })

  // Wait for the async component to resolve
  await vi.dynamicImportSettled()
  await flushPromises()

  const applet = wrapper.findComponent({
    name: 'AsyncComponentWrapper'
  }).vm

  return { wrapper, applet }
}

test('includes the imported component', async () => {
  const { applet } = await mountApplet()
  expect(applet).toBeDefined()
})

test('sets the page prop correctly', async () => {
  const { applet } = await mountApplet()
  expect(applet.$props.page).toBe('testPage')
})

test('sets the area prop correctly', async () => {
  const { applet } = await mountApplet()
  expect(applet.$props.area).toBe('testArea')
})

test('sets the api prop correctly', async () => {
  const { applet } = await mountApplet()
  expect(applet.$props.api.get).toBeDefined()
})

test('sets the user prop correctly', async () => {
  const { applet } = await mountApplet()
  expect(applet.$props.user).toEqual({ name: 'John Doe' })
})

test.skip('sets the theme prop correctly', async () => {
  const { applet } = await mountApplet()
  expect(applet.$props.theme).toEqual({ color: 'blue' })
})

test('sets the context prop correctly', async () => {
  const { applet } = await mountApplet()
  expect(applet.$props.context).toEqual({ test: 'context' })
})

describe('configure event', () => {
  test('runs the "configure" event when listener is defined', async () => {
    // Setting the onConfigure prop will cause the applet to listen for the configure event
    // similar to an @configure event listener in the applet's template
    const onConfigure = vi.fn()
    await mountApplet({ onConfigure })

    // Skip the 30s timeout
    vi.runAllTimers()

    // Clear the vue stack to allow the configure event to run
    await nextTick()

    expect(onConfigure).toHaveBeenCalledOnce()
  })

  test('console.logs help when listener is not defined', async () => {
    vi.spyOn(console, 'log')
    await mountApplet()

    // Skip the 30s timeout
    vi.runAllTimers()

    // Clear the vue stack to allow the configure event to run
    await nextTick()

    expect(console.log).toHaveBeenCalledWith(
      'The applet "APL-123" on page "testPage", area "testArea" has no configuration options available.'
    )
  })
})
