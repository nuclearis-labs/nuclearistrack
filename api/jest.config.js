module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 30000,
  roots: ['test'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dist']
};
