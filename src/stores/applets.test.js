import { beforeEach, describe, expect, test } from 'vitest'
import api from '@/api'
import { setRealPiniaToDefaults } from '../testing/testUtils'
import { useAppletsStore } from './applets'

// Define a mock applet object to use in tests
const mockApplet = {
  id: 'APL-vwddynrk',
  targets: {
    cui: {
      resourceDetail: ['postActions', 'all'],
      all: ['preNavItems', 'header', 'all'],
      resourceDetailsTabs: [{}]
    }
  },
  enabled: true,
  entryComponent:
    '/static/uploads/applets/cui-applet/cui-applet/static/main.es.js'
}

describe('initial state', () => {
  beforeEach(setRealPiniaToDefaults)

  // Define expected initial states for each property in the applets store
  const expectedInitialStates = [
    ['applets', []],
    ['appletError', null],
    ['isLoading', false],
    ['hasLoaded', false]
  ]

  // Test that each property in the applets store has the expected initial state
  test.each(expectedInitialStates)('for %s should be %s', (prop, value) => {
    expect(useAppletsStore()[prop]).toEqual(value)
  })
})

describe('appletsEnabled', () => {
  let store
  beforeEach(() => {
    setRealPiniaToDefaults()
    store = useAppletsStore()
  })

  // Test that appletsEnabled contains the mock applet when it is enabled
  test('contains enabled applets', () => {
    store.applets.push(mockApplet)
    expect(store.appletsEnabled).toContainEqual(mockApplet)
  })

  // Test that appletsEnabled does not contain the mock applet when it is disabled
  test('does not contain disabled applets', () => {
    const disabledApplet = { ...mockApplet, enabled: false }
    store.applets.push(disabledApplet)
    expect(store.appletsEnabled).not.toContainEqual(disabledApplet)
  })
})

describe('appletsMap', () => {
  // Test that the appletsMap only contains enabled applets
  describe("doesn't contain disabled applets", () => {
    setRealPiniaToDefaults()
    const store = useAppletsStore()
    const disabledApplet = { ...mockApplet, enabled: false }
    store.applets.push(disabledApplet)

    const tests = [
      ['all.all', store.appletsMap.all?.all],
      ['all.area', store.appletsMap.all?.preNavItems],
      ['page.all', store.appletsMap.resourceDetail?.all],
      ['page.area', store.appletsMap.resourceDetail?.postActions]
    ]

    test.each(tests)('does not map %s targets', (key, value) => {
      expect(value).toBeUndefined()
    })
  })

  // Test that each target in the appletsMap contains the mock applet
  describe('shows targets in the right places', () => {
    setRealPiniaToDefaults()
    const store = useAppletsStore()
    store.applets.push(mockApplet)

    const tests = [
      ['all.all', store.appletsMap.all.all],
      ['all.area', store.appletsMap.all.preNavItems],
      ['page.all', store.appletsMap.resourceDetail.all],
      ['page.area', store.appletsMap.resourceDetail.postActions],
      ['area configuration object', store.appletsMap.resourceDetailsTabs]
    ]

    test.each(tests)('maps %s targets', (key, value) => {
      expect(value).toContainEqual(mockApplet)
    })
  })

  // Test that each target in the appletsMap does not contain applets it shouldn't
  describe("doesn't show targets in the wrong places", () => {
    setRealPiniaToDefaults()
    const store = useAppletsStore()
    const targetlessApplet = {
      ...mockApplet,
      targets: { cui: {} }
    }
    store.applets.push(targetlessApplet)

    const tests = [
      ['all.all', store.appletsMap.all?.all],
      ['all.area', store.appletsMap.all?.preNavItems],
      ['page.all', store.appletsMap.resourceDetail?.all],
      ['page.area', store.appletsMap.resourceDetail?.postActions],
      ['area configuration object', store.appletsMap?.resourceDetailsTabs?.[0]]
    ]

    test.each(tests)('does not map %s targets', (key, value) => {
      expect(value).toBeUndefined()
    })
  })
})

