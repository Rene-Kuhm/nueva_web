import { defineType, defineField, PreviewValue, StringRule, SlugRule, ImageRule, ArrayRule } from 'sanity';

type BlockContent = {
  title: string;
  type: 'block';
  styles: Array<{ title: string; value: string }>;
  lists: Array<never>;
};

const author = defineType({
  name: 'author',
  title: 'Autor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (rule: StringRule) => rule.required().min(2).max(50)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: (rule: SlugRule) => rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Imagen',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (rule: ImageRule) => rule.required()
    }),
    defineField({
      name: 'bio',
      title: 'Biografía',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: []
        }
      ],
      validation: (rule: ArrayRule<BlockContent[]>) => rule.max(500)
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
