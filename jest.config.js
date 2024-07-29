module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
  },
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(specs|test).[jt]s?(x)'],
  reporters: [
      'default',
      [
          'jest-sonar',
          {
              outputDirectory: 'reports',
              outputName: 'sonar-report.xml'
          }
      ]
  ]
};