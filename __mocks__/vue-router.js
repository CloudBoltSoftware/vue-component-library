import { vi } from 'vitest'

export const useRouter = vi.fn()
export const useRoute = vi.fn()
export const createRouter = vi.fn().mockReturnValue({
  beforeEach: vi.fn(),
  afterEach: vi.fn()
})
export const createWebHistory = vi.fn()
export const createMemoryHistory = vi.fn()