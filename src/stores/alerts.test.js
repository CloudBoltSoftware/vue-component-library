import { beforeEach, describe, expect, test, vi } from 'vitest'
import { setRealPiniaToDefaults } from '../testing/testUtils'
import { useAlertStore } from './alerts'

describe('initial state', () => {
  beforeEach(setRealPiniaToDefaults)

  // Define expected initial states for each property in the applets store
  const expectedInitialStates = [['alerts', []]]

  // Test that each property in the applets store has the expected initial state
  test.each(expectedInitialStates)('for %s should be %s', (prop, value) => {
    expect(useAlertStore()[prop]).toEqual(value)
  })
})

describe('test addAlert', () => {
  // Test that the addAlert function behaves properly
  describe('properly creates a new alert', () => {
    setRealPiniaToDefaults()
    const store = useAlertStore()
    const testAlert = {
      type: 'info',
      message: '',
      closable: true
    }

    test('addAlert creates an alert that matches the input', () => {
      const alertResponse = store.addAlert(testAlert)
      expect(alertResponse).toMatchObject({
        type: 'info',
        message: '',
        closable: true
      })
    })
    test('addAlert uses the default alert for missing input', () => {
      const alertResponse = store.addAlert({ message: 'hello' })
      expect(alertResponse).toMatchObject({
        type: 'info',
        message: 'hello'
      })
    })
    test('addAlert creates an alert with the input route options', () => {
      const routeOptions = {
        to: {
          params: {
            id: '5'
          }
        }
      }
      const alertResponse = store.addAlert(testAlert, routeOptions)
      expect(alertResponse).toMatchObject({ routeOptions })
    })
    test('after three addAlert calls there are three entries in alerts array', () => {
      expect(store.alerts).toHaveLength(3)
    })
  })

  describe('throws error with invalid alert types', () => {
    const store = useAlertStore()
    const invalidALERT = {
      type: 'foghorn',
      message: ''
    }
    test('error message contains alert type', () => {
      expect(() => store.addAlert(invalidALERT)).toThrowError('Invalid alert type: foghorn')
    })
  })

  describe('test basic alert creation', () => {
    const store = useAlertStore()

    test('addInfoAlert works as expected', () => {
      expect(store.addInfoAlert('welcome')).toMatchObject({
        type: 'info',
        message: 'welcome'
      })
    })
    test('addSuccessAlert works as expected', () => {
      expect(store.addSuccessAlert('first')).toMatchObject({
        type: 'success',
        message: 'first'
      })
    })
    test('addWarningAlert works as expected', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(store.addWarningAlert('problem', 'mismatch')).toMatchObject({
        type: 'warning',
        message: 'problem'
      })
      expect(warn).toBeCalledWith('mismatch')
      warn.mockReset()
    })
    test('addErrorAlert works as expected', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(store.addErrorAlert('broken', 'missing')).toMatchObject({
        type: 'error',
        message: 'broken'
      })
      expect(error).toBeCalledWith('missing')
      error.mockReset()
    })
    // Running this here since there are several alerts added from this test
    test('test clearAlerts works properly', () => {
      expect(store.alerts).toHaveLength(7)
      store.clearAlerts()
      expect(store.alerts).toHaveLength(0)
    })
  })
})

describe('test updateAlert', () => {
  // Test that the updateAlert function behaves properly
  describe('properly updates an existing alert', () => {
    setRealPiniaToDefaults()
    const store = useAlertStore()
    const info = store.addInfoAlert('infoAlert here')
    const success = store.addSuccessAlert('successAlert here')
    const warning = { type: 'warning', message: 'warningAlert here' }
    const newInfo = { ...info, message: 'its newInfo' }

    test('getAlertById works', () => {
      expect(store.getAlertById(success.id)).toMatchObject(success)
    })
    test('updateAlert finds and updates existing alerts', () => {
      expect(store.updateAlert(newInfo)).toMatchObject({ message: 'its newInfo' })
    })
    test('updateAlert creates a new entry if called on new alert', () => {
      expect(store.alerts).toHaveLength(2)
      expect(store.updateAlert(warning)).toMatchObject(warning)
      expect(store.alerts).toHaveLength(3)
    })
    // Running this here since there are several alerts added from this test
    test('testing removeAlertById', () => {
      let originalLength = store.alerts.length
      expect(store.getAlertById(newInfo.id)).toMatchObject(newInfo)
      store.removeAlertById(newInfo.id)
      expect(store.getAlertById(newInfo.id)).toEqual(undefined)
      expect(store.alerts).toHaveLength(originalLength - 1)
    })
  })
})
