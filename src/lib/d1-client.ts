/**
 * Cloudflare D1 Database Client
 * Provides a connection layer for D1 database operations
 */

import { PrismaClient } from '../generated/prisma'

// For local development, use the regular Prisma client
function createPrismaClient() {
  if (process.env.NODE_ENV === 'development') {
    return new PrismaClient()
  }

  // In production, we'll need to adapt this for D1
  // This might require a different approach depending on your deployment strategy
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./dev.db',
      },
    },
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// D1-specific functions for direct database access
export class D1DatabaseClient {
  private db: any // Cloudflare D1 binding

  constructor(database?: any) {
    this.db = database
  }

  async query(sql: string, params: any[] = []) {
    if (!this.db) {
      throw new Error('D1 database binding not available')
    }

    return await this.db
      .prepare(sql)
      .bind(...params)
      .all()
  }

  async execute(sql: string, params: any[] = []) {
    if (!this.db) {
      throw new Error('D1 database binding not available')
    }

    return await this.db
      .prepare(sql)
      .bind(...params)
      .run()
  }
}

// Export a factory function for creating D1 clients
export function createD1Client(database: any) {
  return new D1DatabaseClient(database)
}
