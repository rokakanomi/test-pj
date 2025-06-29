import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^/vite.svg$': '<rootDir>/__mocks__/fileMock.js',
    '^./assets/react.svg$': '<rootDir>/__mocks__/fileMock.js',
    '^./App.css$': 'identity-obj-proxy'
  },
};

export default config;
