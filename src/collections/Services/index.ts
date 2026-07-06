import type { CollectionConfig } from 'payload'

// Una sola colección genérica para Seguro de viaje, Transporte y Boletos aéreos.
// Los tres comparten la misma forma (título, beneficios, precio desde) y en la
// práctica funcionan como páginas de servicio con botón de cotizar, no como
// catálogos con muchos ítems distintos entre sí. Si en el futuro alguno de
// estos crece con campos muy propios (ej. boletos aéreos con buscador de vuelos
// en tiempo real vía API), sepáralo en su propia colección en ese momento.
export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'titulo', description: 'Detalle de tus servicios', group: 'Products' },
  access: { read: () => true },
  fields: [
    {
      name: 'tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Seguro de viaje', value: 'seguro' },
        { label: 'Transporte', value: 'transporte' },
        { label: 'Boletos aéreos', value: 'boletos_aereos' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'titulo',
      type: 'text',
      required: true,
      admin: {
        description: 'Indica un titulo atractivo para tu servicio',
      },
    },
    {
      name: 'descripcion',
      type: 'richText',
      admin: {
        description: 'Describe brevemente tu servicio',
      },
    },
    {
      name: 'beneficios',
      type: 'array',
      fields: [{ name: 'item', type: 'text' }],
      admin: { description: 'Agrega características principales de tu servicios' },
    },
    {
      name: 'precioDesde',
      type: 'number',
      admin: {
        description: 'Si tu servicio se puede comprar por separado, puedes agregar un precio',
      },
    },
    {
      name: 'imagen',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Agrega una imagen' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Sirve para el SEO' },
    },
  ],
}
