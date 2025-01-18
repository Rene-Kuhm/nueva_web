#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Función para limpiar caché y optimizar
function optimizeProject() {
  console.log('🚀 Iniciando optimización del proyecto...');

  try {
    // Limpiar caché de Next.js
    console.log('🧹 Limpiando caché de Next.js...');
    execSync('npx next clean', { stdio: 'inherit' });

    // Limpiar caché de npm
    console.log('🧹 Limpiando caché de npm...');
    execSync('npm cache clean --force', { stdio: 'inherit' });

    // Eliminar node_modules
    console.log('🗑️ Eliminando node_modules...');
    execSync('rm -rf node_modules', { stdio: 'inherit' });

    // Reinstalar dependencias
    console.log('📦 Reinstalando dependencias...');
    execSync('npm install', { stdio: 'inherit' });

    // Construir el proyecto
    console.log('🏗️ Construyendo el proyecto...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('✅ Optimización completada con éxito!');
  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
    process.exit(1);
  }
}

// Función para limpiar archivos generados
function cleanupFiles() {
  const foldersToClean = [
    '.next',
    'out',
    '.vercel',
    '.turbo',
    'node_modules/.cache'
  ];

  console.log('🧹 Limpiando archivos temporales...');

  try {
    foldersToClean.forEach(folder => {
      const folderPath = path.join(process.cwd(), folder);
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`✅ ${folder} eliminado`);
      }
    });
  } catch (error) {
    console.error('❌ Error al limpiar archivos:', error);
  }
}

// Ejecutar funciones
cleanupFiles();
optimizeProject();
