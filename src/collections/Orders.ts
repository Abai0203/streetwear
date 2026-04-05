import type { CollectionConfig } from 'payload'
import type { Product } from '../payload-types'

type OrderItem = {
  product: string | number
  quantity: number
  price: number
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.items?.length) {
          const items = await Promise.all(
            data.items.map(async (item: { product: string; quantity: number; price: number }) => {
              const book = (await req.payload.findByID({
                collection: 'products',
                id: item.product,
              })) as Product

              return {
                ...item,
                price: book.price,
              }
            }),
          )
          data.items = items
          data.total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        }
        return data
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      return { user: { equals: user?.id } }
    },
    create: ({ req: { user } }) => !!user,
  },
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          hasMany: false,
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'pending',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Processing', value: 'processing' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'Delivered', value: 'delivered' },
            { label: 'Cancelled', value: 'cancelled' },
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          required: true,
          options: [
            { label: 'Card', value: 'card' },
            { label: 'Cash', value: 'cash' },
          ],
        },
        {
          name: 'total',
          type: 'number',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'shippingAddress',
          type: 'text',
          required: true,
          admin: {
            width: '75%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              required: true,
            },
            {
              name: 'quantity',
              type: 'number',
              required: true,
            },
            {
              name: 'price',
              type: 'number',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}