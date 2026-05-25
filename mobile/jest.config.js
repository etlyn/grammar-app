module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@grammar/(.*)$': '<rootDir>/../src/$1',
    '^@env$': '<rootDir>/src/test-utils/env-mock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|@react-native-community|react-native|@react-navigation|@react-native-async-storage|react-native-url-polyfill|react-native-gesture-handler|react-native-reanimated|react-native-worklets)/)',
  ],
};