import { defineStore } from 'pinia'
import { ref } from 'vue'

let id = 1
const createId = () => id++

/**
 * Alert default values
 */
export const DEFAULT_ALERT = {
  type: 'info',
  message: '',
  closable: true,
  timeout: 6 * 1000 // 6 seconds
}

/**
 * @typedef Alert
 * @type {object}
 *
 * Properties to determine the widget identity
 * @property {number} id the unique id of the alert
 * @property {(info|success|warning|error)} type type of alert
 * @property {string} message the message to display
 * @property {boolean} closable whether the alert is closable
 * @property {number} timeout the amount of time to display the alert
 * @property {number} timeoutId the id of the timeout
 */

/**
 * Available alert types
 *
 * @readonly
 * @enum {string}
 */
export const ALERT_TYPES = new Set(['info', 'success', 'warning', 'error'])

/**
 * Pinia Alerts store
 */
export const useAlertStore = defineStore('alert', () => {
  /** @type {Alert[]} */
  const alerts = ref([])

  /**
   * Create a new alert from an object. See DEFAULT_ALERT for the defaults.
   *
   * @param {object} alert the alert to add
   * @param {string} alert.type the type of alert. Choices are 'info', 'success', 'warning', 'error'
   * @param {string} alert.message the message to display
   * @param {boolean} alert.closable whether the alert is closable
   * @param {number} alert.timeout the timeout in milliseconds before the alert is automatically dismissed. 0 means no timeout.
   * @param {object} routeOptions details of the route
   * @param {string} routeOptions.id id of the selected route
   * @param {string} routeOptions.name name of the selected route
   * @returns {Alert} the newly created alert
   */
  const addAlert = (alert, routeOptions) => {
    const id = createId()
    const newAlert = routeOptions
      ? { ...DEFAULT_ALERT, id, ...alert, routeOptions }
      : { ...DEFAULT_ALERT, id, ...alert }

    if (!ALERT_TYPES.has(newAlert.type))
      throw Error('Invalid alert type: ' + newAlert.type)

    // doubling up the timeout as we want to give the users time to click on it.
    if (newAlert.type === 'success' && routeOptions) {
      newAlert.timeout = routeOptions.to?.params?.id
        ? newAlert.timeout * 2
        : newAlert.timeout
    }

    if (newAlert.timeout > 0)
      newAlert.timeoutId = setTimeout(
        () => removeAlertById(id),
        newAlert.timeout
      )

    alerts.value = [...alerts.value, newAlert]
    return newAlert
  }

  /**
   * Create a new info alert with default options. For more flexibility, use addAlert.
   *
   * @param {string} message the message to display
   * @returns {Alert} the newly created alert
   */
  const addInfoAlert = (message) => addAlert({ type: 'info', message })

  /**
   * Create a new success alert with default options. For more flexibility, use addAlert.
   *
   * @param {string} message the message to display
   * @returns {Alert} the newly created alert
   */
  const addSuccessAlert = (message, routeOptions = null) =>
    addAlert({ type: 'success', message }, routeOptions)

  /**
   * Create a new warning alert with default options. For more flexibility, use addAlert.
   * If an error is passed in, will console.warn it.
   *
   * Skip warnings that are caused by the user navigating away from the page
   *
   * @param {string} message the message to display
   * @param {Error} [null] error the error to display
   * @param error
   * @returns {Alert|void} the newly created alert if there was one
   */
  const addWarningAlert = (message, error = null) => {
    if (!error?.__CANCEL__) {
      // eslint-disable-next-line no-console
      if (error) console.warn(error)
      return addAlert({ type: 'warning', message })
    }
  }

  /**
   * Create a new error alert with no timeout. For more flexibility, use addAlert.
   * If an error is passed in, will console.error it.
   *
   * Skip errors that are caused by the user navigating away from the page
   *
   * @param {string} message the message to display
   * @param {Error} [null] error the error to display (optional)
   * @param error
   * @returns {Alert|void} the newly created alert if one was created
   */
  const addErrorAlert = (message, error = null) => {
    if (!error?.__CANCEL__) {
      // eslint-disable-next-line no-console
      if (error) console.error(error)
      return addAlert({
        type: 'error',
        message,
        timeout: 0,
        icon: 'mdi-cancel'
      })
    }
  }

  /**
   * Get a specific alert by id.
   *
   * @param {string} id the id of the
   * @returns {Alert|undefined} the alert with the given id
   */
  const getAlertById = (id) => alerts.value.find((alert) => alert.id === id)

  /**
   * Update an alert, or create one if not found. Searches for the alert by id.
   *
   * @param {object} alert the alert to update
   * @param {string} alert.id the id of the alert to update
   * @param {string} alert.type the type of alert. Choices are 'info', 'success', 'warning', 'error'
   * @param {string} alert.message the message to display
   * @param {boolean} alert.closable whether the alert is closable
   * @param {number} alert.timeout the timeout in milliseconds before the alert is automatically dismissed. 0 means no timeout.
   * @returns {Alert} the updated/created alert
   */
  const updateAlert = (alert) => {
    const existingAlert = getAlertById(alert.id)
    if (existingAlert) {
      const updatedAlert = { ...existingAlert, ...alert }
      alerts.value = alerts.value.map((a) =>
        a.id === alert.id ? updatedAlert : a
      )
      return updatedAlert
    } else {
      return addAlert(alert)
    }
  }

  /**
   * Remove all alerts.
   */
  const clearAlerts = () => (alerts.value = [])

  /**
   * Remove an alert by id.
   *
   * @param {string} id the id of the alert to remove
   * @returns {Alert|void} the removed alert
   */
  const removeAlertById = (id) => {
    const existingAlert = getAlertById(id)
    if (existingAlert) {
      clearTimeout(existingAlert.timeoutId)
      alerts.value = alerts.value.filter((a) => a.id !== id)
      return existingAlert
    }
  }

  return {
    alerts,
    addAlert,
    addInfoAlert,
    addSuccessAlert,
    addWarningAlert,
    addErrorAlert,
    getAlertById,
    updateAlert,
    clearAlerts,
    removeAlertById
  }
})
