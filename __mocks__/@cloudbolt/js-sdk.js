import { vi } from 'vitest'

function mockService() {
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
  // We are basically creating an object that creates a vi.fn for any arbitrary accessed property
  return new Proxy(
    {},
    {
      get(obj, prop) {
        if (!(prop in obj)) obj[prop] = vi.fn()
        return obj[prop]
      }
    }
  )
}

// Add to this as necessary to mock out the apis used in this repo
export const createApi = () => ({
  base: {
    instance: mockService(),
    crud: mockService(),
    // we don't need to mock helpers, so lets grab the real ones
    helpers: vi.importActual('@cloudbolt/js-sdk/src/api/helpers'),
    setAuthHeader: vi.fn(),
    clearAuthHeader: vi.fn(),
    setErrorHandler: vi.fn(),
    setAbortController: vi.fn(),
    getAbortController: vi.fn(),
    removeAbortController: vi.fn()
  },
  v3: {
    cmp: {
      alerts: mockService(),
      apiToken: mockService(),
      applets: mockService(),
      applicationRates: mockService(),
      blueprintCategories: mockService(),
      blueprints: mockService(),
      blueprintFilters: mockService(),
      brandedPortals: mockService(),
      catalogBlueprints: mockService(),
      citService: mockService(),
      dataTableTypes: mockService(),
      dataTableSettings: mockService(),
      environments: mockService(),
      eula: mockService(),
      groups: mockService(),
      histories: mockService(),
      jobs: mockService(),
      licensing: mockService(),
      logging: mockService(),
      miscellaneousSettings: mockService(),
      orders: mockService(),
      osBuildRates: mockService(),
      osBuilds: mockService(),
      parameterRates: mockService(),
      parameters: mockService(),
      permissions: mockService(),
      productInfo: mockService(),
      productLicenses: mockService(),
      rateSettings: mockService(),
      resourceActions: mockService(),
      resourceHandlers: mockService(),
      resources: mockService(),
      resourcesStructured: mockService(),
      resourceTypes: mockService(),
      roles: mockService(),
      serverSummary: mockService(),
      servers: mockService(),
      serverActions: mockService(),
      system: mockService(),
      uiExtensionComponents: mockService(),
      users: mockService()
    },
    dashboard: {
      announcements: mockService(),
      widgets: mockService(),
      getBlueprints: vi.fn(),
      getEnvironments: vi.fn(),
      getEvents: vi.fn(),
      getGroups: vi.fn(),
      getJobs: vi.fn(),
      getOrders: vi.fn(),
      getReports: vi.fn(),
      getServers: vi.fn(),
      postOrderAction: vi.fn()
    }
  }
})
