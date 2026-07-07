import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { GroupField } from 'payload'

export const SeoFields: GroupField = {
  name: 'meta-seo',
  label: 'SEO',
  type: 'group',
  fields: [
    OverviewField({
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
      imagePath: 'meta.image',
    }),
    MetaTitleField({
      hasGenerateFn: true,
    }),
    MetaDescriptionField({
      hasGenerateFn: true, // ← AÑADIR ESTO
    }),
    MetaImageField({
      relationTo: 'media',
    }),
    PreviewField({
      hasGenerateFn: true,
      titlePath: 'meta.title',
      descriptionPath: 'meta.description',
    }),
  ],
}
