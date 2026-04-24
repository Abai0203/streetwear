import type { CollectionConfig } from 'payload'
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'total', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'orderNumber', label: 'Номер заказа', type: 'text' },
    { name: 'customer', label: 'Покупатель', type: 'relationship', relationTo: 'users' },
    {
      name: 'items',
      label: 'Товары',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'qty', label: 'Кол-во', type: 'number' },
        { name: 'size', label: 'Размер', type: 'text' },
        { name: 'price', label: 'Цена', type: 'number' },
      ],
    },
    { name: 'total', label: 'Итого (сом)', type: 'number' },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: '⏳ Новый', value: 'pending' },
        { label: '✅ Подтверждён', value: 'confirmed' },
        { label: '📦 Отправлен', value: 'shipped' },
        { label: '🚀 Доставлен', value: 'delivered' },
        { label: '❌ Отменён', value: 'cancelled' },
      ],
    },
    { name: 'phone', label: 'Телефон', type: 'text' },
    { name: 'address', label: 'Адрес', type: 'text' },
    { name: 'city', label: 'Город', type: 'text' },
    {
      name: 'paymentMethod',
      label: 'Способ оплаты',
      type: 'select',
      options: [
        { label: 'Наличными', value: 'cash' },
        { label: 'Карта', value: 'card' },
        { label: 'MBANK', value: 'mbank' },
        { label: 'O!Money', value: 'omoney' },
      ],
    },
    { name: 'comment', label: 'Комментарий', type: 'textarea' },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.orderNumber)
          data.orderNumber = `STR-${Date.now().toString().slice(-6)}`
        return data
      },
    ],
  },
  timestamps: true,
}
