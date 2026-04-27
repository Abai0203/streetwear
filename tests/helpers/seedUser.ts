import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}

export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: {
      email: { equals: testUser.email },
    },
  })

  if (existing.docs.length > 0) {
    await payload.delete({
      collection: 'users',
      id: existing.docs[0].id,
    })
  }

  // 🔥 ФИКС: bypass overload Payload create (самая стабильная версия)
  await (payload.create as any)({
    collection: 'users',
    data: testUser,
  })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: {
      email: { equals: testUser.email },
    },
  })

  if (existing.docs.length > 0) {
    await payload.delete({
      collection: 'users',
      id: existing.docs[0].id,
    })
  }
}
