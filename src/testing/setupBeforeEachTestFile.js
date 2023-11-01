import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/vue'
import ResizeObserver from 'resize-observer-polyfill'
import { afterEach, vi } from 'vitest'

// Mock global objects (for browser compatibility) for every test
vi.stubGlobal('location', {
  origin: 'http://localhost',
  href: 'http://localhost'
})
vi.stubGlobal('CSS', { supports: () => false })
vi.stubGlobal('ResizeObserver', ResizeObserver)
vi.stubGlobal('navigator.clipboard', vi.fn())
vi.stubGlobal('open', vi.fn())
vi.stubGlobal('scrollTo', vi.fn())

// Mock external packages for every test when needed

// Add jest-dom matchers to expect (like toBeInTheDocument, etc.)
// See the list of what's available here: https://github.com/testing-library/jest-dom#table-of-contents
// Added with import statement https://github.com/testing-library/jest-dom/releases/tag/v6.0.0 in vite.config

// Set the data-test attribute as the testIdAttribute for @testing-library/vue
configure({ testIdAttribute: 'data-test' })

// Clean up from vue-testing-library after each test
// This is done automatically if using jest or if we enable globals in vitest config
// We don't want to do that though, so we'll clean up manually.
afterEach(cleanup)
