module.exports = {
  preset: 'ts-jest',
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