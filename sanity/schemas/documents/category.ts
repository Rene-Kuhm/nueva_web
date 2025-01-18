import { defineField, defineType } from 'sanity';
import type { StringRule, SlugRule, TextRule } from 'sanity';

const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule: StringRule) => rule.required().min(2).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule: SlugRule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      validation: (rule: TextRule) => rule.max(200),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'color'
    })
  ],
  preview: {
    select: {
      title: 'title',
      color: 'color'
    },
    prepare(selection: { 
      title: string, 
      color?: string 
    }) {
      const { title, color } = selection;
      return {
        title,
        subtitle: color ? `Color: ${color}` : 'Sin color',
      };
    }
  }
});

export default category;
