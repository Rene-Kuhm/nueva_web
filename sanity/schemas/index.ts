import post from './documents/post';
import autor from './documents/author';
import categoria from './documents/category';

import blockContent from './objects/blockContent';
import seo from './objects/seo';

export const schemaTypes = [
  // Documentos
  post,
  autor,
  categoria,

  // Objetos
  blockContent,
  seo
];
