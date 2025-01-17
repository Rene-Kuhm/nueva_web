import post from './documents/post';
import author from './documents/author';
import category from './documents/category';

import blockContent from './objects/blockContent';
import seo from './objects/seo';

export const schemaTypes = [
  // Documentos
  post,
  author,
  category,
  
  // Objetos
  blockContent,
  seo
];
