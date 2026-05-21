import nextJest from 'next/jest'
import type { Config } from 'jest'



const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  verbose: true,
  projects: [
    {
      displayName: 'integration',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/integrations/**/*.test.ts'],
      globalSetup: '<rootDir>/jest.globalSetup.ts',
      globalTeardown: '<rootDir>/jest.globalTeardown.ts',
      transformIgnorePatterns: ['node_modules/(?!(jose)/)'],
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
      transform: { '^.+\\.(ts|tsx)$': ['ts-jest', {}] },
    },
    {
      displayName: 'ui',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/__tests__/ui/**/*.test.tsx'],
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
      moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
      transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }] },
    },
  ],
}

export default createJestConfig(config)