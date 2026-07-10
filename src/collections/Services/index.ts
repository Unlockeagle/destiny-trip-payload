import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField, type CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: {
      en: 'Service',
      es: 'Servicio',
    },
    plural: {
      en: 'Services',
      es: 'Servicios',
    },
  },
  versions: {
    drafts: true,
  },
  admin: {
    useAsTitle: 'title',
    description: { en: 'Services details', es: 'Detalle de tus servicios' },
    group: 'Catalogo',
  },
  defaultSort: ['title'], // This will sort title of posts by Ascending
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Content',
            es: 'Contenido',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: {
                description: {
                  en: 'Enter an attractive title',
                  es: 'Indica un título atractivo',
                },
              },
            },
            {
              name: 'description',
              type: 'text',
              required: true,
              admin: {
                description: {
                  en: 'Briefly describe your service',
                  es: 'Describe brevemente tu servicio',
                },
              },
            },

            {
              name: 'benefits',
              type: 'array',
              admin: {
                description: 'Agrega características principales de tu servicio',
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: { en: 'Add a image', es: 'Agrega una imagen' },
              },
            },
          ],
        },
        {
          name: 'page-content',
          label: { en: 'Page Content', es: 'Contenido de pagina' },
          admin: {
            description: {
              en: "ℹ️ This content will be used for this service's page; it is essential for SEO.",
              es: 'ℹ️ Este contenido sera utilizado para la pagina de este servicio, esencial para el SEO.',
            },
          },
          fields: [
            {
              name: 'long-description',
              type: 'richText',
              required: true,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature(),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  ParagraphFeature(),
                ],
              }),
              admin: {
                description: {
                  en: 'Create a detailed description of at least 300 words.',
                  es: 'Crea una descripción detallada no menos de 300 palabras',
                },
              },
            },
            {
              name: 'faqs',
              type: 'array',
              admin: { description: 'Preguntas frecuentes (schema FAQPage)' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          name: 'offer',
          label: { en: 'Price', es: 'Precios' },
          admin: {
            description: {
              en: 'ℹ️ Use this to provide pricing information for services.',
              es: 'ℹ️ Usar en caso de querer informar los precios de los servicios.',
            },
          },
          fields: [
            {
              name: 'priceFrom',
              type: 'number',
              admin: {
                description:
                  'Si tu servicio se puede comprar por separado, puedes agregar un precio',
              },
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'EUR',
              options: ['EUR', 'USD', 'VES'],
              admin: {
                description: { en: 'Select your currency', es: 'Selecciona la moneda' },
              },
            },
          ],
        },
      ],
    },

    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },

      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },

    slugField({
      position: 'sidebar',
    }),
  ],
}
