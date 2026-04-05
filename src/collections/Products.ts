import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
  ],
};