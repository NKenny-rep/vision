import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { neon } from '@neondatabase/serverless'
import pg from 'pg'
import * as schema from './schema'

const { Pool } = pg

// Create a singleton connection to the database
let _db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePostgres> | null = null

const isDocker = process.env.DOCKER_ENV === 'true'

export function useDB() {
  if (!_db) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    if (isDocker) {
      // Use node-postgres for Docker local PostgreSQL
      const pool = new Pool({ 
        connectionString: databaseUrl,
        ssl: false
      })
      _db = drizzlePostgres(pool, { schema })
    } else {
      // Use Neon HTTP driver for Neon/remote databases
      const sql = neon(databaseUrl)
      _db = drizzleNeon(sql, { schema })
    }
  }

  return _db
}

// Export schema for convenience
export * from './schema'
