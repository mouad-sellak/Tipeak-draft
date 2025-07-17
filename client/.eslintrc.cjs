/* eslint-env node */
module.exports = {
    extends: ['../.eslintrc.cjs'],
    env: {
      browser: true, // override
      node: false,
    },
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', 'react-refresh'],
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // pas nécessaire avec React 17+
    },
  };
  