import type { CollectionConfig } from 'payload'
export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'price', 'category', 'tag', 'inStock'] },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'name', label: 'Название', type: 'text', required: true },
    { name: 'description', label: 'Описание', type: 'textarea' },
    { name: 'price', label: 'Цена (сом)', type: 'number', required: true },
    { name: 'oldPrice', label: 'Старая цена (сом)', type: 'number' },
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'tag',
      label: 'Тэг',
      type: 'select',
      options: [
        { label: 'Новинка', value: 'NEW' },
        { label: 'Хит', value: 'HIT' },
        { label: 'Скидка', value: 'SALE' },
      ],
    },
    {
      name: 'images',
      label: 'Фотографии',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    {
      name: 'sizes',
      label: 'Размеры',
      type: 'select',
      hasMany: true,
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'ONE SIZE'].map((v) => ({ label: v, value: v })),
    },
    { name: 'inStock', label: 'В наличии', type: 'checkbox', defaultValue: true },
    { name: 'rating', label: 'Рейтинг (1-5)', type: 'number', min: 1, max: 5, defaultValue: 5 },
    { name: 'material', label: 'Состав', type: 'text' },
  ],
}
