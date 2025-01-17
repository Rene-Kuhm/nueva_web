import { StructureBuilder } from 'sanity/desk';
import { CogIcon, DocumentIcon, UsersIcon, TagIcon } from '@sanity/icons';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Posts')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('post')
            .title('Posts')
            .child((documentId) => S.document().documentId(documentId).schemaType('post'))
        ),
      S.divider(),
      S.listItem()
        .title('Autores')
        .icon(UsersIcon)
        .child(S.documentTypeList('author').title('Autores')),
      S.listItem()
        .title('Categorías')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categorías')),
      S.divider(),
      S.listItem()
        .title('Configuración')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Configuración del Sitio')
        ),
    ]);
