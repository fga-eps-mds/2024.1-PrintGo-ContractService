module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/__mocks__/prisma.ts',
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