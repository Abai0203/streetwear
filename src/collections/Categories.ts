import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        readOnly: true, // чтобы руками не правили
      },
      hooks: {
        beforeValidate: [
          ({ data, originalDoc }) => {
            // если slug уже есть (например при обновлении) — не трогаем
            if (originalDoc?.slug) return originalDoc.slug

            if (data?.name) {
              return slugify(data.name, {
                lower: true,
                strict: true, // убирает спецсимволы
                locale: 'ru',
              })
            }
          },
        ],
      },
    },
  ],
}
