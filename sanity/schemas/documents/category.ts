import { defineType, defineField } from 'sanity';

const category = defineType({
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(50)
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      validation: (Rule) => Rule.max(200)
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
