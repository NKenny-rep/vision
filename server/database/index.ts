import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Create a singleton connection to the database
let _db: ReturnType<typeof drizzle> | null = null

export function useDB() {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    const sql = neon(databaseUrl)
    _db = drizzle(sql, { schema })
  }

  return _db
}

// Export schema for convenience
export * from './schema'
