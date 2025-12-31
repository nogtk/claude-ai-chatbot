import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('Prisma Client initialization', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('should export a valid prisma instance in development', async () => {
    process.env.NODE_ENV = 'development'
    const prisma = await import('@/src/lib/db/prisma').then((m) => m.default)

    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
    expect(prisma).toHaveProperty('conversation')
    expect(prisma).toHaveProperty('message')
  })

  it('should have conversation model methods', async () => {
    const prisma = await import('@/src/lib/db/prisma').then((m) => m.default)

    expect(prisma.conversation).toHaveProperty('create')
    expect(prisma.conversation).toHaveProperty('findUnique')
    expect(prisma.conversation).toHaveProperty('findMany')
    expect(prisma.conversation).toHaveProperty('delete')
  })

  it('should have message model methods', async () => {
    const prisma = await import('@/src/lib/db/prisma').then((m) => m.default)

    expect(prisma.message).toHaveProperty('create')
    expect(prisma.message).toHaveProperty('findUnique')
    expect(prisma.message).toHaveProperty('findMany')
  })
})
