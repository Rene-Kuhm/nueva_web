import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { colorInput } from '@sanity/color-input'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './sanity/schemas' // Corregida la ruta a la ubicación correcta

export default defineConfig({
  name: 'default',
  title: 'Nueva Web',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  plugins: [
    deskTool(),
    visionTool(),
    media(),
    colorInput(),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  }
})
