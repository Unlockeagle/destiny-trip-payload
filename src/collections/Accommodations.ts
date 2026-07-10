import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { slugField, type CollectionConfig } from 'payload'

export const Accommodations: CollectionConfig = {
  slug: 'accommodations',

  labels: {
    singular: {
      en: 'Accommodation',
      es: 'Alojamiento',
    },
    plural: {
      en: 'Accommodations',
      es: 'Alojamientos',
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
    defaultColumns: ['title', 'address', 'cover_image', 'country'],
    group: 'Catalogo',
    description: {
      en: 'A collection of hotels available for you to manage, organize, and offer the best accommodation options to your clients via the Destiny Trip administrative panel.',
      es: 'Colección de hoteles disponibles para gestionar, organizar y ofrecer las mejores opciones de alojamiento a tus clientes desde el panel administrativo de Destiny Trip.',
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── TAB: Contenido general ───────────────────────────────
        {
          label: 'Información general',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: { en: '🛎️ Hotel Name', es: '🛎️ Nombre del hotel' },
              required: true,
              unique: true,
            },
            {
              name: 'address',
              type: 'textarea',
              label: { en: '📍 Hotel Address', es: '📍 Dirección del hotel' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'country',
                  type: 'text',
                  label: { en: '🌍Country', es: '🌍 País' },
                },
                {
                  name: 'state',
                  type: 'text',
                  label: { en: '📌 State', es: '📌 Estado o provincia' },
                },
              ],
            },
            {
              name: 'info',
              type: 'array',
              label: { en: 'Adicional information', es: 'Información adicional de contacto' },

              admin: {
                description: {
                  en: 'Add phone, emails, social media or any contact details',
                  es: 'Agrega teléfonos, emails, redes sociales o cualquier dato de contacto',
                },
              },
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Tipo',
                  required: true,
                  options: [
                    {
                      label: '📞 Teléfono',
                      value: 'phone',
                    },
                    {
                      label: '📱 WhatsApp',
                      value: 'whatsapp',
                    },
                    { label: '📧 Email', value: 'email' },
                    {
                      label: '👔 Nombre de contacto',
                      value: 'contact',
                    },
                    {
                      label: '📍 Numero Postal',
                      value: 'zip',
                    },
                    {
                      label: '🌐 Sitio Web',
                      value: 'website',
                    },
                    {
                      label: '📘 Facebook',
                      value: 'facebook',
                    },
                    {
                      label: '📸 Instagram',
                      value: 'instagram',
                    },
                    {
                      label: '💼 LinkedIn',
                      value: 'linkedin',
                    },
                    { label: '🎵 TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Etiqueta',
                  admin: {
                    description: 'Ej: Oficina Principal, Soporte, Ventas.',
                  },
                },
                {
                  name: 'value',
                  type: 'text',
                  label: 'Valor',
                  required: true,
                  admin: {
                    description: 'Ej: +58 412 123 4567',
                  },
                },
                {
                  name: 'isPublic',
                  type: 'checkbox',
                  label: 'Visible en el sitio',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'cover_image',
              type: 'upload',
              label: 'Imagen Principal',
              relationTo: 'media',
            },
            {
              name: 'gallery_images',
              type: 'upload',
              label: 'Galería de imágenes',
              relationTo: 'media',
              hasMany: true,
              maxRows: 5,
            },
          ],
        },

        // ─── TAB: Precios ─────────────────────────────────────────
        {
          label: 'Precio',
          fields: [
            {
              name: 'price',
              label: 'Precio',
              type: 'number',
              admin: {
                description: 'Precio alojamiento por persona en $',
              },
              defaultValue: 0,
            },
            {
              name: 'expiration-date',
              label: 'Fecha de Expiración',
              type: 'date',
              admin: {
                description: 'Fecha final del precio',
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
