// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to transpile TypeScript files
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Fix for ESM import paths if needed
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat TypeScript files as ES modules
  testMatch: ['**/test/**/*.test.ts'], // Test files pattern
  clearMocks: true,
  verbose: true,
}

export default config
