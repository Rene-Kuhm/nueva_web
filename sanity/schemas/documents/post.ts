import { defineType, defineField, PreviewValue } from 'sanity';

const post = defineType({
  name: 'post',
  title: 'Publicación',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'categories',
      title: 'Categorías',
      type: 'array',
      of: [{ 
        type: 'reference', 
        to: [{ type: 'category' }] 
      }],
      validation: (Rule) => Rule.min(1).max(3)
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publicado el',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'blockContent',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Etiquetas',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'readTime',
      title: 'Tiempo de Lectura',
      type: 'number',
      description: 'Tiempo estimado de lectura en minutos'
    }),
    defineField({
      name: 'featured',
      title: 'Destacado',
      type: 'boolean',
      description: 'Marcar como publicación destacada'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection): PreviewValue {
      const { title, author, media } = selection;
      return {
        title,
        subtitle: author ? `por ${author}` : '',
        media: media ? media.asset.url : undefined
      };
    }
  },
  
  // Reglas de ordenación por defecto
  orderings: [
    {
      title: 'Fecha de Publicación, Nuevo',
      name: 'publishedAtDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Fecha de Publicación, Antiguo',
      name: 'publishedAtAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' }
      ]
    }
  ]
});

export default post;
