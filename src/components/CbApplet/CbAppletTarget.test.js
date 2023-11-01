import { mount } from '@vue/test-utils'
import { mergeDeepLeft } from 'ramda'
import { expect, test, vi } from 'vitest'
import { ref } from 'vue'
import { createVuetify } from 'vuetify'
import { createTestingPiniaWrapper } from '@/testing/testUtils'
import CbAppletTarget from './CbAppletTarget.vue'

/**
 * This file tests and mocks differently than all our other tests.
 * Usually we want to use testing-library to test the rendered result of our components.
 * Here's we just want to know that each CbApplet will get the correct props, which requires
 * lower-level testing that doesn't require rendering and looks more like a traditional
 * vue unit test.
 */

// Mock i18n
vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: vi.fn(() => 'test') })
  }
})

// Mock the applets store to return a single mock applet
const mockApplet = {
  id: 'APL-vwddynrk',
  targets: {
    cui: {
      resourceDetail: ['postActions', 'all'],
      all: ['preNavItems', 'header', 'all']
    }
  },
  entryComponent: '/main.es.js'
}

vi.mock('@/stores/applets', () => ({
  useAppletsStore: () => ({
    fetchApplets: vi.fn().mockResolvedValue([mockApplet]),
    getAppletsForTarget: vi.fn(() => [mockApplet])
  })
}))

// Mock the way CbApplet imports the entry component
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  const dummyComponent = {
    name: 'DummyComponent',
    render: () => {}
  }
  return {
    ...actual,
    defineAsyncComponent: vi.fn().mockResolvedValue(dummyComponent)
  }
})

/** Mount the CbAppletTarget, return the wrapper and CbApplet component to test */
const mountApplet = (options = {}) => {
  const vuetify = createVuetify()
  const pinia = createTestingPiniaWrapper()
  const defaultOptions = {
    props: {
      area: 'testArea',
      page: 'testPage',
      context: { hello: 'world' },
      additionalProp: 'test',
      useUserStore: () => ({ username: ref('John Doe') }),
      pinia,
      api: { default: { get: vi.fn() } }
    },
    global: {
      plugins: [vuetify]
    }
  }
  const combinedOptions = mergeDeepLeft(options, defaultOptions)
  const wrapper = mount(CbAppletTarget, combinedOptions)

  const cbApplet = wrapper.findComponent({
    name: 'CbApplet'
  }).vm

  return { wrapper, cbApplet }
}

test('sets the area prop correctly', () => {
  const { cbApplet } = mountApplet()
  expect(cbApplet.$props.area).toBe('testArea')
})

test('sets the context prop correctly', () => {
  const { cbApplet } = mountApplet()
  expect(cbApplet.$props.context).toEqual({ hello: 'world' })
})

test('sets the id prop correctly', () => {
  const { cbApplet } = mountApplet()
  expect(cbApplet.$props.id).toBe('APL-vwddynrk')
})

test('sets the page prop correctly', () => {
  const { cbApplet } = mountApplet()
  expect(cbApplet.$props.page).toBe('testPage')
})

test('sets the additionalProp attr correctly via v-bind', () => {
  const { cbApplet } = mountApplet()
  expect(cbApplet.$attrs.additionalProp).toBe('test')
})
