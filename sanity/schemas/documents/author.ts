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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'text',
    }),
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
