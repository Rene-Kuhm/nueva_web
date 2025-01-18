module.exports = {
  extends: [
    'next/core-web-vitals'
  ],
  
  plugins: [
    '@typescript-eslint',
    'react'
  ],
  
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // React
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    
    // ES Modules
    'import/no-commonjs': 'error'
  },
  
  overrides: [
    {
      files: ['scripts/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-commonjs': 'off'
      }
    }
  ],
  
  settings: {
    react: {
      version: 'detect'
    }
  },
  
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '*.config.js',
    '*.config.mjs',
    '.eslintrc.js'
  ]
};
