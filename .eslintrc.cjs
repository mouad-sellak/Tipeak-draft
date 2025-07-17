/* eslint-env node */
module.exports = {
    root: true,
    // On utilise parser env JS moderne
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    env: {
      node: true,
      es2022: true,
      browser: false, // override côté client
    },
    extends: [
      'eslint:recommended',
    ],
    // Règles communes légères pour ne pas bloquer un junior
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off', // autorisé en dev
    },
    ignorePatterns: [
      'node_modules/',
      'dist/',
      'build/',
    ],
  };
  