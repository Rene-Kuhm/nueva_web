import { defineType, defineField, PreviewValue } from 'sanity';

const author = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
      validation: (Rule) => Rule.max(500)
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes Sociales',
      type: 'object',
      fields: [
        defineField({
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url'
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url'
        }),
        defineField({
          name: 'github',
          title: 'GitHub',
          type: 'url'
        })
      ]
    }),
    defineField({
      name: 'expertise',
      title: 'Áreas de Experiencia',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo'
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    },
    prepare(selection): PreviewValue {
      const { title, media } = selection;
      return {
        title,
        media: media ? media.asset.url : undefined
      };
    }
  }
});

export default author;
