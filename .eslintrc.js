module.exports = {
  env: {
    browser: true,
    es2021: true,
    serviceworker: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    gtag: 'readonly',
    ga: 'readonly'
  },
  rules: {
    // Customize rules as needed
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': ['error', 'never'],
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'always']
  },
  ignorePatterns: [
    '_site/',
    'node_modules/',
    'vendor/'
  ]
};