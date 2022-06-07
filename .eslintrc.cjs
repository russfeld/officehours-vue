/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    'vue/setup-compiler-macros': true,
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['error', { varsIgnorePattern: 'props' }],
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
