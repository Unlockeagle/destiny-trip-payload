import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  ParagraphFeature,
} from '@payloadcms/richtext-lexical'

import { slugField, type CollectionConfig } from 'payload'

export const TravelPackages: CollectionConfig = {
  slug: 'travel-packages',
  labels: {
    singular: {
      en: 'Travel package',
      es: 'Paquete de viaje',
    },
    plural: {
      en: 'Travel Packages',
      es: 'Paquetes de viaje',
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
  admin: {
    useAsTitle: 'title',
    group: 'Catalogo',
    description:
      'Administra los paquetes de viajes disponibles y configuraciones para organizar mejor las opciones de viaje dentro del panel administrativo de Destiny Trip.',
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
              label: { en: 'Title', es: 'Titulo' },
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              label: { en: 'Description', es: 'Descripcion' },
            },
            {
              name: 'mainImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: { en: 'Main image', es: 'Imagen principal' },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: { en: 'Gallery', es: 'Galería' },
            },
            {
              name: 'highlights',
              type: 'array',
              label: { en: 'Highlights', es: 'Destacado' },
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                  label: { en: 'Highlight', es: 'Característica destacada' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Destinations & Accommodations', es: 'Destinos y Alojamientos' },
          fields: [
            {
              name: 'destinations',
              type: 'relationship',
              relationTo: 'destinations',
              hasMany: true,
              required: true,
              index: true,
              label: { en: 'Destinations', es: 'Destinos' },
              admin: {
                description: {
                  en: 'Destinations included in this package',
                  es: 'Destinos incluidos en este paquete',
                },
              },
            },
            {
              name: 'accommodations',
              type: 'relationship',
              relationTo: 'accommodations',
              hasMany: true,
              index: true,
              label: { en: 'Accommodation', es: 'Alojamiento' },
              admin: {
                description: {
                  en: 'Hotels included in this package (optional if flight-only)',
                  es: 'Hoteles incluidos en este paquete (opcional si es solo vuelo)',
                },
              },
            },
            {
              name: 'itinerary',
              type: 'array',
              label: { en: 'Itinerary', es: 'Itinerario' },
              labels: {
                singular: { en: 'Day', es: 'Día' },
                plural: { en: 'Days', es: 'Días' },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'day',
                      type: 'number',
                      required: true,
                      label: { en: 'Day #', es: 'Día #' },
                      admin: { width: '20%' },
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: { en: 'Title', es: 'Título' },
                      admin: { width: '80%' },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: { en: 'Description', es: 'Descripción' },
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
              label: { en: 'Extra content', es: 'Contenido adicional' },
              admin: {
                description: {
                  en: 'Additional page content (terms, conditions, extra info)',
                  es: 'Contenido adicional de la página (términos, condiciones, info extra)',
                },
              },
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
        {
          label: { en: 'Price', es: 'Precio' },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: { en: 'Price', es: 'Precio' },
                  admin: { width: '33%' },
                },
                {
                  name: 'discountPrice',
                  type: 'number',
                  min: 0,
                  label: { en: 'Discount price', es: 'Precio con descuento' },
                  admin: { width: '33%' },
                },
                {
                  name: 'currency',
                  type: 'select',
                  required: true,
                  defaultValue: 'USD',
                  options: [
                    { label: 'VES', value: 'VES' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ],
                  admin: { width: '34%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'nights',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: { en: 'Nights', es: 'Noches' },
                  admin: { width: '50%' },
                },
                {
                  name: 'days',
                  type: 'number',
                  required: true,
                  min: 1,
                  label: { en: 'Days', es: 'Días' },
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'includes',
              type: 'array',
              label: { en: 'Includes', es: 'Incluye' },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  label: { en: 'Item', es: 'Ítem' },
                },
              ],
            },
            {
              name: 'excludes',
              type: 'array',
              label: { en: 'Not included', es: 'No incluye' },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  label: { en: 'Item', es: 'Ítem' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: { en: 'Active', es: 'Activo' },
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      required: true,
      index: true,
      label: { en: 'Categories', es: 'Categorías' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'National / International classification',
          es: 'Clasificación Nacional / Internacional',
        },
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      index: true,
      label: { en: 'Tags', es: 'Etiquetas' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'e.g. Honeymoon, Family, Adventure',
          es: 'ej. Luna de miel, Familiar, Aventura',
        },
      },
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
