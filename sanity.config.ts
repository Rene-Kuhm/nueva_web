import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { colorInput } from '@sanity/color-input';
import { codeInput } from '@sanity/code-input';

import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'kuhmdev-blog',
  title: 'KuhmDev Blog',
  
  projectId: 'fuw1p4ub',
  dataset: 'production',
  
  plugins: [
    deskTool(),
    visionTool(),
    colorInput(),
    codeInput()
  ],
  
  schema: {
    types: schemaTypes
  },
});
