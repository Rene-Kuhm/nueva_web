import { defineType, defineArrayMember } from 'sanity';

const blockContent = defineType({
  title: 'Contenido de Bloque',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Bloque',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Cita', value: 'blockquote' }
      ],
      lists: [
        { title: 'Lista con Viñetas', value: 'bullet' },
        { title: 'Lista Numerada', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Negrita', value: 'strong' },
          { title: 'Cursiva', value: 'em' },
          { title: 'Código', value: 'code' }
        ],
        annotations: [
          {
            name: 'link',
            title: 'Enlace',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) => Rule.required()
              },
              {
                name: 'blank',
                title: 'Abrir en nueva pestaña',
                type: 'boolean'
              }
            ]
          }
        ]
      }
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto Alternativo',
          validation: (Rule) => Rule.required()
        }
      ]
    }),
    defineArrayMember({
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'Python', value: 'python' },
          { title: 'CSS', value: 'css' },
          { title: 'HTML', value: 'html' }
        ]
      }
    })
  ]
});

export default blockContent;
