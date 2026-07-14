import type { Block } from 'payload'

export const FeaturedDestinations: Block = {
  slug: 'destinations',
  interfaceName: 'DestinationsBlock', // 👈 fuerza el nombre exacto del tipo generado

  labels: {
    singular: {
      en: 'Destinations Block',
      es: 'Bloque de Destinos',
    },
    plural: {
      en: 'Destinations Blocks',
      es: 'Bloques de Destinos',
    },
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { en: 'Title', es: 'Título' },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      localized: true,
      label: { en: 'Subtitle', es: 'Subtítulo' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'showCardBadge',
          type: 'checkbox',
          defaultValue: false,
          label: { en: 'Show badge on cards', es: 'Mostrar etiqueta en las cards' },
          admin: {
            description: {
              en: 'Displays a small label on every card of this block',
              es: 'Muestra una pequeña etiqueta en cada card de este bloque',
            },
          },
        },
        {
          name: 'cardBadgeLabel',
          type: 'text',
          localized: true,
          label: { en: 'Badge text', es: 'Texto de la etiqueta' },
          defaultValue: 'Popular',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.showCardBadge),
            description: {
              en: 'e.g. "Popular", "Featured", "Best seller", "New"',
              es: 'ej. "Popular", "Destacada", "Más vendido", "Nuevo"',
            },
          },
        },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 12,
      label: { en: 'Number of cards', es: 'Cantidad de cards' },
      admin: {
        description: {
          en: 'How many destinations will be displayed in this block',
          es: 'Cuántos destinos se mostrarán en este bloque',
        },
      },
    },
    {
      name: 'type',
      type: 'select',
      label: { en: 'Filter by type', es: 'Filtrar por tipo' },
      defaultValue: 'all',
      options: [
        { label: { en: 'All', es: 'Todos' }, value: 'all' },
        { label: { en: 'National', es: 'Nacional' }, value: 'national' },
        { label: { en: 'International', es: 'Internacional' }, value: 'international' },
      ],
      admin: {
        description: {
          en: 'Only shows destinations matching this type. "All" ignores this filter.',
          es: 'Solo muestra destinos que coincidan con este tipo. "Todos" ignora este filtro.',
        },
      },
    },
    {
      name: 'destinations',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
      label: { en: 'Manual selection (optional)', es: 'Selección manual (opcional)' },
      admin: {
        description: {
          en: 'Leave empty to auto-pull active destinations by the filters above. Fill it to hand-pick specific destinations instead (overrides "limit" and "type").',
          es: 'Déjalo vacío para traer automáticamente destinos activos según los filtros de arriba. Complétalo para elegir destinos específicos a mano (esto ignora "limit" y "tipo").',
        },
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      localized: true,
      label: { en: 'CTA label', es: 'Texto del botón' },
      defaultValue: 'Ver todos los destinos',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: { en: 'CTA link', es: 'Enlace del botón' },
      admin: {
        description: {
          en: 'e.g. /destinos',
          es: 'ej. /destinos',
        },
      },
    },
  ],
}
