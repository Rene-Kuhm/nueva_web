module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Customize rules as needed
    'react/jsx-key': 'off'
  },
  settings: {
    'import/resolver': {
      typescript: {}
    }
  }
};
