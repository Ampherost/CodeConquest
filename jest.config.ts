// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Tell next/jest where your Next.js app is
  dir: './',
})

const customJestConfig: Config = {
  // Use V8 coverage (optional)
  coverageProvider: 'v8',

  // Run tests in a jsdom environment so <Header /> and other components can be rendered
  testEnvironment: 'jest-environment-jsdom',

  // Automatically clear mocks between every test (optional but recommended)
  clearMocks: true,

  // If you use absolute imports like `import X from '@/components/X'`, map them here:
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // Load this before running each test file—so you get `toBeInTheDocument()`, etc.
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Ignore Next.js build output and node_modules when looking for tests
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

export default createJestConfig(customJestConfig)

