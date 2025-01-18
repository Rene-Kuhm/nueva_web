/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals'
  ],
  plugins: [],
  rules: {
    // Personaliza las reglas según sea necesario
    'no-unused-vars': 'warn',
    '@next/next/no-img-element': 'warn'
  },
  settings: {
    next: {
      rootDir: ['./']
    }
  }
};