describe('getAppletsForTarget', () => {
  let store
  beforeEach(() => {
    setRealPiniaToDefaults()
    store = useAppletsStore()
  })

  describe('when an applet targets a particular page and area', () => {
    const applet = {
      ...mockApplet,
      targets: { cui: { resourceDetail: ['postActions'] } }
    }
    beforeEach(() => store.applets.push(applet))

    test('returns applets that target the given page and area', () => {
      const applets = store.getAppletsForTarget('resourceDetail', 'postActions')
      expect(applets).toContainEqual(applet)
    })

    test("doesn't return applets that don't target the given area", () => {
      const applets = store.getAppletsForTarget('resourceDetail', 'header')
      expect(applets).not.toContainEqual(applet)
    })

    test("doesn't return applets that don't target the given page", () => {
      const applets = store.getAppletsForTarget('anotherPage', 'postActions')
      expect(applets).not.toContainEqual(applet)
    })
  })

  describe('when an applet targets a particular page and all areas', () => {
    const applet = {
      ...mockApplet,
      targets: { cui: { resourceDetail: ['all'] } }
    }
    beforeEach(() => store.applets.push(applet))

    test('returns applets that target the given page and any area', () => {
      const applets = store.getAppletsForTarget('resourceDetail', 'postActions')
      expect(applets).toContainEqual(applet)
    })

    test("doesn't return an applet that targets a different page", () => {
      const applets = store.getAppletsForTarget('anotherPage', 'postActions')
      expect(applets).not.toContainEqual(applet)
    })
  })

  describe('when an applet targets all pages and a particular area', () => {
    const applet = {
      ...mockApplet,
      targets: { cui: { all: ['postActions'] } }
    }
    beforeEach(() => store.applets.push(applet))

    test('returns applets that target the given page and area', () => {
      const applets = store.getAppletsForTarget('resourceDetail', 'postActions')
      expect(applets).toContainEqual(applet)
    })

    test("doesn't return an applet that targets a different area", () => {
      const applets = store.getAppletsForTarget('resourceDetail', 'header')
      expect(applets).not.toContainEqual(applet)
    })
  })

  describe('when an applet targets all pages and all areas', () => {
    const applet = {
      ...mockApplet,
      targets: { cui: { all: ['all'] } }
    }
    beforeEach(() => store.applets.push(applet))

    test('returns applets that target any page and area', () => {
      const applets = store.getAppletsForTarget('resourceDetail', 'postActions')
      expect(applets).toContainEqual(applet)
    })
  })

  test("doesn't get duplicates even if applet targets multiple places", () => {
    store.applets.push(mockApplet)
    const applets = store.getAppletsForTarget('resourceDetail', 'postActions')
    expect(applets).toHaveLength(1)
  })
})

describe('fetchApplets', () => {
  beforeEach(() => {
    setRealPiniaToDefaults()
    const mockAppletList = { items: [mockApplet] }
    api.v3.cmp.applets.list.mockResolvedValue(mockAppletList)
  })

  // Test that isLoading gets set properly
  test('sets isLoading to true while runninng', async () => {
    const store = useAppletsStore()
    store.fetchApplets()
    expect(store.isLoading).toBe(true)
  })

  test('sets isLoading to false when done', async () => {
    const store = useAppletsStore()
    await store.fetchApplets()
    expect(store.isLoading).toBe(false)
  })

  // Test that hasLoaded is set to true when fetchApplets is done
  test('sets hasLoaded to true when done', async () => {
    const store = useAppletsStore()
    await store.fetchApplets()
    expect(store.hasLoaded).toBe(true)
  })

  // Test that the API endpoint is called properly
  test('calls the API endpoint', async () => {
    const store = useAppletsStore()
    await store.fetchApplets()
    expect(api.v3.cmp.applets.list).toHaveBeenCalled()
  })

  test('only calls the API endpoint once', async () => {
    const store = useAppletsStore()
    await store.fetchApplets()
    await store.fetchApplets()
    expect(api.v3.cmp.applets.list).toHaveBeenCalledOnce()
  })

  // Test that applets is set to the response from the API endpoint
  test('sets applets to the response', async () => {
    const store = useAppletsStore()
    await store.fetchApplets()
    expect(store.applets).toContainEqual(mockApplet)
  })
})

describe('appletsCssHrefs', () => {
  let store = useAppletsStore()
  beforeEach(() => {
    setRealPiniaToDefaults()
    store = useAppletsStore()
  })

  test('returns an empty array if there are no applets', () => {
    expect(store.appletsCssHrefs).toEqual([])
  })

  test('returns an empty arrayif there is one disabled applet', () => {
    store.applets.push({ ...mockApplet, enabled: false })
    expect(store.appletsCssHrefs).toEqual([])
  })

  test('returns an array with one element if there is one enabled applet', () => {
    store.applets.push(mockApplet)
    expect(store.appletsCssHrefs).toHaveLength(1)
  })

  test('sets the href to the applet css url based on the entryComponent', () => {
    store.applets.push(mockApplet)
    const expectedCssHref =
      '/static/uploads/applets/cui-applet/cui-applet/static/style.css'
    expect(store.appletsCssHrefs[0]).toEqual(expectedCssHref)
  })

  test("can't contain duplicates", () => {
    store.applets.push(mockApplet)
    store.applets.push(mockApplet)
    expect(store.appletsCssHrefs).toHaveLength(1)
  })
})

describe('getApplet', () => {
  test('returns the applet with the given id', () => {
    const store = useAppletsStore()
    store.applets.push(mockApplet)
    const applet = store.getApplet('APL-vwddynrk')
    expect(applet).toEqual(mockApplet)
  })

  test('returns undefined if there is no applet with the given id', () => {
    const store = useAppletsStore()
    store.applets.push(mockApplet)
    const applet = store.getApplet('APL-123')
    expect(applet).toBeUndefined()
  })
})
