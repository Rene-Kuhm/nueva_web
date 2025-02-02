module.exports = {
  // Configuración de estilo de código
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  arrowParens: 'always',
  
  // Configuraciones específicas
  bracketSpacing: true,
  jsxBracketSameLine: false,
  useTabs: false,
  
  // Plugins y extensiones
  plugins: [],
  
  // Configuraciones específicas por tipo de archivo
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200
      }
    }
  ]
};
