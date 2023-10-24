import { clone } from 'ramda'

/**
 * Pinia plugin to allow setup stores to be resettable with store.$reset()
 * Adapted from https://dev.to/the_one/pinia-how-to-reset-stores-created-with-functionsetup-syntax-1b74
 */
export default function piniaPluginSetupStoreReset({ store }) {
  const initialState = clone(store.$state)
  // we came across the issue mentioned here, https://github.com/vuejs/pinia/issues/2090
  // and followed the solution provided by the community
  store.$reset = () => {
    store.$patch(($state) => {
      Object.assign($state, initialState)
    })
  }
}
