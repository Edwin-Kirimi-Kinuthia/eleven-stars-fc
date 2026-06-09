import { defineConfig } from '@prisma/config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineConfig({ earlyAccess: true, schema: 'prisma/schema.prisma', datasource: { url: process.env.DATABASE_URL } } as any)
