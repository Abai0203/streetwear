import type { CollectionConfig } from 'payload'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  access: {
    read: ({ req: { user } }) => !!user,
    create: () => true,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true },
    { name: 'phone', label: 'Телефон', type: 'text' },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Покупатель', value: 'customer' },
        { label: 'Администратор', value: 'admin' },
      ],
    },
  ],
}
