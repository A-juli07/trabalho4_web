// eslint.config.js
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      // Prettier como regra do ESLint
      'prettier/prettier': 'error',

      // Boas práticas
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Qualidade de código
      'no-console': 'off', // Permitido para logs
      'no-debugger': 'error',
      'no-alert': 'warn',

      // ES6+
      'arrow-spacing': 'error',
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
    },
  },
  {
    // Ignora node_modules e coverage
    ignores: ['node_modules/**', 'coverage/**'],
  },
  prettierConfig,
];
