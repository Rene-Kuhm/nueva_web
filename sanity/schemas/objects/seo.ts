import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Título',
      type: 'string',
      description: 'Título para motores de búsqueda (máximo 60 caracteres)',
      validation: (Rule) => Rule.max(60).warning('El título debe ser menor a 60 caracteres')
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Descripción',
      type: 'text',
      description: 'Descripción para motores de búsqueda (máximo 160 caracteres)',
      validation: (Rule) => Rule.max(160).warning('La descripción debe ser menor a 160 caracteres')
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL Canónica',
      type: 'url',
      description: 'URL canónica para evitar contenido duplicado'
    }),
    defineField({
      name: 'noIndex',
      title: 'No Indexar',
      type: 'boolean',
      description: 'Evitar que los motores de búsqueda indexen esta página'
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Imagen Open Graph',
      type: 'image',
      description: 'Imagen para compartir en redes sociales',
      options: {
        hotspot: true
      }
    })
  ],
  preview: {
    select: {
      title: 'metaTitle',
      subtitle: 'metaDescription'
    }
  }
});
