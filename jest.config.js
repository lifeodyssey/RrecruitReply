/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '\.css$': 'identity-obj-proxy',
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__tests__/mocks/fileMock.js'
  },
  transform: {
    '^.+\.(ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }],
    '^.+\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|@mswjs)/).+\.js$'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  // Add coverage settings
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  // Set test environment variables if needed
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  },
  // Add globals for TextEncoder/TextDecoder
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      jsx: 'react-jsx',
    }
  },
};

module.exports = config;
