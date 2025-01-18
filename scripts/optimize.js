#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Función para limpiar caché y optimizar
function optimizeProject() {
  console.log('🚀 Iniciando optimización del proyecto...');

  try {
    // Limpiar caché de Next.js
    console.log('🧹 Limpiando caché de Next.js...');
    execSync('npm run clean', { stdio: 'inherit' });

    // Instalar dependencias de forma optimizada
    console.log('📦 Instalando dependencias...');
    execSync('npm ci', { stdio: 'inherit' });

    // Optimizar dependencias
    console.log('🔧 Optimizando dependencias...');
    execSync('npm prune', { stdio: 'inherit' });

    // Compilación de producción
    console.log('🏗️ Compilando para producción...');
    execSync('npm run build', { stdio: 'inherit' });

    // Analizar tamaño de paquetes
    console.log('📊 Analizando tamaño de paquetes...');
    execSync('npx webpack-bundle-analyzer .next/stats.json', { stdio: 'inherit' });

    console.log('✅ Optimización completada con éxito!');
  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
    process.exit(1);
  }
}

// Función para limpiar archivos generados
function cleanupFiles() {
  const filesToRemove = [
    '.next/cache',
    'node_modules/.cache',
    'build',
    'dist',
  ];

  filesToRemove.forEach(file => {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🗑️ Eliminado: ${file}`);
      } catch (error) {
        console.warn(`⚠️ No se pudo eliminar ${file}:`, error);
      }
    }
  });
}

// Ejecutar funciones
cleanupFiles();
optimizeProject();
