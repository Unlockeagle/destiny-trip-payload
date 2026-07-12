import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField, type CollectionConfig } from 'payload'

import {
  BlockquoteFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  labels: {
    singular: {
      en: 'Destination',
      es: 'Destino',
    },
    plural: {
      en: 'Destinations',
      es: 'Destinos',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'type', 'featured'],
    group: 'Catalogo',
    description: {
      en: 'Destinations supported by your agency',
      es: 'Destinos soportados por tu agencia',
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  // `type` is derived from `country` (Venezuela = national, anything else =
  // international). Nobody edits it by hand, so it can never drift out of
  // sync with the actual country.
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.country) {
          data.type =
            data.country.trim().toLowerCase() === 'venezuela' ? 'national' : 'international'
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Content', es: 'Contenido' },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: { en: 'Title', es: 'Título' },
            },
            {
              name: 'description',
              type: 'text',
              localized: true,
              label: { en: 'Short description', es: 'Descripción corta' },
              admin: {
                description: {
                  en: 'Used in listing cards and search results snippets',
                  es: 'Se usa en tarjetas de listado y snippets de resultados de búsqueda',
                },
              },
            },
            {
              name: 'country',
              type: 'text',
              required: true,
              label: { en: '🌎 Country', es: '🌎 País' },
              admin: { position: 'sidebar' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'departure',
                  type: 'text',
                  label: { en: '🛫 Departure', es: '🛬 Sale desde' },
                },
                {
                  name: 'arrival',
                  type: 'text',
                  label: { en: '🛬 Arrival', es: '🛬 Llega a' },
                },
              ],
            },

            {
              name: 'priceFrom',
              type: 'number',
              label: { en: 'Price from', es: 'Precio desde' },
              admin: {
                position: 'sidebar',
                description: {
                  en: 'Reference "from" price for listing cards only. Real pricing lives in Packages/Cruises.',
                  es: 'Precio referencial "desde" solo para tarjetas de listado. El precio real vive en Packages/Cruises.',
                },
              },
            },
            {
              name: 'features',
              type: 'array',
              localized: true, // el label/detalle sí se traduce; el "icon" no debería
              label: { en: 'Included features', es: 'Características incluidas' },
              labels: {
                singular: { en: 'Feature', es: 'Característica' },
                plural: { en: 'Features', es: 'Características' },
              },
              admin: {
                description: {
                  en: 'Highlights shown as icons/badges on the destination page (luggage, meals, transfers, etc.)',
                  es: 'Se muestran como íconos/badges en la página del destino (maletas, comidas, traslados, etc.)',
                },
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  label: { en: 'Icon', es: 'Ícono' },
                  // OJO: este campo NO debería ser localized (es un valor técnico, no texto)
                  options: [
                    { label: { en: 'Luggage', es: 'Maletas' }, value: 'luggage' },
                    { label: { en: 'Meals', es: 'Comidas' }, value: 'meals' },
                    { label: { en: 'Transfers', es: 'Traslados' }, value: 'transfers' },
                    { label: { en: 'Wifi', es: 'Wifi' }, value: 'wifi' },
                    { label: { en: 'Insurance', es: 'Seguro de viaje' }, value: 'insurance' },
                    { label: { en: 'Guide', es: 'Guía turístico' }, value: 'guide' },
                    { label: { en: 'Hotel', es: 'Hotel' }, value: 'hotel' },
                    { label: { en: 'Flight', es: 'Vuelo' }, value: 'flight' },
                    { label: { en: 'Other', es: 'Otro' }, value: 'other' },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: { en: 'Label', es: 'Etiqueta' },
                  admin: {
                    description: {
                      en: 'e.g. "2 checked bags 23kg" or "Breakfast included"',
                      es: 'ej. "2 maletas de 23kg" o "Desayuno incluido"',
                    },
                  },
                },
              ],
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Main image', es: 'Imagen principal' },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: { en: 'Gallery', es: 'Galería' },
            },
          ],
        },
        {
          label: { en: 'Page Content', es: 'Contenido de pagina' },
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
                  BlockquoteFeature(),
                  LinkFeature({
                    // esto habilita el link a documentos internos (no solo URL externa)
                    enabledCollections: ['pages', 'posts'],
                    fields: ({ defaultFields }) => [
                      ...defaultFields,
                      {
                        name: 'rel',
                        type: 'select',
                        hasMany: true,
                        options: ['nofollow', 'sponsored'],
                      },
                    ],
                  }),
                  UploadFeature({
                    collections: {
                      media: {
                        fields: [
                          { name: 'alt', type: 'text' }, // alt para SEO/accesibilidad
                          { name: 'caption', type: 'text' },
                        ],
                      },
                    },
                  }),
                ],
              }),
              label: { en: 'Full description', es: 'Descripción completa' },
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
              localized: true,
              label: { en: 'FAQs', es: 'Preguntas frecuentes' },
              labels: {
                singular: { en: 'FAQ', es: 'Pregunta' },
                plural: { en: 'FAQs', es: 'Preguntas' },
              },
              admin: {
                description: {
                  en: 'Powers an FAQPage schema block for rich snippets in Google',
                  es: 'Alimenta un bloque de schema FAQPage para rich snippets en Google',
                },
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: { en: 'Question', es: 'Pregunta' },
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: { en: 'Answer', es: 'Respuesta' },
                },
              ],
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
    {
      name: 'type',
      type: 'select',
      required: true,
      label: { en: 'Type', es: 'Tipo' },
      options: [
        { label: { en: 'National', es: 'Nacional' }, value: 'national' },
        { label: { en: 'International', es: 'Internacional' }, value: 'international' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: {
          en: 'Auto-computed from country',
          es: 'Calculado automáticamente según el país',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: { en: 'Activate', es: 'Activo' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Destiny Is Activate?',
          es: 'Destino Activo?',
        },
      },
    },
  ],
}
