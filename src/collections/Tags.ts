import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  versions: {
    drafts: true,
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
  ],
}
