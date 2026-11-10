// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // React Native Animated values live in refs and are read while rendering.
      'react-hooks/refs': 'off',
      // Sheets intentionally sync mount state with the visibility prop.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
