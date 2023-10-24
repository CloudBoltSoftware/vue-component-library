import { vi } from 'vitest'

// In the cases this is mocked, we don't care about actually creating
export const createI18n = vi.fn()

// useI18n must be used in a setup() function, but we use it sometimes in
// composables (which is ok because they're called in setup functions).
// So for testing composables that use useI18n, we need to mock it.
export function useI18n() {
  return {
    t: vi.fn().mockImplementation((key) => key)
  }
}
