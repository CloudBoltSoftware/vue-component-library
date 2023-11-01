import { expect, it } from 'vitest'
import { renderWrapper } from '@/testing/testUtils'
import TheCbAppletStyles from './TheCbAppletStyles.vue'
import { useAppletsStore } from '@/stores/applets.js'

// TODO - [Vue warn]: A plugin must either be a function or an object with an "install" function.
// For renderWrapper
const mockApplet = {
  id: 'APL-vwddynrk',
  targets: {
    cui: {
      resourceDetail: ['postActions', 'all'],
      all: ['preNavItems', 'header', 'all']
    }
  },
  enabled: true,
  entryComponent: '/static/uploads/applets/cui-applet/cui-applet/static/main.es.js'
}

const renderComponent = (applets = []) => {
  const renderResult = renderWrapper(TheCbAppletStyles)

  // renderWrapper initializes a new pinia store, so we need to add the applets afterwards
  const store = useAppletsStore()
  applets.forEach((applet) => store.applets.push(applet))

  return renderResult
}

it('renders without crashing', () => {
  renderComponent()
})

it('renders a single applet style', async () => {
  const { findByTestId } = renderComponent([mockApplet])
  const expectedHref = '/static/uploads/applets/cui-applet/cui-applet/static/style.css'
  const link = await findByTestId('applet-css')
  expect(link).toHaveAttribute('href', expectedHref)
  expect(link).toHaveAttribute('rel', 'stylesheet')
})

it("doesn't render duplicate applet styles", async () => {
  const { findByTestId } = renderComponent([mockApplet, mockApplet])
  // findBy... rejects if more than one is found
  await findByTestId('applet-css')
})
