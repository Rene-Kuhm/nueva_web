module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable specific ESLint rules if needed
    'react/jsx-key': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
      ],
    }
  ]
};
