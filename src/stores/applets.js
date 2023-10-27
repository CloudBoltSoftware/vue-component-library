import { defineStore } from 'pinia'
import { computed, ref, toValue } from 'vue'
import api from '@/api'

/**
 * @typedef {object} Applet
 *
 * There are more properties than this, but these are the ones we care about
 * See all at https://app.swaggerhub.com/apis/cloudbolt/cmp-applets/develop#/Applets/get_applets__id__
 *
 * @property {string} id
 * @property {string} label
 * @property {AppletTarget} targets - the targets for the applet
 * @property {string} entryComponent - the url of the vue component for the applet
 * @property {boolean} enabled - whether the applet is enabled
 */

/**
 * @typedef {object} AppletTarget
 * @property {object} cui - the cui targets for the applet
 * @property {string[]} cui.all - the cui target areas for the applet on every page
 * @property {string[]|Object[]} cui.[page] - the cui target areas for the applet on a specific page
 * @property {object} hui - the hui targets for the applet
 * @property {string[]} hui.all - the hui target areas for the applet on every page
 * @property {string[]|Object[]} hui.[page] - the hui target areas for the applet on a specific page
 *   If the area allows configuration, it will be an array of objects with other properties
 */

/**
 * An map of applets by target area
 * @typedef {Object.<string, Applet[]>} AppletAreaMap
 */

/**
 * A configuration object for a specific applet target.
 * Could have any properties, depending on the target.
 * @typedef {Object} AppletTargetConfig
 */

/**
 * A nested map of applets by target page and area (or just page to array of applets)
 * @typedef {Object.<string, AppletAreaMap|AppletTargetConfig[]>} AppletTargetMap
 */

/** Pulled from the pinia AlertStore
 * @typedef Alert
 * @type {object}
 *
 * Properties to determine the widget identity
 * @property {number} id the unique id of the alert
 * @property {string} type type of alert
 * @property {string} message the message to display
 * @property {boolean} closable whether the alert is closable
 * @property {number} timeout the amount of time to display the alert
 * @property {number} timeoutId the id of the timeout
 */

export const useAppletsStore = defineStore('applets', () => {
  const useAlertStore = ref(undefined)

  /** @type {Applet[]} */
  const applets = ref([])

  /** @type {string} */
  const appletVersion = ref('cui')

  /** @type {boolean} */
  const isLoading = ref(false)

  /** @type {boolean} */
  const hasLoaded = ref(false)

  /** @type {Alert|null} */
  const appletError = ref(null)

  /** @type {import('vue').ComputedRef<Applet[]>} */
  const appletsEnabled = computed(() =>
    applets.value.filter((applet) => applet.enabled)
  )

  /**
   * Use the pinia AlertStore if it exists, otherwise log to console
   */
  const alertStoreExists = computed(() => useAlertStore.value != undefined && useAlertStore.value() )
  const addErrorAlert = computed(() => alertStoreExists.value ? useAlertStore.value().addErrorAlert : console.error)
  const addInfoAlert = computed(() => alertStoreExists.value ? useAlertStore.value().addInfoAlert : console.log)
  const addSuccessAlert = computed(() => alertStoreExists.value ? useAlertStore.value().addSuccessAlert : console.log)
  const removeAlertById = computed(() => alertStoreExists.value ? useAlertStore.value().removeAlertById : () => {})

  /**
   * The href for the css file for each enabled applet (deduplicated)
   * The css should always be the file "style.css" in the same directory as the entry
   * @type {import('vue').ComputedRef<string[]>}
   */
  const appletsCssHrefs = computed(() => {
    const hrefs = appletsEnabled.value
      .map((applet) => applet.entryComponent)
      // Split off the filename and replace it with "style.css"
      .map((entryComponent) => entryComponent.replace(/\/[^/]+$/, '/style.css'))

    const uniqueHrefs = [...new Set(hrefs)]
    return uniqueHrefs
  })

  /**
   * An efficient lookup object for enabled applets by target page and area.
   * If the area is a string, it will be a direct lookup.
   * If the area is an object, it will be an array on the page property.
   * @returns {import('vue').ComputedRef<AppletTargetMap>}
   */
  const appletsMap = computed(() => {
    const map = {}
    appletsEnabled.value.forEach((applet) => {
      const cuiTargets = applet.targets?.cui || {}
      const huiTargets = applet.targets?.hui || {}
      const appletTargets = appletVersion.value === 'cui' ? cuiTargets : huiTargets
      Object.entries(appletTargets).forEach(([page, areas]) => {
        areas.forEach((area) => {
          if (typeof area === 'string') {
            // The area might be a string to point to a specific area,
            // So make it directly accessible by that string
            if (!map[page]) map[page] = {}
            if (!map[page][area]) map[page][area] = []
            map[page][area].push(applet)
          } else {
            // Otherwise the area is an object with other configuration
            // So make put it in an array on the page
            if (!map[page]) map[page] = []
            map[page].push(applet)
          }
        })
      })
    })
    return map
  })

  /**
   * An efficient lookup object for applets by id
   * @returns {import('vue').ComputedRef<object.<string, Applet>>}
   */
  const appletsMapById = computed(() =>
    applets.value.reduce((map, applet) => {
      map[applet.id] = applet
      return map
    }, {})
  )

  /**
   * Returns the applet with the given id, or undefined if not found
   * @param {string} id
   * @returns {Applet}
   */
  const getApplet = (id) => appletsMapById.value[id]

  /**
   * Fetches applets from the API and stores them in the applets ref
   * Makes sure to only fetch once
   * @param {object} [options]
   * @param {string} [options.loadingMessage] message to display while loading
   * @param {string} [options.loadedMessage] message to display when loaded
   * @param {string} [options.errorMessage] message to display on error
   */
  const fetchApplets = async (options = {}) => {
    if (hasLoaded.value || isLoading.value) return
    
    isLoading.value = true
    let loadingAlert = {}
    if (options.loadingMessage)
      loadingAlert = addInfoAlert.value(options.loadingMessage)

    try {
      const data = await api.v3.cmp.applets.list()
      applets.value = data?.items || []
    } catch (error) {
      appletError.value = addErrorAlert.value(
        options.errorMessage || 'Failed to fetch applets',
        error
      )
    }

    appletError.value = null
    isLoading.value = false
    hasLoaded.value = true
    if (loadingAlert.id) removeAlertById.value(loadingAlert.id)
    if (options.loadedMessage) addSuccessAlert.value(options.loadedMessage)
  }

  /**
   * Returns the applets that target the given page and area
   * @param {import('vue').MaybeRefOrGetter<string>} targetPage or 'all'
   * @param {import('vue').MaybeRefOrGetter<string>} targetArea or 'all'
   * @returns {Applet[]}
   */
  const getAppletsForTarget = (targetPage, targetArea) => {
    const page = toValue(targetPage)
    const area = toValue(targetArea)
    const allPossibleTargetApplets = [
      ...(appletsMap.value[page]?.[area] || []),
      ...(appletsMap.value[page]?.all || []),
      ...(appletsMap.value.all?.[area] || []),
      ...(appletsMap.value.all?.all || [])
    ]
    const uniqueTargetApplets = [...new Set(allPossibleTargetApplets)]
    return uniqueTargetApplets
  }

  return {
    appletError,
    applets,
    appletsCssHrefs,
    appletsEnabled,
    appletsMap,
    appletVersion,
    useAlertStore,
    getApplet,
    fetchApplets,
    getAppletsForTarget,
    hasLoaded,
    isLoading
  }
})
